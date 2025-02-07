import { useMemo } from "react"
import { useGetAllFilterQuery } from "../../redux/api/filterApi"
import { CategoryFiltersProps } from "./props"
import Filter from "../filter"
import { Button, Form } from "antd"

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categoryFiltersIds, onChange, className }) => {
    const [form] = Form.useForm()
    const { data: filters } = useGetAllFilterQuery()
    
    const onFinish = (data: any) => {
        const result = Object.values(data).filter(x => x !== undefined && ((x as []).length > 0)) as number[][];
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

    const filterElements = useMemo(() =>
        filters?.filter(x => categoryFiltersIds?.includes(x.id)).map((filter) =>
            <Filter
                key={filter.id}
                filter={filter}
                onChange={() => form.submit()}
                onReset={onReset} /> 
        ) || [], [filters, categoryFiltersIds])

    return (
        <Form
            form={form}
            className={className}
            onFinish={onFinish}
            layout="vertical">
            {...filterElements}
            {filterElements?.length > 1 &&
                <Button
                    size="small"
                    className=" self-start text-adaptive-1_6-text text-[red]"
                    type='text'
                    onClick={() => onReset(undefined)} >
                    Очистити всі
                </Button>
            }
        </Form>
    )
}

export default CategoryFilters