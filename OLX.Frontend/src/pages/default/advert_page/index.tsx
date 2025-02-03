import { useParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import ImagesViewer from "../../../components/images_viewer";
import CategoryNavigation from "../../../components/category_navigation";
import AdvertParameters from "../../../components/advert_paramerets";



const AdvertPage: React.FC = () => {
    const { id } = useParams();
    const { data: advert, isLoading } = useGetAdvertByIdQuery(Number(id))


    return (
        <div className="w-full mx-[8vw] gap-[8vh] items-start flex mt-[6vh] flex-col">
            <CategoryNavigation categoryId={advert?.categoryId} />
            {!isLoading &&
                <>
                    <div className="flex gap-5 w-full">
                        <ImagesViewer
                            className="h-[85vh] w-[55%] gap-4"
                            advertImages={advert?.images || []}
                        />

                        <div>

                        </div>
                    </div>
                    <AdvertParameters
                        className="w-[66vw] self-center"
                        advertValues={advert?.filterValues || []} />
                </>
            }
        </div>
    )
};

export default AdvertPage;