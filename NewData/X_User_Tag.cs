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
    
    public partial class X_User_Tag
    {
        public int UserId { get; set; }
        public int TagId { get; set; }
        public Nullable<System.DateTime> DateAdded { get; set; }
    
        public virtual User User { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
