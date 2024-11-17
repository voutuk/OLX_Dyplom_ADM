using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Olx.BLL.Helpers
{
    public class JwtOptions
    {
        public string Issuer { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public int AccessTokenLifetimeInMinutes { get; set; }
        public int RefreshTokenLifetimeInDays { get; set; }
    }
}
