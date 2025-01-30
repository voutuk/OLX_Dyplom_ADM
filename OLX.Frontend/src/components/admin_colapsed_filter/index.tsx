import { Collapse, Form, Select, Spin, TreeSelect } from "antd";
import { useCallback, useState } from "react";
import { useGetAllFilterQuery } from "../../redux/api/filterApi";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { buildTree, getAllParentFilterIds } from "../../utilities/common_funct";
import { AdminAdvertFiltersProps } from "./props";
import { FilterData } from "./models";
import { ClearOutlined } from '@ant-design/icons'


const AdminAdvertCollapsedFilters: React.FC<AdminAdvertFiltersProps> = ({ onFiltersChange, columns = 4 }) => {
    const [form] = Form.useForm();
    const { data: filters, isLoading } = useGetAllFilterQuery();
    const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery()
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [filteredFilters, setFilteredFilters] = useState<FilterData>({
        filters: [],
        filterWidth: 0
    });

    const onCategoryChange = (category: number | undefined) => {
        setCategoryId(category)
        const categoryFilters = getAllParentFilterIds(categories || [], category)
        const curentFilters = filters?.filter(x => categoryFilters.includes(x.id)) || []
        const filterWidth = curentFilters.length < columns ? 100 / curentFilters.length - 0.8 : 100 / columns - 0.8
        setFilteredFilters({ filters: curentFilters, filterWidth: filterWidth })
        form.resetFields()
        onFiltersChange({ filters: [], categoryId: category })
    }

    const confirm = (data: any) => {
        const result = Object.values(data).filter(x => x !== undefined && (x instanceof Array && x.length > 0)).flat() as number[];
        onFiltersChange({ filters: result, categoryId: categoryId })
    }

    const getCategoryTree = useCallback(() => buildTree(categories || []), [categories])

    return (
        <Collapse
            size='small'
            className="text-start"
            items={[
                {
                    key: '1',
                    label: 'Фільтри',
                    extra: <ClearOutlined hidden={categoryId === undefined} className="text-red-700" onClick={(event) => {
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
                                        value={categoryId}
                                        allowClear
                                        showSearch
                                        loading={isCategoriesLoading}
                                        className="mb-3"
                                        style={{ width: '50%' }}
                                        dropdownStyle={{ maxWidth: 600, overflow: 'auto' }}
                                        treeData={getCategoryTree()}
                                        placeholder="Категорія"
                                        onChange={onCategoryChange}
                                    />
                                    {filteredFilters.filters.length > 0 &&
                                        <>
                                            <span>Фільтри</span>
                                            <div className=" flex flex-wrap gap-[.5vw] w-full border rounded-xl p-3">
                                                {filteredFilters.filters.map(filter =>
                                                    <Form.Item
                                                        noStyle
                                                        key={filter.id}
                                                        name={filter.id}
                                                    >
                                                        <Select
                                                            style={{ width: `${filteredFilters.filterWidth}%` }}
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