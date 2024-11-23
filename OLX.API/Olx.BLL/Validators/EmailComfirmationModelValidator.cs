using FluentValidation;
using Olx.BLL.Models;
using Olx.BLL.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Olx.BLL.Validators
{
    internal class EmailComfirmationModelValidator : AbstractValidator<EmailConfirmationModel>
    {
        public EmailComfirmationModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
           RuleFor(x => x.Token)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
        }
    }
}

