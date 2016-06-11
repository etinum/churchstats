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
using webapi.Models;

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

        // GET api/<controller>
        public IEnumerable<UserModel> Get()
        {
            return mapper.Map<IEnumerable<User>,IEnumerable<UserModel>>(userLogic.GetAllMembers());
        }

        // GET api/<controller>/5
        public UserModel Get(int id)
        {
            return mapper.Map<User,UserModel>(userLogic.GetUserById(id));
        }

        public IEnumerable<UserModel> GetMembersForMeeting(int meetingId)
        {
            return mapper.Map<IEnumerable<User>, IEnumerable<UserModel>>(userLogic.GetMembers(meetingId));
        }

        public bool Update(UserModel um)
        {
            var user = mapper.Map<UserModel, User>(um);
            return userLogic.Update(user);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}