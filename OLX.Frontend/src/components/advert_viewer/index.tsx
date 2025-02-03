import AdvertInfo from "../advert_info";
import AdvertParameters from "../advert_paramerets";
import ImagesViewer from "../images_viewer";
import { IAdvertViewerProps } from "./props";

const AdvertViewer: React.FC<IAdvertViewerProps> = ({ advert }) => {
    return (
        <div className=" gap-[8vh] items-start flex  flex-col">
            <div className="flex gap-[3vw] w-full">
                <ImagesViewer
                    className="h-[93vh] w-[55%] gap-4"
                    advertImages={advert?.images || []}
                />
                <AdvertInfo advert={advert} />
            </div>
            <AdvertParameters
                className="w-[66vw] self-center"
                advertValues={advert?.filterValues || []} />
        </div>
    )
}

export default AdvertViewer