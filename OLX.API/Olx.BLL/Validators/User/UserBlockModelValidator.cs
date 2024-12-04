using FluentValidation;
using Olx.BLL.Models.User;
using Olx.BLL.Resources;

namespace Olx.BLL.Validators.User
{
    public class UserBlockModelValidator : AbstractValidator<UserBlockModel>
    {
        public UserBlockModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
        }
    }
}

