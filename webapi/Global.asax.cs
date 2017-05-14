using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Hangfire;
using webapi.Logic;

namespace webapi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private BackgroundJobServer _backgroundJobServer;

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            System.Web.Http.GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Server.MapPath("~/Web.config")));
            try
            {
                Hangfire.GlobalConfiguration.Configuration.UseSqlServerStorage("Hangfire");
            }
            catch (Exception e)
            {
                var z = e.Data;
            }
            _backgroundJobServer = new BackgroundJobServer();

            var rl = new ReportLogic();
            RecurringJob.AddOrUpdate("WeeklyAttendance",() => rl.SendWeeklyAttendance(), "0 */4 * * *");
        }

        protected void Application_End(object sender, EventArgs e)
        {
            _backgroundJobServer.Dispose();
        }
    }
}
