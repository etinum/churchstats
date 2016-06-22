using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace webapi.ViewModels
{
    public class MeetingTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Label { get { return Name; } }
    }
}