﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Remoting.Contexts;
using System.Web.Http;
using NewData;
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

        //[HttpPost]
        //public IEnumerable<AttendanceViewModel> GetMeetingUpdate(int meetingId, DateTime updatesSince)
        //{
        //    return _mapper.Map<IEnumerable<Attendance>,IEnumerable<AttendanceViewModel>>( _attendanceLogic.GetMeetingUpdate(meetingId, updatesSince));
        //}

        // Save attendance instance and alert all the subscribed clients
        [HttpPost]
        public IHttpActionResult SaveAttendance(AttendanceViewModel attendanceViewModel)
        {


            Attendance attendance;

            if (attendanceViewModel.Id == 0)
            {
                attendance = _mapper.Map<Attendance>(attendanceViewModel);
                attendance.LastUpdated = DateTime.Now;
                attendance.DateRecorded = DateTime.Now;
                _ctx.Attendances.Add(attendance);


            }
            else
            {
                attendance = _ctx.Attendances.FirstOrDefault(r => r.Id == attendanceViewModel.Id);


                if (attendance != null)
                {
                    attendance.LastUpdated = DateTime.Now;
                    attendance.IsAttend = attendanceViewModel.IsAttend;
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


        //public bool SaveAttendance(int userId, int meetingId, bool isAttend, int recorderId)
        //{
        //    if (meetingId <= 0 || userId <= 0 || recorderId <= 0) return false;

        //    var attendencesForUserToday = _ctx.Attendances.Where(att => att.UserId == userId && att.MeetingId == meetingId && att.DateRecorded > DateTime.Today);

        //    if (!attendencesForUserToday.Any())
        //    {
        //        var attendance = new Attendance
        //        {
        //            UserId = userId,
        //            MeetingId = meetingId,
        //            isAttend = isAttend,
        //            RecorderId = recorderId,
        //            LastUpdated = DateTime.Now,
        //            DateRecorded = DateTime.Now
        //        };
        //        _ctx.Attendances.Add(attendance);
        //    }
        //    else
        //    {
        //        foreach (var att in attendencesForUserToday)
        //        {
        //            att.LastUpdated = DateTime.Now;
        //            att.RecorderId = recorderId;
        //            att.isAttend = isAttend;
        //        }
        //    }
        //    return _ctx.SaveChanges() > 0;
        //}



        [HttpGet]
        public void TestHub(int id)
        {

            var subscribed = Hub.Clients.Group(id.ToString());
            subscribed.ClientCall();
            
        }
    }
}
