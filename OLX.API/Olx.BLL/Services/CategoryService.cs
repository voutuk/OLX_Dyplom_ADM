using AutoMapper;
using FluentValidation;
using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Page;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Pagination;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;
using Olx.BLL.Models.Category;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Olx.BLL.Services
{
    public class CategoryService(
        IRepository<Category> categoryRepository,
        IMapper mapper,
        IImageService imageService,
        IValidator<CategoryCreationModel> validator,
        IFilterService filterService,
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext) : ICategoryService
    {
        private async Task<OlxUser> UpdateUserActivity()
        {
            var curentUser = await userManager.GetUserAsync(httpContext.HttpContext?.User!)
              ?? throw new HttpException(Errors.ErrorAthorizedUser, HttpStatusCode.InternalServerError);
            curentUser.LastActivity = DateTime.UtcNow;
            await userManager.UpdateAsync(curentUser);
            return curentUser;
        }
        public async Task CreateAsync(CategoryCreationModel creationModel)
        {
            await UpdateUserActivity();
            validator.ValidateAndThrow(creationModel);
            var category = mapper.Map<Category>(creationModel);
            if (creationModel.ImageFile is not null)
            {
                category.Image = await imageService.SaveImageAsync(creationModel.ImageFile);
            }

            if (creationModel.FiltersIds is not null && creationModel.FiltersIds.Any())
            {
                category.Filters = (await filterService.GetByIds(creationModel.FiltersIds)).ToHashSet();
            }
            await categoryRepository.AddAsync(category);
            await categoryRepository.SaveAsync();
        }

        public async Task RemoveAsync(int id)
        {
            await UpdateUserActivity();
            var category = await categoryRepository.GetByIDAsync(id);
            if (category is not null)
            {
                categoryRepository.Delete(category);
                await categoryRepository.SaveAsync();
                if (category.Image is not null)
                {
                    imageService.DeleteImageIfExists(category.Image);
                }
            }
            else throw new HttpException(Errors.InvalidCategoryId,HttpStatusCode.BadRequest);
        }

        public async Task EditAsync(CategoryCreationModel editModel)
        {
            await UpdateUserActivity();
            validator.ValidateAndThrow(editModel);
            var category = await categoryRepository.GetByIDAsync(editModel.Id)
                ?? throw new HttpException(Errors.InvalidCategoryId,HttpStatusCode.BadRequest);
            mapper.Map(editModel, category);
            if (editModel.ImageFile is not null)
            {
                if (category.Image is not null)
                {
                    imageService.DeleteImageIfExists(category.Image);
                }
                category.Image = await imageService.SaveImageAsync(editModel.ImageFile);
            }

            if (editModel.FiltersIds is not null && editModel.FiltersIds.Any())
            {
                category.Filters = (await filterService.GetByIds(editModel.FiltersIds, true)).ToHashSet();
            }
            else category.Filters.Clear();
            await categoryRepository.SaveAsync();
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync(bool tracking = false) =>
            mapper.Map<IEnumerable<CategoryDto>>( await categoryRepository.GetListBySpec(new CategorySpecs.GetAll(tracking)));
       

        public async Task<IEnumerable<CategoryDto>> GetMainAsync(bool tracking = false) =>
            mapper.Map<IEnumerable<CategoryDto>>(await categoryRepository.GetListBySpec(new CategorySpecs.GetMain(tracking)));

        public async Task<CategoryChildsTreeDto> GetTreeAsync(int categoryId, bool tracking = false)
        {
            var categories = await categoryRepository.GetListBySpec(new CategorySpecs.GetAll(tracking));
            var category = categories.FirstOrDefault(x=>x.Id == categoryId)
                ?? throw new HttpException(Errors.InvalidCategoryId,HttpStatusCode.BadRequest);
            category.Childs = BuildTree(categoryId, categories).ToHashSet();
            return mapper.Map<CategoryChildsTreeDto>(category);
        }

        public async Task<IEnumerable<CategoryChildsTreeDto>> GetMainTreeAsync(bool tracking = false)
        {
            var categories = await categoryRepository.GetListBySpec(new CategorySpecs.GetAll(tracking));
            return mapper.Map<IEnumerable<CategoryChildsTreeDto>> (BuildTree(null, categories));
        }

        private IEnumerable<Category> BuildTree(int? parentId, IEnumerable<Category> categories)
        {
            return categories
                .Where(c => c.ParentId == parentId)
                .Select(c =>
                {
                    c.Childs = BuildTree(c.Id, categories).ToHashSet();
                    return c;
                });
        }

        public async Task<PageResponse<CategoryDto>> GetPageAsync(CategoryPageRequest pageRequest)
        {
            var paginationBuilder = new PaginationBuilder<Category>(categoryRepository);
            var filter = new CategoryFilter(pageRequest.SearchName, pageRequest.ParentId);
            var sortData = new CategorySortData(pageRequest.IsDescending, pageRequest.SortIndex);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page, pageRequest.Size, filter, sortData);
            return new()
            {
                Total = page.Total,
                Items = mapper.Map<IEnumerable<CategoryDto>>(page.Items)
            };
        }
    }
}
