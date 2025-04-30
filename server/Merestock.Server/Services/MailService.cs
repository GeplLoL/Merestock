using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Merestock.Server.Services
{
    // Teenus e-posti saatmiseks (nt konto aktiveerimise link)
    public class MailService
    {
        private readonly SmtpClient _smtp;
        private readonly string _from;
        private readonly string _apiUrl;

        // Konstruktor: seadistame SMTP-klienti ja loeme konfiguratsioonist vajalikud väärtused
        public MailService(IConfiguration config)
        {
            _from = config["SMTP:User"];                      // saatja aadress
            _apiUrl = config["API_URL"];                      // rakenduse baas-URL
            _smtp = new SmtpClient(config["SMTP:Host"], int.Parse(config["SMTP:Port"]))
            {
                Credentials = new NetworkCredential(
                    config["SMTP:User"],
                    config["SMTP:Pass"]
                ),                                            // SMTP-kasutaja ja parool
                EnableSsl = true,                              // krüpteeritud ühendus
                DeliveryMethod = SmtpDeliveryMethod.Network,   // võrgupõhine saatmine
                UseDefaultCredentials = false                  // ei kasutata vaikesätteid
            };
        }

        // Saadab aktiveerimislingiga e-kirja kasutajale
        public async Task SendActivationMailAsync(string to, string link)
        {
            var msg = new MailMessage(_from, to)
            {
                Subject = "Konto aktiveerimine – " + _apiUrl,  // kirja teema
                Body = $@"<h1>Aktiveeri oma konto</h1>
                          <p>Kliki lingil, et aktiveerida konto:</p>
                          <a href=""{link}"">{link}</a>",
                IsBodyHtml = true                              // lubame HTML-vormingut
            };

            await _smtp.SendMailAsync(msg);                   // saatmise käsk
        }
    }
}
