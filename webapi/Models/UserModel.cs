using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace webapi.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public Nullable<int> Age { get; set; }
        public byte[] Picture { get; set; }
        public Nullable<bool> isSaved { get; set; }
        public Nullable<bool> isBaptized { get; set; }
        public string MiddleName { get; set; }
        public string Notes { get; set; }
    }
}