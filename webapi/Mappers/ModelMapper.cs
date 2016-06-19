using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webapi.ViewModels;

namespace webapi.Mappers
{
    class ModelMapper : AutoMapper.Profile
    {
        protected override void Configure()
        {
            CreateMap<User, UserModel>();
            CreateMap<UserModel, User>();
            

            CreateMap<ViewModels.MeetingModel, data.Meeting>();
            CreateMap<data.Meeting, ViewModels.MeetingModel>();

            CreateMap<Attendance, AttendanceModel>();
            CreateMap<AttendanceModel, Attendance>();
        }
    }
}
