import { Collapse, Form, Select, Spin, TreeSelect } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetAllFilterQuery } from "../../redux/api/filterApi";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { buildTree, clamp, getAllParentFilterIds, getLastChildrenCategoriesIds } from "../../utilities/common_funct";
import { AdminAdvertFiltersProps } from "./props";
import { FilterData } from "./models";
import { ClearOutlined } from '@ant-design/icons'
import { useSearchParams } from "react-router-dom";
import { IFilter } from "../../models/filter";


const AdminAdvertCollapsedFilters: React.FC<AdminAdvertFiltersProps> = ({ onFiltersChange, columns = 4 }) => {
    const [searchParams] = useSearchParams('');
    const [form] = Form.useForm();
    const { data: filters, isLoading } = useGetAllFilterQuery();
    const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery()
    const categoryId = useRef<number | undefined>();
    const [categoryFilters, setCategoryFilters] = useState<FilterData>({
        filters: [],
        filterWidth: 0,
        isFilterClear: true,
        filtersValues: []
    });

    const onCategoryChange = (category: number | undefined) => {
        categoryId.current = category
        updateCategoryFilters(category)
        form.resetFields()
        onFiltersChange({ filters: [], categoryIds: getChildCategories() })
    }

    const updateCategoryFilters = (categoryId: number | undefined, filterValues?: number[]) => {
        const categoryFilters = getAllParentFilterIds(categories || [], categoryId)
        const curentFilters = filters?.filter(x => categoryFilters.includes(x.id)) || []
        let filterWidth = curentFilters.length < columns
            ? clamp(100 / curentFilters.length - 0.8, 10, 25)
            : clamp(100 / columns - 0.8, 10, 25)
        setCategoryFilters({ filters: curentFilters, filterWidth: filterWidth, isFilterClear: !categoryId, filtersValues: filterValues || [] })
    }

    const confirm = (data: any) => {
        const result = Object.values(data).filter(x => x !== undefined && ((x as []).length > 0)).flat() as number[];
        onFiltersChange({ filters: result, categoryIds: getChildCategories() })
    }

    const getCategoryTree = useCallback(() => buildTree(categories || []), [categories])
    const getChildCategories = useCallback(() => categoryId.current
        ? [categoryId.current, ...getLastChildrenCategoriesIds(categories || [], categoryId.current)]
        : [],
        [categories, categoryId.current])


    useEffect(() => {
        const categoriesIds = searchParams.get("categoryIds")
            ? (JSON.parse(searchParams.get("categoryIds") || '') as number[])
            : []
        if (categoriesIds.length > 0) {
            categoryId.current = categoriesIds[0]
            const filterValues = searchParams.get("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[]) : []
            updateCategoryFilters(categoriesIds[0], filterValues)
        }
    }, [])

    const initFilter = (filter: IFilter): number[] => {
        if (categoryFilters.filtersValues.length > 0) {
            const filterValues = filter.values.map(x => x.id);
            return categoryFilters.filtersValues.filter(item => filterValues.some(x => x == item));
        }
        return [];
    }
    return (
        <Collapse
            size='small'
            className="text-start"
            items={[
                {
                    key: '1',
                    label: 'Фільтри',
                    extra: <ClearOutlined hidden={categoryFilters.isFilterClear} className="text-red-700" onClick={(event) => {
                        onCategoryChange(undefined)
                        event.stopPropagation();
                    }} />,
                    children:
                        <Form
                            form={form}
                            onFinish={confirm}
                        >
                            {(isLoading || isCategoriesLoading)
                                ? <Spin size="small" />
                                : <div className="flex flex-col items-start" >
                                    <span>Категорія</span>
                                    <TreeSelect
                                        value={categoryId.current}
                                        allowClear
                                        showSearch
                                        loading={isCategoriesLoading}
                                        className="mb-3"
                                        style={{ width: '50%', maxWidth: 400 }}
                                        dropdownStyle={{ maxWidth: 400, overflow: 'auto' }}
                                        treeData={getCategoryTree()}
                                        placeholder="Категорія"
                                        onChange={onCategoryChange}
                                    />
                                    {categoryFilters.filters.length > 0 &&
                                        <>
                                            <span>Фільтри</span>
                                            <div className=" flex flex-wrap gap-[.5vw] w-full border rounded-xl p-3">
                                                {categoryFilters.filters.map(filter =>
                                                    <Form.Item
                                                        noStyle
                                                        key={filter.id}
                                                        name={filter.id}
                                                        initialValue={initFilter(filter)}
                                                    >
                                                        <Select
                                                            style={{ width: `${categoryFilters.filterWidth}%` }}
                                                            allowClear
                                                            mode={filter.values.length > 2 ? 'tags' : undefined}
                                                            maxTagCount='responsive'
                                                            options={filter.values.map(value => ({ value: value.id.toString(), label: value.value }))}
                                                            placeholder={filter.name}
                                                            onChange={() => form.submit()}
                                                        />
                                                    </Form.Item>
                                                )}
                                            </div>
                                        </>
                                    }
                                </div>}
                        </Form>,
                }]}
        />)
};

export default AdminAdvertCollapsedFilters;