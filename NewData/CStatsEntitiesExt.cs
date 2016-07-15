using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public partial class CStatsEntities : DbContext
    {
        private readonly int _userId;

        public CStatsEntities(int userId)
        {
            _userId = userId;
        }

        public override int SaveChanges()
        {


            var addedAuditedEntities = ChangeTracker.Entries<IAuditedEntity>()
              .Where(p => p.State == EntityState.Added)
              .Select(p => p.Entity);

            var modifiedAuditedEntities = ChangeTracker.Entries<IAuditedEntity>()
              .Where(p => p.State == EntityState.Modified)
              .Select(p => p.Entity);


            foreach (var entity in addedAuditedEntities)
            {
                entity.CreatedDate = DateTime.Now;
                entity.ModifiedDate = DateTime.Now;
                entity.CreatedByUserId = _userId;
                entity.ModifiedByUserId = _userId;

            }

            foreach (var entity in modifiedAuditedEntities)
            {
                entity.ModifiedDate = DateTime.Now;
                entity.CreatedDate = DateTime.Now;
                entity.ModifiedByUserId = _userId;

            }


            return base.SaveChanges();
        }

    }
}
