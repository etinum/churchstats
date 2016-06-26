using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NewData;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Text.RegularExpressions;
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

        [HttpGet]
        public IHttpActionResult GetAllUsers()
        {
            var users = _ctx.Users.ToList();
            return Ok(_mapper.Map<IEnumerable<UserViewModel>>(users));
        }


        [HttpPost]
        public IHttpActionResult SaveUser(UserViewModel userViewModel)
        {
            var user = _mapper.Map<NewData.User>(userViewModel);
            if (user.Id == 0)
            {
                user.DateCreated = DateTime.Now;
            }

            _ctx.Users.Add(user);
            _ctx.SaveChanges();
            return Ok(user.Id);

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