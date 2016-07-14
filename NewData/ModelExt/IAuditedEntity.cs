using System;

// ReSharper disable once CheckNamespace
namespace Data
{
    public interface IAuditedEntity
    {
        DateTime? CreatedDate { get; set; }
        DateTime? ModifiedDate { get; set; }
        int? CreatedByUserId { get; set; }
        int? ModifiedByUserId { get; set; }

    }
}

