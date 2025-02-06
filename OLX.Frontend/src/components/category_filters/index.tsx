import { useCallback } from "react"
import { useGetAllFilterQuery } from "../../redux/api/filterApi"
import { CategoryFiltersProps } from "./props"

import Filter from "../filter"
import { useGetCategoryByIdQuery } from "../../redux/api/categoryApi"
import { Button, Form } from "antd"


const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categoryId, onChange }) => {
    const [form] = Form.useForm()
    const { data: filters } = useGetAllFilterQuery()
    const { data: category } = useGetCategoryByIdQuery(categoryId || 0)
    const getCategoryFilters = useCallback(() => filters?.filter(x => category?.filters.includes(x.id)), [category])
    const onFinish = (data: any) => {
        const result = Object.values(data).filter(x => x !== undefined && ((x as []).length > 0)).flat() as number[];
        if (onChange) {
            onChange(result)
        }
    }

    const onReset = (key: number | undefined) => {
        if (onChange) {
            if (key) {
                form.setFieldValue(key, [])
                form.submit()
            }
            else {
                form.resetFields()
                onChange([])
            }
        }
    }

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical">
            {getCategoryFilters()?.map((filter) =>
                <Filter
                    key={filter.id}
                    filter={filter}
                    onChange={() => form.submit()}
                    onReset={onReset} />
            )}
            <Button
                size="small"
                className=" self-start  text-[red]"
                type='text'
                onClick={() => onReset(undefined)} >
                Очистити всі
            </Button>
        </Form>

    )
}

export default CategoryFilters