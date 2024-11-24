using FluentValidation;
using Olx.BLL.Models;
using Olx.BLL.Resources;

namespace Olx.BLL.Validators
{
    public class ResetPasswordModelValidator : AbstractValidator<ResetPasswordModel>
    {
        public ResetPasswordModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
            RuleFor(x => x.Password)
                .MinimumLength(6).WithMessage($"{ValidationErrors.MinSymbolsCountError} 6 symbols")
                .Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{6,}$").WithMessage(ValidationErrors.InvalidPassword);
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
        }
    }
}
