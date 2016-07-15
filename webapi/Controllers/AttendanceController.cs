using AutoMapper;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Remoting.Contexts;
using System.Web.Http;
using Data;
using webapi.Hubs;
using webapi.Mappers;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public class AttendanceController : ApiControllerWithHub<AttendHub>
    {
        readonly IMapper _mapper;
        private readonly CStatsEntities _ctx;

        public AttendanceController()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ModelMapper>();
            });
            _mapper = config.CreateMapper();
            _ctx = new CStatsEntities();

        }

        // Save attendance instance and alert all the subscribed clients
        [HttpPost]
        public IHttpActionResult SaveAttendance(AttendanceViewModel attendanceViewModel)
        {


            Attendance attendance;

            if (attendanceViewModel.Id == 0)
            {
                attendance = _mapper.Map<Attendance>(attendanceViewModel);
                attendance.DateRecorded = DateTime.Now;
                _ctx.Attendances.Add(attendance);


            }
            else
            {
                attendance = _ctx.Attendances.FirstOrDefault(r => r.Id == attendanceViewModel.Id);


                if (attendance != null)
                {
                    attendance.AttendType = attendanceViewModel.AttendType;
                    attendance.RecorderId = attendanceViewModel.RecorderId;
                }
            }

            _ctx.SaveChanges();


            if (attendance != null)
            {
                var subscribed = Hub.Clients.Group(attendance.MeetingId.ToString());
                subscribed.UpdateAttendance(_mapper.Map<AttendanceViewModel>(attendance));
                return Ok(attendance.Id);

            }
            return NotFound();
        }




        [HttpGet]
        public void TestHub(int id)
        {

            var subscribed = Hub.Clients.Group(id.ToString());
            subscribed.ClientCall();
            
        }
    }
}
