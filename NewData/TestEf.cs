using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewData
{
    public class TestEf
    {


        public void HitMe()
        {

            using (var ctx = new CStatsEntities())
            {

                var users = ctx.Users.ToList();

                Console.WriteLine(users.Count);

            }

        }

    }
}
