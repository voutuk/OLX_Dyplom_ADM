import { Button, Checkbox, Form } from "antd"
import { FilterProps } from "./props"
import { useSearchParams } from "react-router-dom";
import { useMemo, useRef } from "react";

const Filter: React.FC<FilterProps> = ({ filter, onChange, onReset }) => {
    const [searchParams] = useSearchParams('');
    const init = useRef<boolean>(true);

    const initFilter = (): number[] | undefined => {
        if (filter && init.current) {
            const filtersValues = searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[][]).flat() : []
            if (filtersValues.length > 0) {
                const filterValues = filter.values.map(x => x.id);
                init.current = false
                return filtersValues.flat().filter(item => filterValues.some(x => x == item));
            }
        }
        return undefined;
    }
    console.log('update - ', filter?.id)

    const checkBoxes = useMemo(() => filter?.values.map(x =>
        <Checkbox className="filter-checkbox" style={{ fontSize: 'clamp(14px, 1.7vh, 36px)', fontWeight: 400 }} key={x.id} value={x.id}>{x.value}</Checkbox>
    ) || [], [filter])

    return (
        <Form.Item
            name={filter?.id}
            label={<span className="font-unbounded text-adaptive-1_6-text"> {filter?.name}</span>}
            initialValue={initFilter()}
        >
            <Checkbox.Group
                className="flex flex-col gap-[.3vh]"
                onChange={onChange}>
                {...checkBoxes}
                <Button
                    size="small"
                    className=" self-start p-0  text-[red]"
                    type='link'
                    onClick={() => onReset && onReset(filter?.id)}>
                    Очистити
                </Button>
            </Checkbox.Group>
        </Form.Item>
    )
}

export default Filter