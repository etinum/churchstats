using AutoMapper;
using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.Hubs;
using webapi.Mappers;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public class AttendanceController : ApiControllerWithHub<AttendHub>
    {
        readonly IMapper _mapper;
        readonly AttendanceLogic _attendanceLogic;
        public AttendanceController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            _mapper = config.CreateMapper();
            _attendanceLogic = new AttendanceLogic();
        }

        [HttpPost]
        public IEnumerable<AttendanceModel> GetMeetingUpdate(int meetingId, DateTime updatesSince)
        {
            return _mapper.Map<IEnumerable<Attendance>,IEnumerable<AttendanceModel>>( _attendanceLogic.GetMeetingUpdate(meetingId, updatesSince));
        }

        // Save attendance instance and alert all the subscribed clients
        [HttpPost]
        public bool SaveAttendance(int userId, int meetingId, bool isAttend, int recorderId)
        {
            Hub.Clients.Group(meetingId.ToString(), null).ClientCall();
            return _attendanceLogic.SaveAttendance(userId, meetingId, isAttend, recorderId);
        }
    }
}
