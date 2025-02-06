import { useEffect, useRef } from "react";
import { IAdvertSearchPageData } from "../../../models/advert";
import { useSearchParams } from "react-router-dom";
import CategoryNavigation from "../../../components/category_navigation";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import { useGetAdvertPageQuery } from "../../../redux/api/advertApi";
import { getAdvertPageRequest, getAllParentFilterIds, getQueryString } from "../../../utilities/common_funct";
import Collapsed from "../../../components/advert_collapse";
import CategoryTree from "../../../components/category_tree";
import CategoryFilters from "../../../components/category_filters";
import AdvertsSection from "../../../components/adverts_section";
import PrimaryButton from "../../../components/buttons/primary_button";


const updatedPageRequest = (searchParams: URLSearchParams): IAdvertSearchPageData => ({
    priceFrom: Number(searchParams.get("priceFrom")),
    priceTo: Number(searchParams.get("priceTo")),
    approved: true,
    blocked: false,
    size: Number(searchParams.get("size")) || 15,
    page: Number(searchParams.get("page")) || 1,
    sortKey: searchParams.get("sortKey") || '',
    isDescending: searchParams.get("isDescending") === "true",
    categoryId: searchParams.has("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    filters: searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[][]) : [],
    isContractPrice: searchParams.get("isContractPrice") === "true" || undefined,
    search: searchParams.get("search") || undefined,
});

const AdvertsPage: React.FC = () => {
    const { data: categories } = useGetAllCategoriesQuery();
    const [searchParams, setSearchParams] = useSearchParams('');
    const pageRequest = useRef<IAdvertSearchPageData>(updatedPageRequest(searchParams));
    const { data: adverts, isLoading: isAdvertsLoading, refetch: advertRefetch } = useGetAdvertPageQuery(getAdvertPageRequest(pageRequest.current, categories || []))
    useEffect(() => {
        pageRequest.current = updatedPageRequest(searchParams)
        console.log(updatedPageRequest(searchParams))
        advertRefetch()
    }, [searchParams])


    return (
        <div className="w-[100%] gap-[8vh]  flex flex-col my-[6vh]">
            <div className="mx-[8vw] gap-[8vh] h-full items-start flex  flex-col">
                <CategoryNavigation categoryId={Number(searchParams.get("categoryId"))} />
                {/* Заголовок */}
                <div className="w-[100%] h-full flex gap-[1vw] " >
                    <div className="w-[17%] flex flex-col gap-[3vh] advert-collapse">
                        <Collapsed
                            title="Категорія"
                            className="text-adaptive-card-price-text text-[#3A211C] font-unbounded">

                            <div className="overflow-x-auto">
                                <CategoryTree
                                    categories={categories}
                                    className="font-montserrat text-nowrap text-adaptive-input-form-text"
                                    categoryId={pageRequest.current.categoryId}
                                    onSelect={(id) => {
                                        if (id) {
                                            setSearchParams(getQueryString(({ ...pageRequest.current, categoryId: id })))
                                        }
                                    }}
                                />
                            </div>
                        </Collapsed>

                        <Collapsed
                            title="Фільтр"
                            className="text-adaptive-card-price-text text-[#3A211C] font-unbounded">
                            <CategoryFilters
                                categoryFiltersIds={getAllParentFilterIds(categories || [],pageRequest.current.categoryId)}
                                onChange={(result) => setSearchParams(getQueryString(({ ...pageRequest.current, filters: result })))}
                            />
                        </Collapsed>

                        <Collapsed
                            title="Сортувати"
                            className="text-adaptive-card-price-text text-[#3A211C] font-unbounded">
                            <div className="h-[120px] bg-slate-300 flex items-center justify-center">Сортувати</div>
                        </Collapsed>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-[8vh]">
                        <AdvertsSection
                            isLoading={isAdvertsLoading}
                            adverts={adverts?.items} />
                        {adverts && adverts.total != adverts.items.length  &&
                            <PrimaryButton
                                onButtonClick={() => { }}
                                title='Завантажити ще'
                                disabled={false}
                                isLoading={isAdvertsLoading}
                                className='w-[19vw] h-[4.5vh] '
                                bgColor='#9B7A5B'
                                fontColor='white'
                                brColor='#9B7A5B' />
                        }

                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdvertsPage