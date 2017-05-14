using Hangfire;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.Logic;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public class ReportController : CustomApiController
    {
        ReportController() : base()
        { }

        [HttpGet]
        public IHttpActionResult GetReport(string reportType, int meetingId, DateTime meetingDate)
        {
            var rl = new ReportLogic();
            var errors = new List<string>();

            var report = rl.GetReport(reportType, meetingId, meetingDate, errors);

            return Ok(report);

        }

        [HttpGet]
        public IHttpActionResult TestEmail()
        {
            var mailer = new Mailer();
            var rl = new ReportLogic();
            mailer.SendReport(rl.GetReport("attend30", 1, DateTime.Today, new List<string>()), "Weekly Attendance");
            return Ok("+2");
        }

        [HttpGet]
        public IHttpActionResult TestHangFire()
        {
            RecurringJob.Trigger("WeeklyAttendance");
            return Ok("+3");
        }
    }
}
