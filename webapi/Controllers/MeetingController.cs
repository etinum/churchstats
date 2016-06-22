using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using webapi.ViewModels;
using AutoMapper;
using webapi.Hubs;
using webapi.Mappers;

namespace webapi.Controllers
{
    public class MeetingController : ApiControllerWithHub<AttendHub>
    {
        MeetingLogic _meetingLogic;
        private IMapper _mapper;

        public MeetingController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            _mapper = config.CreateMapper();
            _meetingLogic = new MeetingLogic();
        }

        public IEnumerable<MeetingModel> Get()
        {
            Hub.Clients.All.ClientCall();
            return _mapper.Map<List<MeetingModel>>(_meetingLogic.GetAllMeetings());
        }

        public bool AddUserToMeeting(int userId, int meetingId)
        {
            return _meetingLogic.AddUserToMeeting(userId, meetingId);
        }

        public IEnumerable<MeetingModel> GetMeetingsByUser(int userId)
        {
            return _mapper.Map<IEnumerable<Meeting>, IEnumerable<MeetingModel>>(_meetingLogic.GetMeetingsByUser(userId));
        }

        public IEnumerable<MeetingTypeModel> GetMeetingType()
        {
            return _mapper.Map<IEnumerable<MeetingType>, IEnumerable<MeetingTypeModel>>(_meetingLogic.GetMeetingType());
        }
        public bool SaveMeeting(string meetingName, int meetingTypeId)
        {
            return _meetingLogic.SaveMeeting(meetingName, meetingTypeId);
        }
    }
}
