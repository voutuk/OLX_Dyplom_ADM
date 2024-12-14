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
using Olx.BLL.Exstensions;


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
       
        public async Task<AdvertDto> CreateAsync(AdvertCreationModel advertModel)
        {
            advertCreationModelValidator.ValidateAndThrow(advertModel);
            var curentUser = await userManager.UpdateUserActivityAsync(httpContext);
            if (curentUser.Id != advertModel.UserId)
            {
                throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            }

            var advert = mapper.Map<Advert>(advertModel);
            var images = advertModel.ImageFiles.Select(async (x, index) => new AdvertImage()
            {
                Priority = index,
                Name = await imageService.SaveImageAsync(x)
            });

            advert.Images = await Task.WhenAll(images);
            if (advertModel.FilterValueIds.Count != 0)
            {
                var values = await filterValueService.GetByIdsAsync(advertModel.FilterValueIds);
                advert.FilterValues = values.ToList();
            }

            await advertRepository.AddAsync(advert);
            await advertRepository.SaveAsync();
            return mapper.Map<AdvertDto>(advert);
        }

        public async Task DeleteAsync(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var advert = await advertRepository.GetItemBySpec( new AdvertSpecs.GetById(id,AdvertOpt.Images))
                ?? throw new HttpException(Errors.InvalidAdvertId,HttpStatusCode.BadRequest);
            advertRepository.Delete(advert);
            await advertRepository.SaveAsync();
            imageService.DeleteImagesIfExists(advert.Images.Select(x => x.Name));
        }

        public async Task<IEnumerable<AdvertDto>> GetRangeAsync(IEnumerable<int> ids)
        {
            var adverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetByIds(ids,AdvertOpt.NoTracking | AdvertOpt.Images | AdvertOpt.FilterValues));
            return adverts.Any() ? mapper.Map<IEnumerable<AdvertDto>>(adverts) : [];  
        }

        public async Task<IEnumerable<AdvertDto>> GetAllAsync()
        {
            var adverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetAll(AdvertOpt.NoTracking | AdvertOpt.Images | AdvertOpt.FilterValues));
            return adverts.Any() ? mapper.Map<IEnumerable<AdvertDto>>(adverts) : [];
        }

        public async Task<IEnumerable<AdvertDto>> GetUserAdverts()
        {
            var curentUser = await userManager.UpdateUserActivityAsync(httpContext); 
            var adverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetByUserId(curentUser.Id, AdvertOpt.NoTracking | AdvertOpt.Images | AdvertOpt.FilterValues));
            return adverts.Any() ? mapper.Map<IEnumerable<AdvertDto>>(adverts) : [];
        }

        public async Task<IEnumerable<AdvertDto>> GetByUserId(int userId)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var user = userManager.FindByIdAsync(userId.ToString())
                ?? throw new HttpException(Errors.InvalidUserId,HttpStatusCode.BadRequest);
            var adverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetByUserId(user.Id, AdvertOpt.NoTracking | AdvertOpt.Images | AdvertOpt.FilterValues));
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

        public async Task<AdvertDto> UpdateAsync(AdvertCreationModel advertModel)
        {
            advertCreationModelValidator.ValidateAndThrow(advertModel);
            var curentUser = await userManager.UpdateUserActivityAsync(httpContext);
            if (curentUser.Id != advertModel.UserId)
            {
                throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            }

            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetUserAdvertById(curentUser.Id,advertModel.Id, AdvertOpt.Images))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);

            mapper.Map(advertModel, advert);
            var existingImagesNames = advertModel.ImageFiles.Where(x => x.ContentType == "image/existing").Select(x => x.FileName) ?? [];
            if (existingImagesNames.Any())
            {
                var imagesToDelete = advert.Images.Where(x => !existingImagesNames.Contains(x.Name));
                if (imagesToDelete.Any())
                {
                    advert.Images = advert.Images.Where(x => !imagesToDelete.Contains(x)).ToList();
                    imageService.DeleteImages(imagesToDelete.Select(x => x.Name));
                }
            }

            if (advertModel.ImageFiles.Count != 0)
            {
                advertModel.ImageFiles.Select((x,index) => new {file = x , index }).AsParallel().ForAll(async (item) => 
                {
                    if (item.file.ContentType == "image/existing")
                    {
                        var oldImage = advert.Images.FirstOrDefault(x => x.Name == item.file.FileName)!;
                        oldImage.Priority = item.index;
                    }
                    else
                    {
                        var imageName = await imageService.SaveImageAsync(item.file);
                        advert.Images.Add(new AdvertImage
                        {
                            Name = imageName,
                            Priority = item.index
                        });
                    }
                });
            }

            if (advertModel.FilterValueIds.Count != 0)
            {
                var values = await filterValueService.GetByIdsAsync(advertModel.FilterValueIds);
                advert.FilterValues = values.ToList();
            }

            await advertRepository.SaveAsync();
            return mapper.Map<AdvertDto>(advert);
        }

        public async Task ApproveAsync(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(id))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            if (!advert.Blocked)
            {
                advert.Approved = true;
                await advertRepository.SaveAsync();
            }
            else throw new HttpException(Errors.AdvertIsBlocked, HttpStatusCode.BadRequest);
        }

        public async Task SetBlockedStatusAsync(int id, bool status)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(id))
                 ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            advert.Blocked = status;
            await advertRepository.SaveAsync();
        }  
    }
}
