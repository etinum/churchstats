using AutoMapper;
using Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webapi.Mappers;

namespace webapi.Logic
{
    public class CustomLogic
    {
        protected readonly IMapper Mapper;
        protected readonly CStatsEntities Ctx;
        protected readonly log4net.ILog Logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public CustomLogic()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ModelMapper>();
            });
            Mapper = config.CreateMapper();
            Ctx = new CStatsEntities();
        }
    }
}
