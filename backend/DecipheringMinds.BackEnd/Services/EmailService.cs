using Google.Apis.Gmail.v1.Data;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net.Mail;

namespace DecipheringMinds.BackEnd.Services
{
    public class EmailService : IEmailService
    {
        private readonly string ApiKey = null;
        private readonly SendGridClient _client;

        public EmailService(IConfiguration configuration)
        {
            ApiKey = configuration["SendGridApiKey"];
            _client = new SendGridClient(ApiKey);
        }

        public async Task SendEmailAsync(string toName, string toEmail, string templateId, dynamic data)
        {
            var from = new EmailAddress("decipheringminds@gmail.com", "Deciphering Minds");
            var to = new EmailAddress(toEmail, toName);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, data);
            var response = await _client.SendEmailAsync(msg);
        }

        private static Message CreateEmailMessage(string toName, string toEmail, string subject, string body)
        {
            var mailMessage = new MailMessage
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            var mimeMessage = new MimeKit.MimeMessage();
            mimeMessage.From.Add(new MimeKit.MailboxAddress("Your Name", "ricthethird20@gmail.com"));
            mimeMessage.To.Add(new MimeKit.MailboxAddress(toName, toEmail));
            mimeMessage.Subject = subject;
            mimeMessage.Body = new MimeKit.TextPart("Html") { Text = body };

            using (var stream = new MemoryStream())
            {
                mimeMessage.WriteTo(stream);
                var rawMessage = Convert.ToBase64String(stream.ToArray())
                    .Replace('+', '-')
                    .Replace('/', '_')
                    .Replace("=", "");

                return new Message { Raw = rawMessage };
            }
        }
    }
}