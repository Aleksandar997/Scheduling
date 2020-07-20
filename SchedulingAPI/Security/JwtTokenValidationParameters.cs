using Entity;
using Microsoft.IdentityModel.Tokens;

namespace Security
{
    public static class JwtTokenValidationParameters
    {
        public static TokenValidationParameters Create()
        {
            return new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = AppSettings.Instance.Security.Issuer,
                ValidAudience = AppSettings.Instance.Security.Audience,
                IssuerSigningKey = JwtSecurityKey.Create(AppSettings.Instance.Security.SecurityKey)
            };
        }
    }
}
