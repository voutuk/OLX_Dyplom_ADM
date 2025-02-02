import { useEffect, useState } from "react";
import { APP_ENV } from "../../constants/env"
import { IAdvertImage } from "../../models/advert"
import ScrolledContainer from "../scrolled_container"
import { Image } from "antd";

interface ImageViewerProps {
    className?: string
    advertImages: IAdvertImage[]
}

const ImagesViewer: React.FC<ImageViewerProps> = ({ className, advertImages }) => {
    const [currentImage, setCurrentImage] = useState<string>()
    const [images, setImages] = useState<string[]>([])
    useEffect(() => {
        const images = advertImages.slice().sort((a, b) => a.position - b.position).map(x => x.name) || [];
        setImages(images)
        setCurrentImage(images[0])
    }, [])
    return (
        <div className={`${className} flex gap-4`}>
            <ScrolledContainer
                scrollDir="vertical"
                className="h-[100%] w-[18%]"
            >
                <div className="flex flex-col gap-[3.5vh]">
                    {images.map((image, index) => (
                        <img key={index}
                            className={`${image === currentImage ? 'border-2 border-red-600' : ''}  aspect-[16/19] flex-shrink-0 object-cover`}
                            src={APP_ENV.IMAGES_200_URL + image}
                            onClick={() => { setCurrentImage(images[index]) }} />

                    ))}
                </div>
            </ScrolledContainer>
            <div className="flex-1 bg-slate-400">
                <Image.PreviewGroup
                    items={images.map(x => APP_ENV.IMAGES_1200_URL + x)}>
                    <Image className="self-center object-cover" height={'100%'} src={APP_ENV.IMAGES_1200_URL + currentImage} />
                </Image.PreviewGroup>
            </div>
        </div>
    )
}
export default ImagesViewer