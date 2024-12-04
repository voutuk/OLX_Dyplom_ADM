
using FluentValidation;
using Olx.BLL.Models.FilterModels;
using Olx.BLL.Resources;

namespace Olx.BLL.Validators
{
    public class FilterCreationModelValidator : AbstractValidator<FilterCreationModel>
    {
        public FilterCreationModelValidator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(100).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 100 symbols")
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
        }
    }
}
