import { useState } from "react";
import { IAdvertPageRequest } from "../../../models/advert";
import { paginatorConfig } from "../../../utilities/pagintion_settings";
import { useSearchParams } from "react-router-dom";
import CategoryNavigation from "../../../components/category_navigation";
import { getLastChildrenCategoriesIds } from "../../../utilities/common_funct";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import { ICategory } from "../../../models/category";

const updatedPageRequest = (searchParams: URLSearchParams, categories: ICategory[]): IAdvertPageRequest => ({
    priceFrom: Number(searchParams.get("priceFrom")),
    priceTo: Number(searchParams.get("priceTo")),
    approved: true,
    blocked: false,
    size: Number(searchParams.get("size")) || paginatorConfig.pagination.defaultPageSize,
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    sortKey: searchParams.get("sortKey") || '',
    isDescending: searchParams.get("isDescending") === "true",
    categoryIds: searchParams.has("categoryId") ? getLastChildrenCategoriesIds(categories, Number(searchParams.get("categoryId"))) : [],
    filters: searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[]) : [],
    isContractPrice: searchParams.get("isContractPrice") === "true" || undefined,
    search: searchParams.get("search") || '',
});

const AdvertsPage: React.FC = () => {
    const { data: categories } = useGetAllCategoriesQuery();
    const [searchParams, setSearchParams] = useSearchParams('');
    const [pageRequest, setPageRequest] = useState<IAdvertPageRequest>(updatedPageRequest(searchParams, categories || []));

    console.log(pageRequest)
    return (
        <div className="w-[100%] gap-[8vh] flex flex-col my-[6vh]">
            <div className="mx-[8vw] gap-[8vh] items-start flex  flex-col">
                <CategoryNavigation categoryId={Number(searchParams.get("categoryId"))} />

            </div>

        </div>
    )
}

export default AdvertsPage