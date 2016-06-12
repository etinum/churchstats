using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace webapi.ViewModels
{
    public class MeetingModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MeetingTypeId { get; set; }
        public Nullable<dayofweek> DayOfTheWeek { get; set; }
        public string Description { get; set; }
        public Nullable<System.DateTime> UsualTime { get; set; }
    }
}
