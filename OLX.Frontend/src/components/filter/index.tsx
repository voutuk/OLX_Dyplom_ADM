import { Button, Checkbox, Form } from "antd"
import { IFilter } from "../../models/filter"

interface FilterProps {
    filter?: IFilter
    onChange?: () => void
    onReset?: (key: number | undefined) => void
}

const Filter: React.FC<FilterProps> = ({ filter, onChange, onReset }) => {
    return (
        <Form.Item
            name={filter?.id}
            label={filter?.name}>
            <Checkbox.Group
                className="flex flex-col gap-[.5vh]"
                onChange={onChange}>
                {filter?.values.map(x =>
                    <Checkbox key={x.id} value={x.id}>{x.value}</Checkbox>
                )}
                <Button
                    size="small"
                    className=" self-start  text-[red]"
                    type='text'
                    onClick={() =>onReset && onReset(filter?.id)}>
                    Очистити
                </Button>
            </Checkbox.Group>
        </Form.Item>
    )
}

export default Filter