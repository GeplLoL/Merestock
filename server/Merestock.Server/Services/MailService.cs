using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Merestock.Server.Services
{
    public class MailService
    {
        private readonly SmtpClient _smtp;
        private readonly string _from;
        private readonly string _apiUrl;

        public MailService(IConfiguration config)
        {
            _from = config["SMTP:User"];
            _apiUrl = config["API_URL"];
            _smtp = new SmtpClient(config["SMTP:Host"], int.Parse(config["SMTP:Port"]))
            {
                Credentials = new NetworkCredential(config["SMTP:User"], config["SMTP:Pass"]),
                EnableSsl = true,                       // <-- negotiate STARTTLS
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };
        }

        public async Task SendActivationMailAsync(string to, string link)
        {
            var msg = new MailMessage(_from, to)
            {
                Subject = "Активация аккаунта на " + _apiUrl,
                Body = $@"<h1>Для активации перейдите по ссылке</h1>
                             <a href=""{link}"">{link}</a>",
                IsBodyHtml = true
            };
            await _smtp.SendMailAsync(msg);
        }
    }
}
