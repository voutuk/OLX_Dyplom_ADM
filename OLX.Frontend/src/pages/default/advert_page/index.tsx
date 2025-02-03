import { useParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import ImagesViewer from "../../../components/images_viewer";
import CategoryNavigation from "../../../components/category_navigation";
import AdvertParameters from "../../../components/advert_paramerets";
import { Divider } from "antd";
import AdvertInfo from "../../../components/advert_info";
import AdvertViever from "../../../components/advert_viever";


const AdvertPage: React.FC = () => {
    const { id } = useParams();
    const { data: advert, isLoading } = useGetAdvertByIdQuery(Number(id))


    return (
        <div className="flex-1  gap-[8vh] flex flex-col my-[6vh]">
            <div className="mx-[8vw] gap-[8vh] items-start flex  flex-col">
                <CategoryNavigation categoryId={advert?.categoryId} />
                {!isLoading &&
                    <AdvertViever advert={advert}/>
                }
            </div>
            <Divider className="p-0 m-0" />
            <div className="h-[12vh] bg-slate-100 mx-[8vw] gap-[8vh] items-start flex  flex-col">

            </div>
        </div>

    )
};

export default AdvertPage;