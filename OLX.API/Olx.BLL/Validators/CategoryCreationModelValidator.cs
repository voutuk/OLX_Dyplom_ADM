using FluentValidation;
using Olx.BLL.Helpers;
using Olx.BLL.Models.Category;
using Olx.BLL.Resources;


namespace Olx.BLL.Validators
{
    public class CategoryCreationModelValidator : AbstractValidator<CategoryCreationModel>
    {
        public CategoryCreationModelValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThanOrEqualTo(0).WithMessage(ValidationErrors.GreaterEqualZeroError);
            RuleFor(x => x.ImageFile)
                .Must(x => FileTypes.AllowedImageFileTypes.Contains(x?.ContentType)).WithMessage(ValidationErrors.InvalidImageFileType)
                .When(x => x.ImageFile != null);
            RuleFor(x => x.ParentId)
                .GreaterThanOrEqualTo(0).WithMessage(ValidationErrors.GreaterEqualZeroError)
                .When(x => x.ParentId != null); ;
        }
    }
}
