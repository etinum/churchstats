using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public class ReportController : CustomApiController
    {
        [HttpPost]
        public IHttpActionResult GetReport(ReportRequestViewModel reportType)
        {
            var meeting = Ctx.Meetings.Where(m => m.MeetingTypeId == reportType.MeetingId);
            return Ok(Mapper.Map<IEnumerable<MeetingViewModel>>(meeting));
        }

        [HttpGet]
        public IHttpActionResult test()
        {
            return Ok("Some test Test");
        }
    }
}
