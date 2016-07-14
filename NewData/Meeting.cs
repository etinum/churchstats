//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class Meeting
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Meeting()
        {
            this.Attendances = new HashSet<Attendance>();
            this.X_AdminUser_Meeting = new HashSet<X_AdminUser_Meeting>();
            this.X_Meeting_Tag = new HashSet<X_Meeting_Tag>();
            this.X_User_Meeting = new HashSet<X_User_Meeting>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public int MeetingTypeId { get; set; }
        public Nullable<int> DayOfTheWeek { get; set; }
        public Nullable<int> LeadUserId { get; set; }
        public Nullable<int> AddressId { get; set; }
        public Nullable<int> ContactInfoId { get; set; }
        public string Notes { get; set; }
        public Nullable<System.DateTime> UsualTime { get; set; }
        public Nullable<int> CreatedByUserId { get; set; }
        public Nullable<int> ModifiedByUserId { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
    
        public virtual Address Address { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Attendance> Attendances { get; set; }
        public virtual ContactInfo ContactInfo { get; set; }
        public virtual MeetingType MeetingType { get; set; }
        public virtual User User { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_AdminUser_Meeting> X_AdminUser_Meeting { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_Meeting_Tag> X_Meeting_Tag { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_User_Meeting> X_User_Meeting { get; set; }
    }
}
