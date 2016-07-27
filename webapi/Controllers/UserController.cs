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
    public class UserController : CustomApiController
    {


        [HttpGet]
        public IHttpActionResult GetAllUsers()
        {
            var users = Ctx.Users.Where(u => u.IsActive);
            return Ok(Mapper.Map<IEnumerable<UserViewModel>>(users));
        }


        [HttpPost]
        public IHttpActionResult SaveUser(UserViewModel userViewModel)
        {
            var user = Mapper.Map<Data.User>(userViewModel);
            if (user.Id == 0)
            {
                Ctx.Users.Add(user);
            }
            else
            {
                var userTarget = Ctx.Users.First(r => r.Id == user.Id);
                Common.MergeObjects(user, userTarget);
            }

            Ctx.SaveChanges();
            return Ok(user.Id);

        }

    }
}