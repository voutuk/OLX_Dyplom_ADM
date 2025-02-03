import { useEffect, useState } from "react";
import { APP_ENV } from "../../constants/env"
import ScrolledContainer from "../scrolled_container"
import { Image } from "antd";
import { ImageViewerProps } from "./props";
import { ImageViewerDataModel } from "./models";

const ImagesViewer: React.FC<ImageViewerProps> = ({ className, advertImages }) => {
    const [imagesData, setImagesData] = useState<ImageViewerDataModel>({
        currentImage: '',
        images: []
    })
    useEffect(() => {
        if(advertImages.length>0){
            const images = advertImages.slice().sort((a, b) => a.priority - b.priority).map(x => x.name) || [];
            setImagesData({ images: images, currentImage: images[0] })
        }
    }, [advertImages])
    return (
        <>
            {imagesData.images.length > 0 &&
                <div className={`${className} flex gap-4`}>
                    <ScrolledContainer
                        scrollDir="vertical"
                        className="h-[100%] w-[18%]"
                    >
                        <div className="flex flex-col gap-[3.5vh]">
                            {imagesData.images.map((image, index) => (
                                <img key={index}
                                    className={`${image === imagesData.currentImage ? 'border-2 border-red-600' : ''}  aspect-[16/19] flex-shrink-0 object-cover`}
                                    src={APP_ENV.IMAGES_200_URL + image}
                                    onMouseDown={() => { setImagesData({ ...imagesData, currentImage: image }) }} />

                            ))}
                        </div>
                    </ScrolledContainer>
                    <div className="flex-1 bg-slate-400">
                        <Image.PreviewGroup
                            items={imagesData.images.map(x => APP_ENV.IMAGES_1200_URL + x)}>
                            <Image className="self-center object-cover" height={'100%'} src={APP_ENV.IMAGES_1200_URL + imagesData.currentImage} />
                        </Image.PreviewGroup>
                    </div>
                </div>
            }
        </>
    )
}
export default ImagesViewer