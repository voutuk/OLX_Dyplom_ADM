import { useMemo } from "react"
import ScrolledContainer from "../scrolled_container"
import AdvertCard from "../advert_card"
import { APP_ENV } from "../../constants/env"
import { IAdvert } from "../../models/advert"

const CompletedAdverts: React.FC<{adverts:IAdvert[]}> = ({adverts}) => {
     const advertsCards = useMemo(() => adverts?.map(advert => (
        <AdvertCard
            key={advert.id}
            id={advert.id}
            title={advert.title}
            image={APP_ENV.IMAGES_400_URL + advert.images.find(img => img.priority === 0)?.name}
            price={advert.price}
            settlement={advert.settlementName}
            isEditable={true}
            className="min-w-[14vw] max-w-[14vw]"
        />
    )) || [], [adverts])

    return (
        <>
            {adverts && adverts.length > 0 ?
                <div className="my-[4vh] mx-[8vw]">
                    <ScrolledContainer>
                        <div className="flex gap-[1vw]">
                            {...advertsCards}
                        </div>
                    </ScrolledContainer>
                </div>
                :
                <div className="w-[100%] py-[6vh] px-[8vw] h-[300px] flex-col justify-start items-center inline-flex">
                    <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]">Не активні оголошення відображаються тут після закінчення їх терміну дії</p>
                    <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Ці оголошення можна завантажити знову</p>
                </div>
            }
        </>
    )
}

export default CompletedAdverts