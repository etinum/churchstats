using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Owin;
using webapi.Utils;

namespace webapi
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();

            // For SignalR
            var settings = new JsonSerializerSettings { ContractResolver = new SignalRContractResolver() };
            var serializer = JsonSerializer.Create(settings);
            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);

        }

    }

}
