using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace webapi
{
    public class AttendenceHub : Hub
    {
        public void PopupSync(string name, string message)
        {
            // Call the syncRadioButtons method to update clients.
            Clients.All.popupSync(name, "FROM_SERVER");
        }
        public void SyncRadioButtons(string id, string newValue)
        {
            // Call the syncRadioButtons method to update clients.
            Clients.All.syncRadioButtons(id, newValue);
        }
    }
}