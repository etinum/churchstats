using AutoMapper;
using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.Mappers;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public class AttendanceController : ApiController
    {
        IMapper mapper;
        AttendanceLogic attendanceLogic;
        public AttendanceController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            mapper = config.CreateMapper();
            attendanceLogic = new AttendanceLogic();
        }
        public IEnumerable<AttendanceModel> GetMeetingUpdate(int meetingId, DateTime updatesSince)
        {
            return mapper.Map<IEnumerable<Attendance>,IEnumerable<AttendanceModel>>( attendanceLogic.GetMeetingUpdate(meetingId, updatesSince));
        }

        public bool SaveAttendance(int userId, int meetingId, bool isAttend, int recorderId)
        {
            return attendanceLogic.SaveAttendance(userId, meetingId, isAttend, recorderId);
        }
    }
}
