import { Radio } from "antd"
import { useRef } from "react"
import { AdvertSortData } from "./models"
import { useSearchParams } from "react-router-dom"

interface AdvertSortProps {
    onChange?: (value: AdvertSortData) => void
    className?: string
}

const getSearchKey = (params: URLSearchParams): string | undefined => {
    const desc: boolean | undefined = params.has('isDescending') ? params.get('isDescending') === 'true' : undefined
    const sortKey: string | undefined = params.get('sortKey') || undefined
    if (!sortKey) return undefined;
    return sortKey === 'price'
        ? desc ? 'bigprice' : 'smallprice'
        : desc ? 'newest' : 'oldest';
}

const AdvertSort: React.FC<AdvertSortProps> = ({ onChange, className }) => {
    const [searchParams] = useSearchParams();
    const sortData = useRef<string>(getSearchKey(searchParams) || "newest")
    const change = (sortKey: string) => {
        let result = {
            sort: sortKey === "oldest" || sortKey === "newest" ? 'date' : 'price',
            desc: sortKey === "newest" || sortKey === "bigprice",
        };
        sortData.current = sortKey
        onChange && onChange(result)
    }

    return (
        <div className={`.filter-radio ${className}`}>
            <Radio.Group
                value={sortData.current}
                onChange={(e) => change(e.target.value)}
                className="mb-[1vh] font-unbounded filter-radio flex flex-col gap-[.3vh]">
                <Radio value={'newest'}>найновіші</Radio>
                <Radio value={'oldest'}>найстаріші</Radio>
                <Radio value={'smallprice'}>найдешевші</Radio>
                <Radio value={'bigprice'}>найдорожчі</Radio>
            </Radio.Group>
        </div>
    )
}

export default AdvertSort