using System;
using NewData;

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
        public DateTime? BaptizedDate { get; set; }
        public DateTime? SavedDate { get; set; }
        public int? AddressId { get; set; }
        public int? ContactInfoId { get; set; }
        public int? LocalityId { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
        public int? LastEditedBy { get; set; }
        public string FullName => FirstName + " " + LastName;

        public AttendTypeEnum? AttendTypeId { get; set; }
        public int RecorderId { get; set; }
        public string RecorderName { get; set; }
        public int AttendanceId { get; set; }
        public DateTime? LastRecorded { get; set; }
        public string AttendanceNotes { get; set; }


    }
}