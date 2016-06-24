using NewData;
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
            CreateMap<User, UserViewModel>();
            CreateMap<UserViewModel, User>();

            CreateMap<MeetingViewModel, Meeting>();
            CreateMap<Meeting, MeetingViewModel>();

            CreateMap<MeetingTypeViewModel, MeetingType>();
            CreateMap<MeetingType, MeetingTypeViewModel>();

            CreateMap<Attendance, AttendanceModel>();
            CreateMap<AttendanceModel, Attendance>();
        }
    }
}
