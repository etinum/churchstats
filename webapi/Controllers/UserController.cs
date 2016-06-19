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
using webapi.Mappers;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {

        IMapper mapper;
        UserLogic userLogic;

        public UserController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            mapper = config.CreateMapper();
            userLogic = new UserLogic();
        }

        #region CRUD
        public IEnumerable<UserModel> Get()
        {
            return mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(userLogic.GetAllMembers());
        }

        public UserModel Get(int id)
        {
            return mapper.Map<User, UserModel>(userLogic.GetUserById(id));
        }

        [HttpGet]
        public int Test()
        {
            return AddUser("D", "DD");
        }

        public int AddUser(string firstName, string lastName)
        {
            int userId = 0;
            userId = userLogic.AddUser(firstName, lastName);

            return userId;
        }

        [HttpPost]
        public bool Update(UserModel um)
        {
            var user = mapper.Map<UserModel, User>(um);
            return userLogic.Update(user);
        } 
        #endregion

        [HttpGet]
        public IEnumerable<UserModel> GetMembersForMeeting(int id)
        {
            return mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(userLogic.GetMembersByMeeting(id));
        }

        [HttpGet]
        public IEnumerable<UserModel> GetMembersForUserAdd(int id)
        {
            return mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(userLogic.GetMembersForUserAdd(id));
        }

        public bool SaveMemberForMeeting(int userId, string firstName, string lastName, int meetingId)
        {
            return userLogic.SaveMemberForMeeting(ref userId, firstName, lastName, meetingId);
        }

        public IEnumerable<UserModel> GetMemberForUserAdd(int meetingId)
        {
            return mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(userLogic.GetMembersForUserAdd(meetingId));
        }
    }
}