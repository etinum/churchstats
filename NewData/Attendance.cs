//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace NewData
{
    using System;
    using System.Collections.Generic;
    
    public partial class Attendance
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MeetingId { get; set; }
        public int RecorderId { get; set; }
        public System.DateTime DateRecorded { get; set; }
        public System.DateTime LastUpdated { get; set; }
        public bool isAttend { get; set; }
    
        public virtual Meeting Meeting { get; set; }
        public virtual User User { get; set; }
        public virtual User User1 { get; set; }
    }
}