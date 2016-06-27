using System;

namespace webapi.ViewModels
{
    public class UserViewModel
    {

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool? Gender { get; set; }
        public int? BirthYear { get; set; }
        public byte[] Picture { get; set; }
        public bool? IsSaved { get; set; }
        public bool? IsBaptized { get; set; }
        public string MiddleName { get; set; }
        public string Notes { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? BaptizedDate { get; set; }
        public DateTime? SavedDate { get; set; }
        public string Locality { get; set; }
        public string FullName => FirstName + " " + LastName;
        public bool? IsAttend { get; set; }
        public int RecorderId { get; set; }
        public string RecorderName { get; set; }

    }
}