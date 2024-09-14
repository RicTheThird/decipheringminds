namespace DecipheringMinds.BackEnd.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toName, string toEmail, string templateId, dynamic data);
    }
}