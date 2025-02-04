import { APP_ENV } from "../../constants/env"
import { IAdvert } from "../../models/advert"
import { useGetAdvertPageQuery } from "../../redux/api/advertApi"
import AdvertCard from "../advert_card"
import ScrolledContainer from "../scrolled_container"

interface SimilarAdvertsProps {
    advert: IAdvert | undefined,
    className?: string
}

const SimilarAdverts: React.FC<SimilarAdvertsProps> = ({ advert, className }) => {
    const { data: adverts, isLoading: isAdvertsLoading } = useGetAdvertPageQuery({
        page: 1,
        size: 15,
        sortKey: "date",
        isDescending: true,
        priceFrom: 0,
        priceTo: 0,
        approved: true,
        blocked: false,
       // categoryIds: [advert?.categoryId || 0],
       // filters: advert?.filterValues.map(x => x.id) || []
    })
    
    return (
        <>
            {!isAdvertsLoading && adverts && adverts?.items.length > 1 &&
                <div className={`flex w-[100%] flex-col gap-[4vh] ${className}`}>
                    <span className="font-unbounded font-medium text-adaptive-card-price-text">Схожі оголошення</span>
                    <ScrolledContainer>
                        <div className="flex gap-[1vw]">
                            {adverts?.items?.filter(x=>x.id !== advert?.id).map(x => (
                                <AdvertCard
                                    key={x.id}
                                    id={x.id}
                                    title={x.title}
                                    image={APP_ENV.IMAGES_400_URL + x.images.find(x => x.priority === 0)?.name}
                                    price={x.price}
                                    settlement={x.settlementName} />
                            ))}
                        </div>
                    </ScrolledContainer>
                </div>
            }
        </>
    )
}

export default SimilarAdverts