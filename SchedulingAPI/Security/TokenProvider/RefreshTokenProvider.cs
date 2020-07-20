using Entity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace Security.TokenProvider
{
    public static class RefreshTokenProvider
    {
        public static string GenerateToken(string userId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.Instance.Security.SecurityKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var secToken = new JwtSecurityToken(
                signingCredentials: credentials,
                issuer: AppSettings.Instance.Security.Issuer,
                audience: AppSettings.Instance.Security.Audience,
                claims: new[]
                {
                    new Claim(ClaimTypes.Name, userId)
                },
                expires: DateTime.UtcNow.AddDays(1));

            var handler = new JwtSecurityTokenHandler();
            return handler.WriteToken(secToken);
        }

        public static (bool Valid, string UserId) ValidateToken(string authToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = GetValidationParameters();
            try
            {
                IPrincipal principal = tokenHandler.ValidateToken(authToken, validationParameters, out SecurityToken validatedToken);
                return (principal.Identity.IsAuthenticated, principal.Identity.Name);
            }
            catch
            {
                return (false, "");
            }
        }

        private static TokenValidationParameters GetValidationParameters()
        {
            return new TokenValidationParameters()
            {
                ValidateLifetime = true,
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidIssuer = AppSettings.Instance.Security.Issuer,
                ValidAudience = AppSettings.Instance.Security.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.Instance.Security.SecurityKey))
            };
        }
    }
    public class RefreshToken
    {
        public DateTime ValidTo { get; set; }
        public object Data { get; set; }
    }
}
