using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Data;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Text.RegularExpressions;
using AutoMapper;
using webapi.Mappers;
using webapi.Utils;
using webapi.ViewModels;
using User = Data.User;

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
            var user = _mapper.Map<Data.User>(userViewModel);
            if (user.Id == 0)
            {
                user.DateCreated = DateTime.Now;
                user.LastUpdated = DateTime.Now;
                _ctx.Users.Add(user);
            }
            else
            {
                var userTarget = _ctx.Users.First(r => r.Id == user.Id);
                Common.MergeObjects(user, userTarget);
            }

            _ctx.SaveChanges();
            return Ok(user.Id);

        }

    }
}