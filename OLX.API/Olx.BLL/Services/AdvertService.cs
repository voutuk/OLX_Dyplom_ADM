using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Advert;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Pagination;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Models.Page;
using Olx.BLL.Exceptions;
using Olx.BLL.Resources;
using System.Net;
using Olx.BLL.Specifications;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;


namespace Olx.BLL.Services
{
    public class AdvertService(
        IRepository<Advert> advertRepository,
        UserManager<OlxUser> userManager,
        IFilterValueService filterValueService,
        IImageService imageService,
        IHttpContextAccessor httpContext,
        IMapper mapper,
        IValidator<AdvertCreationModel> advertCreationModelValidator) : IAdvertService
    {
        private async Task<OlxUser> UpdateUserActivity()
        {
            var curentUser = await userManager.GetUserAsync(httpContext.HttpContext?.User!)
              ?? throw new HttpException(Errors.ErrorAthorizedUser, HttpStatusCode.InternalServerError);
            curentUser.LastActivity = DateTime.UtcNow;
            await userManager.UpdateAsync(curentUser);
            return curentUser;
        }
        public async Task CreateAsync(AdvertCreationModel advertModel)
        {
            advertCreationModelValidator.ValidateAndThrow(advertModel);
            var curentUser = await UpdateUserActivity();
            if (curentUser.Id != advertModel.UserId)
            {
                throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            }
            var advert = mapper.Map<Advert>(advertModel);
            advert.Id = 0;
            var images = advertModel.ImageFiles.Select(async (x, index) => new AdvertImage()
            {
                Priority = index,
                Name = await imageService.SaveImageAsync(x)
            });
            advert.Images = await Task.WhenAll(images);
            if (advertModel.FilterValueIds.Count != 0)
            {
                var values = await filterValueService.GetByIdsAsync(advertModel.FilterValueIds);
                advert.FilterValues = values.ToHashSet();
            }
            await advertRepository.AddAsync(advert);
            await advertRepository.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await UpdateUserActivity();
            var advert = await advertRepository.GetItemBySpec( new AdvertSpecs.GetById(id,AdvertOpt.Images))
                ?? throw new HttpException(Errors.InvalidAdvertId,HttpStatusCode.BadRequest);
            advertRepository.Delete(advert);
            await advertRepository.SaveAsync();
            imageService.DeleteImagesIfExists(advert.Images.Select(x=>x.Name));
        }

        public async Task<IEnumerable<AdvertDto>> GetRangeAsync(IEnumerable<int> ids)
        {
            var adverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetByIds(ids,AdvertOpt.NoTracking|AdvertOpt.Images|AdvertOpt.FilterValues));
            return adverts.Any() ? mapper.Map<IEnumerable<AdvertDto>>(adverts) : [];  
        }

        public async Task<IEnumerable<AdvertDto>> GetAllAsync()
        {
            var adverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetAll(AdvertOpt.NoTracking | AdvertOpt.Images | AdvertOpt.FilterValues));
            return adverts.Any() ? mapper.Map<IEnumerable<AdvertDto>>(adverts) : [];
        }

        public async Task<IEnumerable<AdvertDto>> GetByUserIdAsync(int userId)
        {
            var curentUser = await UpdateUserActivity();
            if (curentUser.Id != userId)
            {
                throw new HttpException(Errors.InvalidUserId,HttpStatusCode.BadRequest);
            }
            var adverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetByUserId(userId, AdvertOpt.NoTracking | AdvertOpt.Images | AdvertOpt.FilterValues));
            return adverts.Any() ? mapper.Map<IEnumerable<AdvertDto>>(adverts) : [];
        }

        public async Task<AdvertDto> GetByIdAsync(int id)
        {
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(id, AdvertOpt.NoTracking | AdvertOpt.Images | AdvertOpt.FilterValues))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            return mapper.Map<AdvertDto>(advert);
        }

        public async Task<IEnumerable<AdvertImageDto>> GetImagesAsync(int id)
        {
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(id, AdvertOpt.NoTracking | AdvertOpt.Images))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            return mapper.Map<IEnumerable<AdvertImageDto>>(advert.Images);
        }

        public async Task<PageResponse<AdvertDto>> GetPageAsync(AdvertPageRequest pageRequest)
        {
            var paginationBuilder = new PaginationBuilder<Advert>(advertRepository);
            var filter = mapper.Map<AdvertFilter>(pageRequest);
            var sortData = new AdvertSortData(pageRequest.IsDescending, pageRequest.SortIndex);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page, pageRequest.Size, filter, sortData);
            return new()
            {
                Total = page.Total,
                Items = mapper.Map<IEnumerable<AdvertDto>>(page.Items)
            };
        }

        public async Task UpdateAsync(AdvertCreationModel advertModel)
        {
            advertCreationModelValidator.ValidateAndThrow(advertModel);
            var curentUser = await UpdateUserActivity();
            if (curentUser.Id != advertModel.UserId)
            {
                throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            }
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetUserAdvertById(curentUser.Id,advertModel.Id, AdvertOpt.Images))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);

            mapper.Map(advertModel, advert);
            var imagesNames = advertModel.ImageFiles.Where(x => x.ContentType == "image/existing").Select(x => x.FileName) ?? [];
            if (imagesNames.Any())
            {
                var imagesToDelete = advert.Images.Where(x => !imagesNames.Contains(x.Name)) ?? [];
                if (imagesToDelete.Any())
                {
                    advert.Images = advert.Images.Where(x => !imagesToDelete.Contains(x)).ToHashSet();
                    imageService.DeleteImages(imagesToDelete.Select(x => x.Name));
                }
            }

            if (advertModel.ImageFiles.Count != 0)
            {
                int index = 0;
                foreach (var image in advertModel.ImageFiles)
                {
                    if (image.ContentType == "image/existing")
                    {
                        var oldImage = advert.Images.FirstOrDefault(x => x.Name == image.FileName)!;
                        oldImage.Priority = index;
                    }
                    else
                    {
                        var imageName = await imageService.SaveImageAsync(image);
                        advert.Images.Add(new AdvertImage
                        {
                            Name = imageName,
                            Priority = index
                        });
                    }
                    index++;
                }
            }
            if (advertModel.FilterValueIds.Count != 0)
            {
                var values = await filterValueService.GetByIdsAsync(advertModel.FilterValueIds);
                advert.FilterValues = values.ToHashSet();
            }

            await advertRepository.SaveAsync();
        }

        public async Task ApproveAsync(int id)
        {
            await UpdateUserActivity();
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(id))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            advert.Approved = true;
            await advertRepository.SaveAsync();
        }

        public async Task SetBlockedStatusAsync(int id, bool status)
        {
            await UpdateUserActivity();
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(id))
                 ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            advert.Blocked = status;
            await advertRepository.SaveAsync();
        }  
    }
}
