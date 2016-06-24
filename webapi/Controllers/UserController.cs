using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using NewData;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using AutoMapper;
using webapi.Mappers;
using webapi.ViewModels;
using User = NewData.User;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {
        readonly IMapper _mapper;
        private readonly CStatsEntities _ctx;

        public UserController()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<ModelMapper>();
            });
            _mapper = config.CreateMapper();
            _ctx = new CStatsEntities();
        }

        //#region CRUD
        public IEnumerable<UserViewModel> GetAllUsers()
        {
            var users = _ctx.Users.ToList();
            return _mapper.Map<IEnumerable<UserViewModel>>(users);
        }

        //public UserViewModel Get(int id)
        //{



        //    return _mapper.Map<User, UserViewModel>(_userLogic.GetUserById(id));
        //}

        //[HttpGet]
        //public int Test()
        //{
        //    return AddUser("D", "DD");
        //}

        //public int AddUser(string firstName, string lastName)
        //{
        //    int userId = 0;
        //    userId = _userLogic.AddUser(firstName, lastName);

        //    return userId;
        //}

        //[HttpPost]
        //public bool Update(UserViewModel um)
        //{
        //    var user = _mapper.Map<UserViewModel, User>(um);
        //    return _userLogic.Update(user);
        //} 
        //#endregion

        //[HttpGet]
        //public IEnumerable<UserViewModel> GetMembersForMeeting(int id)
        //{
        //    return _mapper.Map<IEnumerable<User>, IEnumerable<UserViewModel>>(_userLogic.GetMembersByMeeting(id));
        //}

        //[HttpGet]
        //public IEnumerable<UserViewModel> GetMembersForUserAdd(int id)
        //{
        //    return _mapper.Map<IEnumerable<User>, IEnumerable<UserViewModel>>(_userLogic.GetMembersForUserAdd(id));
        //}

        //public bool SaveMemberForMeeting(int userId, string firstName, string lastName, int meetingId)
        //{
        //    return _userLogic.SaveMemberForMeeting(ref userId, firstName, lastName, meetingId);
        //}

        //public IEnumerable<UserViewModel> GetMemberForUserAdd(int meetingId)
        //{
        //    return _mapper.Map<IEnumerable<User>, IEnumerable<UserViewModel>>(_userLogic.GetMembersForUserAdd(meetingId));
        //}
    }
}