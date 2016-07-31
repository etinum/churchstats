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
    
    public partial class User
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            this.Meetings = new HashSet<Meeting>();
            this.UserNotes = new HashSet<UserNote>();
            this.X_AdminUser_Meeting = new HashSet<X_AdminUser_Meeting>();
            this.X_User_FamilyMember = new HashSet<X_User_FamilyMember>();
            this.X_User_FamilyMember1 = new HashSet<X_User_FamilyMember>();
            this.X_User_Meeting = new HashSet<X_User_Meeting>();
            this.X_User_Role = new HashSet<X_User_Role>();
            this.X_User_Tag = new HashSet<X_User_Tag>();
            this.Attendances = new HashSet<Attendance>();
            this.Attendances1 = new HashSet<Attendance>();
        }
    
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public Nullable<bool> Gender { get; set; }
        public Nullable<int> BirthYear { get; set; }
        public byte[] Picture { get; set; }
        public Nullable<bool> IsSaved { get; set; }
        public Nullable<bool> IsBaptized { get; set; }
        public bool IsActive { get; set; }
        public string Notes { get; set; }
        public Nullable<System.DateTime> BaptizedDate { get; set; }
        public Nullable<System.DateTime> SavedDate { get; set; }
        public Nullable<int> AddressId { get; set; }
        public Nullable<int> ContactInfoId { get; set; }
        public Nullable<int> LocalityId { get; set; }
        public Nullable<UserTypeEnum> UserType { get; set; }
        public Nullable<int> CreatedByUserId { get; set; }
        public Nullable<int> ModifiedByUserId { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
    
        public virtual Address Address { get; set; }
        public virtual ContactInfo ContactInfo { get; set; }
        public virtual Locality Locality { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Meeting> Meetings { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserNote> UserNotes { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_AdminUser_Meeting> X_AdminUser_Meeting { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_User_FamilyMember> X_User_FamilyMember { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_User_FamilyMember> X_User_FamilyMember1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_User_Meeting> X_User_Meeting { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_User_Role> X_User_Role { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<X_User_Tag> X_User_Tag { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Attendance> Attendances { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Attendance> Attendances1 { get; set; }
    }
}
