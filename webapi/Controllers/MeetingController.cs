﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using webapi.ViewModels;
using AutoMapper;
using Data;
using Microsoft.Ajax.Utilities;
using webapi.Hubs;
using webapi.Mappers;
using webapi.Utils;
using webapi.Logic;

namespace webapi.Controllers
{
    public class MeetingController : ApiControllerWithHub<AttendHub>
    {

        [HttpGet]
        public IHttpActionResult GetAllMeetings()
        {
            var meetings = Ctx.Meetings.ToList();

            return Ok(Mapper.Map<List<MeetingViewModel>>(meetings));
        }

        [HttpGet]
        public IHttpActionResult GetAllMeetingTypes()
        {
            try
            {
                var meetingTypes = Ctx.MeetingTypes.ToList();
                return Ok(Mapper.Map<List<MeetingTypeViewModel>>(meetingTypes));
            }
            catch (Exception ex)
            {
                return Ok(ex);

            }

        }


        [HttpGet]
        public IHttpActionResult GetMeetingMembers(int meetingId, DateTime meetingDate)
        {
            var ml = new MeetingLogic();
            IEnumerable<UserViewModel> userVms = ml.GetMeetingMembersData(meetingId, meetingDate);

            return Ok(userVms);
        }

       

        [HttpPost]
        public IHttpActionResult RemoveMemberFromMeeting(XMeetingUserViewModel data)
        {

            // remove attendance record if it exist
            var attrec =
                Ctx.Attendances.FirstOrDefault(
                    r =>
                        r.UserId == data.UserId && r.MeetingId == data.MeetingId &&
                        DbFunctions.TruncateTime(r.DateRecorded) == DbFunctions.TruncateTime(data.EffectiveDate.Value));

            if (attrec != null)
            {
                Ctx.Attendances.Remove(attrec);
                Ctx.SaveChanges();
            }


            var xref = Ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.UserId);

            if (xref == null) return NotFound();
            xref.Active = false;
            Ctx.SaveChanges();

            var subscribed = Hub.Clients.Group(data.MeetingId.ToString());
            subscribed.RemoveMember(data);
            return Ok();
        }


        [HttpPost]
        public IHttpActionResult AddMemberToMeeting(XMeetingUserViewModel data)
        {

            var xref = Ctx.X_User_Meeting.FirstOrDefault(r => r.MeetingId == data.MeetingId && r.UserId == data.UserId);

            if (xref == null)
            {
                xref = Ctx.X_User_Meeting.Create();
                xref.UserId = data.UserId;
                xref.MemberType = data.MemberType ?? MemberTypeEnum.Normal;
                xref.MeetingId = data.MeetingId;
                xref.EffectiveDate = data.EffectiveDate ?? DateTime.Now;
                xref.Active = true;
                Ctx.X_User_Meeting.Add(xref);

            }
            else
            {
                var efModel = Mapper.Map<X_User_Meeting>(data);
                Common.MergeObjects(efModel, xref);
                xref.Active = true;
            }


            Ctx.SaveChanges();




            var attendanceVm = new AttendanceViewModel()
            {
                Id = 0,
                AttendType = AttendTypeEnum.Unknown,
                UserId = data.UserId,
                MeetingId = data.MeetingId,
                MemberType = data.MemberType

            };

            var subscribed = Hub.Clients.Group(data.MeetingId.ToString());
            subscribed.UpdateAttendance(attendanceVm);

            return Ok();
        }

        [HttpPost]
        public IHttpActionResult SaveMeeting(MeetingViewModel meetingViewModel)
        {

            var meeting = Mapper.Map<Meeting>(meetingViewModel);

            if (meeting.Id == 0)
            {
                meeting.DayOfTheWeek = (int)DateTime.Now.DayOfWeek;
                Ctx.Meetings.Add(meeting);

            }
            else
            {

                var meetingTarget = Ctx.Meetings.First(r => r.Id == meeting.Id);
                Common.MergeObjects(meeting, meetingTarget);

            }
            Ctx.SaveChanges();
            return Ok(meeting.Id);

        }




    }
}
