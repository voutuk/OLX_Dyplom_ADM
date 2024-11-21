using Ardalis.Specification;
using Olx.BLL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Olx.BLL.Specifications
{
    public static class RefreshTokenSpecs
    {
        public class GetByValue : Specification<RefreshToken>
        {
            public GetByValue(string token,bool tracking = false) => Query.Where(x => x.Token == token).AsTracking(tracking);
        }
        public class ByDate : Specification<RefreshToken>
        {
            public ByDate(DateTime date,bool tracking = false) => Query.Where(x => x.ExpirationDate < date).AsTracking(tracking);
        }
    }
}
