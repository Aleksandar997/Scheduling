using Entity.Base;
using Localization.Service;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UserManagement.Models;
using UserManagement.Repository;
using Web.Clients;

namespace UserManagement.Service
{
    public class UserService : IUserService
    {
        private IUserRepository _userRepository { get; set; }
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<ResponseBase<long>> ForgottenPassword(UserCredentials userCredentials)
        {
            var password = new Random(Guid.NewGuid().GetHashCode()).Next(10000000, 99999999).ToString("D8");
            userCredentials.NewPassword = password;

            var result = await _userRepository.ForgottenPassword(userCredentials);

            if (result.Status != ResponseStatus.Success)
                return result;

            var body = LocalizationService.GetTranslate("forgot_password_body_mail");
            var subject = LocalizationService.GetTranslate("forgot_password_subject_mail");
            await MailClient.SendMail(string.Format(body, password), subject, userCredentials.Email);
            return result;
        }

        public async Task<ResponseBase<User>> SelectById(long userId = 0) =>
            await _userRepository.SelectById(userId);

        public async Task<ResponseBase<long>> ChangePassword(PasswordModel passwordModel) =>
            await _userRepository.ChangePassword(passwordModel);
    }
}
