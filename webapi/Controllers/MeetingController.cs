using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using webapi.Hub;
using webapi.ViewModels;
using AutoMapper;
using webapi.Mappers;

namespace webapi.Controllers
{
    public class MeetingController : ApiControllerWithHub<AttendHub>
    {
        MeetingLogic meetingLogic;
        private IMapper mapper;

        public MeetingController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            mapper = config.CreateMapper();
            meetingLogic = new MeetingLogic();
        }

        public IEnumerable<MeetingModel> Get()
        {
            Hub.Clients.All.ClientCall();
            return mapper.Map<List<MeetingModel>>(meetingLogic.GetAllMeetings());
        }

        public bool AddUserToMeeting(int userId, int meetingId)
        {
            return meetingLogic.AddUserToMeeting(userId, meetingId);
        }

        public IEnumerable<MeetingModel> GetMeetingsByUser(int userId)
        {
            return mapper.Map<IEnumerable<Meeting>, IEnumerable<MeetingModel>>(meetingLogic.GetMeetingsByUser(userId));
        }

        public IEnumerable<MeetingType> GetMeetingType()
        {
            return meetingLogic.GetMeetingType();
        }
        public bool SaveMeeting(string meetingName, int meetingTypeId)
        {
            return meetingLogic.SaveMeeting(meetingName, meetingTypeId);
        }
    }
}
