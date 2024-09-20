using System.Numerics;

namespace DecipheringMinds.BackEnd.Models
{
    public class ZoomMeetingResponse : ZoomMeetingRequest
    {
        public long id { get; set; }
        public string start_url { get; set; }
        public string join_url { get; set; }
        public string password { get; set; }
        public string host_email { get; set; }
        public string status { get; set; }
    }

    public class ZoomMeetingRequest
    {
        public string agenda { get; set; }
        public bool default_password { get; set; } = false;
        public int duration { get; set; } = 60;
        public bool pre_schedule { get; set; } = true;
        public MeetingSettings settings { get; set; }
        public DateTime start_time { get; set; }
        public string template_id { get; set; } = "Dv4YdINdTk+Z5RToadh5ug==";
        public string timezone { get; set; } = "Asia/Hong_Kong";
        public string topic { get; set; }
        public int type { get; set; } = 2;
    }

    public class MeetingSettings
    {
        public int approval_type { get; set; } = 2;
        public string audio { get; set; } = "telephony";
        public string contact_email { get; set; }
        public string contact_name { get; set; }
        public string encryption_type { get; set; } = "enhanced_encryption";
        public bool focus_mode { get; set; } = true;
        public bool meeting_authentication { get; set; } = false;
        public List<MeetingInvitees> meeting_invitees { get; set; }
        public bool mute_upon_entry { get; set; } = false;
        public bool private_meeting { get; set; } = true;
    }

    public class MeetingInvitees
    {
        public string email { get; set; }
    }
}