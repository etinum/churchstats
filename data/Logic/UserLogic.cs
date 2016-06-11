using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class UserLogic
    {
        private chruchstatsEntities _ctx;

        public UserLogic()
        {
            _ctx = new chruchstatsEntities();
        }

        public UserModel GetUserById(int id)
        {
            return _ctx.Users.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<UserModel> GetAllMembers()
        {
            var members = _ctx.Users.ToList();

            return members;
        }

        public bool Update(UserModel user)
        {
            if (user == null || user.Id <= 0) return false;

            var olduser = _ctx.Users.FirstOrDefault(u => u.Id == user.Id);

            if (olduser == null) return false;

            _ctx.Users.AddOrUpdate(user);
            _ctx.SaveChanges();

            return true;
        }

        public IEnumerable<UserModel> GetMembers(int meetingId)
        {
            var users = new List<UserModel>();
            users = _ctx.Users.Where(u => u.Attendances.Any(att => att.MeetingId == meetingId)).ToList();
            return users;
        }
    }
}
