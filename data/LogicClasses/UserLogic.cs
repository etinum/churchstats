using System;
using System.Collections.Generic;
using System.Data.Entity;
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

        public UserLogic(chruchstatsEntities context)
        {
            _ctx = context;
        }

        public User GetUserById(int id)
        {
            return _ctx.Users.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<User> GetAllMembers()
        {
            return _ctx.Users.ToList();
        }

        public int AddUser(string firstName, string lastName)
        {
            var user = _ctx.Users.Create();
            user.FirstName = firstName;
            user.LastName = lastName;
            _ctx.Users.Add(user);
            _ctx.SaveChanges();
            return user.Id;
        }

        public void Delete(int id)
        {
            var userToDelete = GetUserById(id);
            _ctx.Users.Remove(userToDelete);
            _ctx.SaveChanges();
        }

        public bool Update(User user)
        {
            if (user == null || user.Id <= 0) return false;

            var olduser = _ctx.Users.FirstOrDefault(u => u.Id == user.Id);

            if (olduser == null) return false;

            _ctx.Users.AddOrUpdate(user);
            _ctx.SaveChanges();

            return true;
        }

        public IEnumerable<User> GetMembersByMeeting(int meetingId)
        {
            var users = new List<User>();
            users = _ctx.Users.Where(u => u.Attendances.Any(att => att.MeetingId == meetingId)).ToList();
            return users;
        }

    }
}
