import { useEffect, useRef } from "react";
import { IAdvertSearchPageData } from "../../../models/advert";
import { useSearchParams } from "react-router-dom";
import CategoryNavigation from "../../../components/category_navigation";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import { useGetAdvertPageQuery } from "../../../redux/api/advertApi";
import { getAdvertPageRequest } from "../../../utilities/common_funct";

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
    filters: searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[]) : [],
    isContractPrice: searchParams.get("isContractPrice") === "true" || undefined,
    search: searchParams.get("search") || undefined,
});

const AdvertsPage: React.FC = () => {
    const { data: categories } = useGetAllCategoriesQuery();
    const [searchParams, setSearchParams] = useSearchParams('');
    const pageRequest = useRef<IAdvertSearchPageData>(updatedPageRequest(searchParams));
    const { data: adverts, isLoading: isAdvertLoading, refetch: advertRefetch } = useGetAdvertPageQuery(getAdvertPageRequest(pageRequest.current, categories || []))
    useEffect(() => {
        pageRequest.current = updatedPageRequest(searchParams)
        advertRefetch()
    }, [searchParams])
    console.log(adverts)
    return (
        <div className="w-[100%] gap-[8vh] flex flex-col my-[6vh]">
            <div className="mx-[8vw] gap-[8vh] items-start flex  flex-col">
                <CategoryNavigation categoryId={Number(searchParams.get("categoryId"))} />
                <div className="self-center">
                    {!isAdvertLoading && adverts?.items.map(x => <h2 key={x.id}>{x.title}</h2>)}
                </div>

            </div>

        </div>
    )
}

export default AdvertsPage