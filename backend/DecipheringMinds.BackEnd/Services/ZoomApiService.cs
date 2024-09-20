using DecipheringMinds.BackEnd.Models;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using RestSharp;

namespace DecipheringMinds.BackEnd.Services
{
    public class ZoomApiService : IZoomApiService
    {
        private readonly RestClient _authClient;
        private readonly RestClient _reqClient;
        private readonly IMemoryCache _cache;
        private const string ZoomCacheKey = nameof(ZoomCacheKey);
        private readonly string _apiKey;
        private readonly string _accountId;
        private readonly string _adminEmail;

        public ZoomApiService(IMemoryCache memoryCache, IConfiguration configuration)
        {
            _cache = memoryCache;
            _apiKey = configuration["ZoomAuthKey"];
            _accountId = configuration["ZoomAccountId"];
            _adminEmail = configuration["AdminEmail"];
            _authClient = new RestClient("https://zoom.us");
            _reqClient = new RestClient("https://api.zoom.us");
        }

        public async Task<string?> GetTokenAsync()
        {
            if (!_cache.TryGetValue(ZoomCacheKey, out string? token))
            {
                var request = new RestRequest("/oauth/token", Method.Post);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddHeader("Authorization", $"Basic {_apiKey}");
                request.AddParameter("grant_type", "account_credentials");
                request.AddParameter("account_id", _accountId);
                var response = await _authClient.ExecuteAsync(request);

                if (response.IsSuccessful)
                {
                    var cacheEntryOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(25)
                    };
                    var jsonResponse = JsonConvert.DeserializeObject<AccessTokenResponse>(response?.Content);
                    _cache.Set(ZoomCacheKey, jsonResponse?.access_token, cacheEntryOptions);
                    return jsonResponse?.access_token;
                }
                else
                {
                    throw new Exception(response.ErrorMessage);
                }
            }

            return token;
        }

        public async Task<ZoomMeetingResponse> GenerateZoomMeetingLink(Appointments appointments, string patientEmail)
        {
            var payload = CreateRequest(appointments, patientEmail);
            var token = await GetTokenAsync();
            var request = new RestRequest("/v2/users/me/meetings", Method.Post);

            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Authorization", $"Bearer {token}");
            request.AddBody(payload);

            var response = await _authClient.ExecuteAsync(request);

            if (response.IsSuccessful)
            {
                var cacheEntryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(25)
                };
                var jsonResponse = JsonConvert.DeserializeObject<ZoomMeetingResponse>(response?.Content);

                return jsonResponse;
            }
            else
            {
                return null;
            }
        }

        private ZoomMeetingRequest CreateRequest(Appointments appointments, string patientEmail) => new ZoomMeetingRequest
        {
            agenda = appointments.BookedType,
            settings = new MeetingSettings
            {
                contact_email = _adminEmail,
                meeting_invitees = new List<MeetingInvitees>
                    {
                        new MeetingInvitees { email = _adminEmail },
                        new MeetingInvitees { email = patientEmail }
                    }
            },
            start_time = appointments.BookedDate,
            topic = appointments.BookedType
        };
    }

    public class AccessTokenResponse
    {
        public string access_token { get; set; }
    }
}