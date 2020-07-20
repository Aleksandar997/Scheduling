using Common.Base;
using Entity.Base;
using Localization.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Security.TokenProvider;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Security.TokenProvider.Interfaces;
using UserManagement.Repository;
using System.Linq;
using Microsoft.Extensions.Options;
using Security;
using Entity;
using Security.TokenProvider.Implementation;
using Microsoft.IdentityModel.Tokens;

namespace Web.Security.TokenProvider.Implementation
{
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private TokenProviderOptions _options;
        private readonly ILocalizationService _localization = DependencyInjectionResolver.GetService<ILocalizationService>();
        private readonly IUserRepository _userRepository = DependencyInjectionResolver.GetService<IUserRepository>();
        public TokenProviderMiddleware(RequestDelegate next, IOptions<TokenProviderOptions> options)
        {
            _next = next;
            _options = options.Value;
        }

        public Task Invoke(HttpContext context)
        {
            if (!context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
            {
                return _next(context);
            }
            if (!context.Request.Method.Equals("POST") || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;
                return context.Response.WriteAsync("Bad Request");
            }
            return GenerateToken(context);
        }

        private async Task GenerateToken(HttpContext context)
        {
            string grantType = context.Request.Form["grant_type"];

            if (grantType != "password" && grantType != "refresh_token" && grantType != "culture")
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Only grant_type=password and refresh_token requests are accepted by this server.");
                return;
            }

            long userId = 0;
            var permissions = new List<string>();

            if (grantType == "password")
            {
                string username = context.Request.Form["username"];
                string password = context.Request.Form["password"];
                //string culture = context.Request.Form["culture"];
                //int cultureId = culture != null ? Convert.ToInt32(culture) : LocalizationService._cultureId;
                //if (cultureId > 0)
                //    _localization.SetCulture(cultureId);

                var userResponse = await _userRepository.LoginUser(
                     username,
                     password,
                     LocalizationService._cultureId
                 );

                var user = userResponse.Data;

                if (userResponse.Status != ResponseStatus.Success || user == null || !user.Roles.Any())
                {
                    context.Response.StatusCode = 400;
                    var errResponse = new
                    {
                        error = "access_denied",
                        error_description = "Invalid user credentials."
                    };
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(errResponse));
                    return;
                }
                userId = user.UserId;
                permissions = user.Permissions.Select(p => p.Code).Distinct().ToList();
            }
            else if (grantType == "refresh_token")
            {
                string refreshToken = context.Request.Form["refresh_token"];
                var refreshTokenData = RefreshTokenProvider.ValidateToken(refreshToken);
                if (!refreshTokenData.Valid)
                {
                    var errResponse = new
                    {
                        error = "access_denied",
                        error_description = "Invalid refresh token."
                    };
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(errResponse));
                    return;
                }
                userId = int.Parse(refreshTokenData.UserId);
                //if (!CacheManager.TryGetValue("users", out IEnumerable<User> data))
                //{
                var result = await _userRepository.SelectById(userId);
                var data = result.Data;
                //}

                permissions = data.Permissions
                    .Select(p => p.Code).Distinct().ToList();
            }

            var now = DateTime.UtcNow;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };

            foreach (var code in permissions)
            {
                claims.Add(new Claim(ClaimTypes.Role, code));
            }

            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(_options.Expiration),
                signingCredentials: _options.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var newRefreshToken = RefreshTokenProvider.GenerateToken(userId.ToString());

            var response = new
            {
                accessToken = encodedJwt,
                expiresIn = (int)_options.Expiration.TotalSeconds,
                refreshToken = newRefreshToken,
            };

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
        }
    }
    public static class TokenProviderMiddlewareExtensions
    {
        public static IApplicationBuilder UseJWTTokenProviderMiddleware(this IApplicationBuilder builder)
        {
            //return builder.UseMiddleware<TokenProviderMiddleware>();
            if (AppSettings.Instance.Security == null)
            {
                return builder;
            }

            return builder.UseMiddleware<TokenProviderMiddleware>(Options.Create(new TokenProviderOptions
            {
                Audience = AppSettings.Instance.Security.Audience,
                Issuer = AppSettings.Instance.Security.Issuer,
                SigningCredentials = new SigningCredentials(JwtSecurityKey.Create(AppSettings.Instance.Security.SecurityKey), SecurityAlgorithms.HmacSha256)
            }));
        }
    }
}
