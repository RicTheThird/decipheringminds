using DecipheringMinds.BackEnd.Models;

namespace DecipheringMinds.BackEnd.Services
{
    public interface IZoomApiService
    {
        Task<string?> GetTokenAsync();

        Task<ZoomMeetingResponse> GenerateZoomMeetingLink(Appointments appointments, string patientEmail);
    }
}