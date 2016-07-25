using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace webapi.Utils
{
    public static class Common
    {
        public static T MergeObjects<T>(T source, T target)
        {
            foreach (var prop in typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {

                if (prop.Name.Equals("id"))
                {
                    continue;
                }

                var sourceValue = prop.GetValue(source, null);

                if (sourceValue != null)
                {

                    prop.SetValue(target, sourceValue, null);

                }
            }
            return target;
        }
    }
}
