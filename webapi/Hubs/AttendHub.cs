namespace webapi.Hub
{
    public class AttendHub : Microsoft.AspNet.SignalR.Hub
    {
        public void TestAll(string value)
        {
            Clients.All.ClientCall();
        }
        public void TestGroup(string groupName, string value)
        {
            Clients.Group(groupName, null).SendAlert(value);
        }

        public void Subscribe(string meetingId)
        {
            Groups.Add(Context.ConnectionId, meetingId);
        }

        public void Unsubscribe(string meetingId)
        {
            Groups.Remove(Context.ConnectionId, meetingId);
        }
    }
}
