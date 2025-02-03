import { useParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import ImagesViewer from "../../../components/images_viewer";
import CategoryNavigation from "../../../components/category_navigation";
import AdvertParameters from "../../../components/advert_paramerets";
import { Divider } from "antd";
import ToggleFavoriteButton from "../../../components/buttons/toggle_favorite_button";


const AdvertPage: React.FC = () => {
    const { id } = useParams();
    const { data: advert, isLoading } = useGetAdvertByIdQuery(Number(id))


    return (
        <div className="flex-1  gap-[8vh] flex flex-col my-[6vh]">
            <div className="mx-[8vw] gap-[8vh] items-start flex  flex-col">
                <CategoryNavigation categoryId={advert?.categoryId} />
                {!isLoading &&
                    <>
                        <div className="flex gap-5 w-full">
                            <ImagesViewer
                                className="h-[93vh] w-[55%] 1 gap-4"
                                advertImages={advert?.images || []}
                            />

                            <div className=" flex flex-1 flex-col gap-[2vh]">
                                <div className="flex  justify-between">
                                    <div className="flex  flex-col gap-[2vh]">
                                      <span>{advert?.price}</span>
                                      <span>{advert?.title}</span>
                                    </div>
                                    <ToggleFavoriteButton
                                        advertId={advert?.id || 0}
                                        isAdvertPage />
                                </div>
                            </div>
                        </div>
                        <AdvertParameters
                            className="w-[66vw] self-center"
                            advertValues={advert?.filterValues || []} />
                    </>
                }

            </div>
            <Divider className="p-0 m-0" />
            <div className="h-[12vh] bg-slate-100 mx-[8vw] gap-[8vh] items-start flex  flex-col">

            </div>
        </div>

    )
};

export default AdvertPage;