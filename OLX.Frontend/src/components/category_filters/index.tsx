import { useMemo } from "react"
import { useGetAllFilterQuery } from "../../redux/api/filterApi"
import { CategoryFiltersProps } from "./props"
import Filter from "../filter"
import { Button, Form } from "antd"
import PriceFilter from "../price_filter"

const crearedPariceFilter = {
    priceFrom: undefined,
    priceTo: undefined,
    isContractPrice: undefined
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categoryFiltersIds, onChange, className }) => {
    const [form] = Form.useForm()
    const { data: filters } = useGetAllFilterQuery()

    const clearedFormFilters = useMemo(() => filters?.map(x => x.id).reduce((acc, key) => {
        acc[key] = undefined;
        return acc;
    }, {} as Record<string, any>), [filters])

    const onFinish = (data: any) => {
        const result = Object.values(data).filter(x => x !== undefined && Array.isArray(x) && ((x as []).length > 0)) as number[][];
        if (onChange) {
            onChange(result, data.priceFrom, data.priceTo, data.isContractPrice)
        }
    }

    const onReset = (key: number | undefined) => {
        if (onChange) {
            if (key) {
                key < 0
                    ? form.setFieldsValue(crearedPariceFilter)
                    : form.setFieldValue(key, [])
                form.submit()
            }
            else {
                form.setFieldsValue({ ...crearedPariceFilter, ...clearedFormFilters })
                onChange([], undefined, undefined, undefined)
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
            <PriceFilter
                className="mb-[2vh]"
                onChange={() => form.submit()}
                onReset={onReset} />
            {...filterElements}
            {filterElements?.length > 0 &&
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