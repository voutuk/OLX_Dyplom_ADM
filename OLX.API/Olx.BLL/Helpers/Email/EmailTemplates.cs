using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Reflection;


namespace Olx.BLL.Helpers.Email
{
    internal static class EmailTemplates
    {
        private static string _path = Path.Combine(Directory.GetCurrentDirectory(), "Helpers/EmailTemplates");
        public static string GetEmailConfirmationTemplate(string url,string token, string email)
        {
            var html = File.ReadAllText(Path.Combine(_path,"EmailConfirmation.html"));
            html = html.Replace("[token]",WebUtility.UrlEncode(token));
            html = html.Replace("[email]", email);
            html = html.Replace("[url]", url);
            return html;
        }
        public static string GetEmailConfirmedTemplate(string url)
        {
            var html = File.ReadAllText(Path.Combine(_path, "EmailConfirmed.html"));
            html = html.Replace("[url]", url);
            return html;
        }
        public static string GetPasswordResetTemplate(string url, string token, string email)
        {
            var html = File.ReadAllText(Path.Combine(_path, "PasswordReset.html"));
            html = html.Replace("[token]", WebUtility.UrlEncode(token));
            html = html.Replace("[email]", email);
            html = html.Replace("[url]", url);
            return html;
        }
    }
}
