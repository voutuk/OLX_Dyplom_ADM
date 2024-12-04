using FluentValidation;
using Olx.BLL.Helpers;
using Olx.BLL.Models.User;
using Olx.BLL.Resources;


namespace Olx.BLL.Validators.User
{
    public class UserCreationModelValidator : AbstractValidator<UserCreationModel>
    {
        public UserCreationModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
            RuleFor(x => x.Password)
                .Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{6,}$")
                .WithMessage(ValidationErrors.InvalidPassword);
            RuleFor(x => x.PasswordConfirmation)
                .Equal(x => x.Password).WithMessage(ValidationErrors.NotMatchPasswordsError);
            RuleFor(x => x.About)
                .MaximumLength(4000).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 4000 symbols")
                .MinimumLength(40).WithMessage($"{ValidationErrors.MinSymbolsCountError} 40 symbols")
                .When(x => x.About is not null);
            RuleFor(x => x.FirstName)
                .MaximumLength(100).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 100 symbols")
                .MinimumLength(2).WithMessage($"{ValidationErrors.MinSymbolsCountError} 2 symbols")
                .When(x => x.FirstName is not null);
            RuleFor(x => x.LastName)
               .MaximumLength(100).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 100 symbols")
               .MinimumLength(2).WithMessage($"{ValidationErrors.MinSymbolsCountError} 2 symbols")
               .When(x => x.FirstName is not null);
            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\d{3}[-\s]{0,1}\d{3}[-\s]{0,1}\d{2}[-\s]{0,1}\d{2}$")
                .WithMessage(ValidationErrors.InvalidPhoneNumber);
            RuleFor(x => x.ImageFile)
                .Must(x => FileTypes.AllowedImageFileTypes.Contains(x?.ContentType)).WithMessage(ValidationErrors.InvalidImageFileType)
                .When(x => x.ImageFile != null);
        }
    }
}
