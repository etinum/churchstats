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
            users = _ctx.X_User_Meeting.Where(xum => xum.MeetingId == meetingId).Select(xum => xum.User).ToList();
            return users;
        }
        //This method search existing user and add to meeting
        public bool SaveMemberForMeeting(ref int userID, string firstName, string lastName, int meetingId)
        {
            if (meetingId == 0) return false;
            if (userID == 0)
            {
                if ((string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName)))
                    return false;
                else //add new user and add this user as a member of the meeting
                {
                    userID = AddUser(firstName, lastName);
                }
            }
            _ctx.X_User_Meeting.Add(new X_User_Meeting { MeetingId = meetingId, UserId = userID });
            return _ctx.SaveChanges() > 0;
        }

        // This function returns type ahead values. It should consist of all users currently not associated to this meeting id.
        public IEnumerable<User> GetMembersForUserAdd(int meetingId)
        {
            var users = new List<User>();
            users = _ctx.Users.Where(u => !u.X_User_Meeting.Any(xum => xum.MeetingId == meetingId && xum.Active)).ToList();
            return users;
        }
    }
}
