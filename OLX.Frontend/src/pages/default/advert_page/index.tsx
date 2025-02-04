import { useParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import CategoryNavigation from "../../../components/category_navigation";
import { Divider } from "antd";
import AdvertViewer from "../../../components/advert_viewer";
import SimilarAdverts from "../../../components/similar_adverts";


const AdvertPage: React.FC = () => {
    const { id } = useParams();
    const { data: advert, isLoading } = useGetAdvertByIdQuery(Number(id))
      
      
    return (
        <div className="w-[100vw] gap-[8vh] flex flex-col my-[6vh]">
            <div className="mx-[8vw] gap-[8vh] items-start flex  flex-col">
                <CategoryNavigation  categoryId={advert?.categoryId} />
                {!isLoading &&
                    <AdvertViewer advert={advert} />
                }
            </div>
            <Divider className="p-0 m-0" />
            <div className=" mx-[7.5vw] gap-[8vh] items-start flex flex-col">
                <SimilarAdverts advert={advert} />

            </div>
        </div>

    )
};

export default AdvertPage;