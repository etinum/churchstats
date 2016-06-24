using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using AutoMapper;
using NewData;
using webapi.Mappers;
using webapi.ViewModels;
using User = data.User;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {
        readonly IMapper _mapper;
        readonly UserLogic _userLogic;

        public UserController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            _mapper = config.CreateMapper();
            _userLogic = new UserLogic();
        }

        #region CRUD
        public IEnumerable<UserModel> Get()
        {

            var test = new TestEf();

            test.HitMe();

            return _mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(_userLogic.GetAllMembers());
        }

        public UserModel Get(int id)
        {



            return _mapper.Map<User, UserModel>(_userLogic.GetUserById(id));
        }

        [HttpGet]
        public int Test()
        {
            return AddUser("D", "DD");
        }

        public int AddUser(string firstName, string lastName)
        {
            int userId = 0;
            userId = _userLogic.AddUser(firstName, lastName);

            return userId;
        }

        [HttpPost]
        public bool Update(UserModel um)
        {
            var user = _mapper.Map<UserModel, User>(um);
            return _userLogic.Update(user);
        } 
        #endregion

        [HttpGet]
        public IEnumerable<UserModel> GetMembersForMeeting(int id)
        {
            return _mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(_userLogic.GetMembersByMeeting(id));
        }

        [HttpGet]
        public IEnumerable<UserModel> GetMembersForUserAdd(int id)
        {
            return _mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(_userLogic.GetMembersForUserAdd(id));
        }

        public bool SaveMemberForMeeting(int userId, string firstName, string lastName, int meetingId)
        {
            return _userLogic.SaveMemberForMeeting(ref userId, firstName, lastName, meetingId);
        }

        public IEnumerable<UserModel> GetMemberForUserAdd(int meetingId)
        {
            return _mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(_userLogic.GetMembersForUserAdd(meetingId));
        }
    }
}