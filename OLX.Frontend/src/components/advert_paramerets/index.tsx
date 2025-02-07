import { useGetAllFilterQuery } from "../../redux/api/filterApi"
import { useMemo } from "react"
import { AdvertParametersProps } from "./props"
import { AdvertParemeter } from "./models"

const AdvertParameters: React.FC<AdvertParametersProps> = ({ advertValues, className }) => {
    const { data: filters, isLoading: isFilterLoading } = useGetAllFilterQuery()
    const getParameters = useMemo((): AdvertParemeter[] => {
        return advertValues && filters ? advertValues.map(x => ({
            name: filters?.find(z => z.id == x.filterId)?.name || '',
            value: x.value
        })) : []
    }, [advertValues, filters])
    return (
        <>
            {!isFilterLoading &&
                <div className={`flex gap-x-[2vw] gap-y-[1vh] flex-wrap  ${className}`}  >
                    {
                        getParameters.map((x, index) =>
                            <div key={index} className="flex gap-3">
                                <span className="text-adaptive-footer-text font-montserrat text-black font-medium">{x.name}:</span>
                                <span className="text-adaptive-footer-text font-montserrat text-black ">{x.value}</span>
                            </div>
                        )
                    }
                </div>
            }
        </>
    )
}
export default AdvertParameters 