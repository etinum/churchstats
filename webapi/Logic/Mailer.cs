using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using webapi.ViewModels;

namespace webapi.Logic
{
    public class Mailer
    {
        public void SendReport(ReportGridViewModel report, string subject)
        {
            var rl = new ReportLogic();
            SendEmail(ConfigurationManager.AppSettings["ReportEmailAddresses"], subject, rl.ReportToHtml(report));
        }

        public void SendEmail(string to, string subject, string messageStr)
        {
            var sender = ConfigurationManager.AppSettings["SmtpUser"];
            var pass = ConfigurationManager.AppSettings["SmtpPass"];
            MailMessage message = new MailMessage();
            MailAddress senderAddress = new MailAddress(sender);
            SmtpClient smtp = new SmtpClient()
            {
                Host = "smtp.gmail.com", //for gmail
                Port = 587, //for gmail,        
                EnableSsl = true,
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new System.Net.NetworkCredential(sender, pass),

            };
            message.From = senderAddress;
            message.Subject = subject;
            foreach (var toAddress in to.Split(new char[] {';' }))
            {
                MailAddress receiver = new MailAddress(toAddress);
                message.To.Add(receiver);
            }
            message.Body = messageStr;
            message.IsBodyHtml = true;
            smtp.Send(message);

        }
    }
}
