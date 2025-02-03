import { Col, Row } from "antd"
import { useGetAllFilterQuery } from "../../redux/api/filterApi"
import { useCallback } from "react"
import { AdvertParametersProps } from "./props"
import { AdvertParemeter } from "./models"

const AdvertParameters: React.FC<AdvertParametersProps> = ({ advertValues,className }) => {
    const { data: filters, isLoading: isFilterLoading } = useGetAllFilterQuery()
    const getParameters = useCallback((): AdvertParemeter[] => {
        return advertValues.map(x => ({
            name: filters?.find(z => z.id == x.filterId)?.name || '',
            value: x.value
        })) || []
    }, [advertValues, filters])
    return (
        <>
            {!isFilterLoading &&
                <Row className={className} gutter={[16, 16]} >
                    {
                        getParameters().map(x =>
                            <Col span={8}>
                                <div className="flex gap-3">
                                    <span className="text-adaptive-footer-text font-montserrat text-black font-medium">{x.name}:</span>
                                    <span className="text-adaptive-footer-text font-montserrat text-black ">{x.value}</span>
                                </div>
                            </Col>
                        )
                    }
                </Row>
            }
        </>
    )
}
export default AdvertParameters 