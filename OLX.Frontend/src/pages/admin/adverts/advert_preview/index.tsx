import { Preview } from "@mui/icons-material"
import { PageHeader } from "../../../../components/page_header"
import { BackButton } from "../../../../components/buttons/back_button"
import { useParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../../redux/api/advertApi";
import AdvertViewer from "../../../../components/advert_viewer";

const AdminAdvertPreview: React.FC = () => {
    const { id } = useParams();
    const { data: advert, isLoading } = useGetAdvertByIdQuery(Number(id))
    return (
        <div className="m-6 flex-grow  overflow-hidden">
            <PageHeader
                title={`Oголошення`}
                icon={<Preview className="text-2xl" />}
            // buttons={[
            //     // <PageHeaderButton
            //     //     key='filters'
            //     //     onButtonClick={() => setIsFiltersOpen( true )}
            //     //     className="w-[35px] h-[35px] bg-green-700"
            //     //     buttonIcon={<FilterOutlined  className="text-lg" />}
            //     //     tooltipMessage="Фільтри"
            //     //     tooltipColor="gray" />,
            // ]}
            />
            <BackButton className="my-5 text-adaptive-text" title="Назад" />
            {!isLoading &&
                <div className="m-10">
                    <AdvertViewer buttons={false} advert={advert} />
                </div>

            }

        </div>
    )
}

export default AdminAdvertPreview