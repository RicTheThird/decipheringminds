using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;

namespace DecipheringMinds.BackEnd.Services
{
    public static class GoogleMeetHelper
    {
        public static async Task<Event> GenerateMeetingLink(string customerEmail)
        {
            try
            {
                var credential = GoogleCredential.FromFile("credentials.json")
            .CreateScoped(CalendarService.Scope.Calendar);

                var service = new CalendarService(new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "Google Calendar Integration",
                });

                // Create a new event
                var calendarId = "primary";
                var newEvent = new Event
                {
                    Summary = "Meeting with Team",
                    Location = "1234 Main St, Anytown, USA",
                    Description = "Discussing project updates and next steps.",
                    Start = new EventDateTime
                    {
                        DateTime = DateTime.Now,
                        TimeZone = "America/Los_Angeles",
                    },
                    End = new EventDateTime
                    {
                        DateTime = DateTime.Now.AddHours(1),
                        TimeZone = "America/Los_Angeles",
                    },
                    Attendees = new List<EventAttendee>
                    {
                        new EventAttendee { Self = true, Email = "ricthethird20@gmail.com" },
                    },
                    ConferenceData = new ConferenceData
                    {
                        CreateRequest = new CreateConferenceRequest
                        {
                            RequestId = Guid.NewGuid().ToString(),
                            ConferenceSolutionKey = new ConferenceSolutionKey
                            {
                                Type = "hangoutsMeet",
                            },
                        },
                    },
                };

                var request = service.Events.Insert(newEvent, calendarId);
                request.ConferenceDataVersion = 1;
                var createdEvent = await request.ExecuteAsync();

                // Get the Google Meet link
                //var meetLink = createdEvent.ConferenceData.ConferenceSolution.Key;

                return createdEvent;
                // Send an email (you'll need to use an email service or SMTP client here)
                //Console.WriteLine($"Event created. Google Meet link: {meetLink}");
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw e;
            }
        }
    }
}