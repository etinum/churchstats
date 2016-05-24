using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace webapi
{
    public class AttendenceHub : Hub
    {
        public void SyncRadioButtons(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.syncRadioButtons(name, message);
        }
    }
}