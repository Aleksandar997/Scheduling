using Entity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Web.Clients
{
    public static class MailClient
    {
        public static async Task SendMail(string body, string subject, string to, MailAddress from = null, List<MailAttachment> attachments = null) =>
            await SendMail(body, subject, new List<string>() { to }, from, attachments);
        public static async Task SendMail(string body, string subject, ICollection<string> to, MailAddress from = null, List<MailAttachment> attachments = null)
        {
            try
            {
                var mailMessage = new MailMessage
                {
                    IsBodyHtml = true,
                    From = from ?? new MailAddress(AppSettings.Instance.SmtpClient.FromEmail),
                    Body = body,
                    Subject = subject
                };
                to.Where(p => !string.IsNullOrEmpty(p)).ToList().ForEach(ma => mailMessage.To.Add(ma));

                if (attachments != null && attachments.Any(a => a.Attachment != null))
                    attachments.ForEach(a => mailMessage.Attachments.Add(new Attachment(new MemoryStream(a.Attachment), a.Name)));

                using (var client = new SmtpClient(AppSettings.Instance.SmtpClient.Host, AppSettings.Instance.SmtpClient.Port.Value))
                {
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(AppSettings.Instance.SmtpClient.FromEmail, AppSettings.Instance.SmtpClient.Password);
                    client.EnableSsl = AppSettings.Instance.SmtpClient.EnableSsl;

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    public class MailAttachment
    {
        public string Name { get; set; }
        public byte[] Attachment { get; set; }

        public MailAttachment(string name, byte[] attachment)
        {
            Name = name;
            Attachment = attachment;
        }
    }
}
