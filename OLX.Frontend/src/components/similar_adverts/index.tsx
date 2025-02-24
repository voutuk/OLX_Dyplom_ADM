import { IAdvert } from "../../models/advert"
import { useGetAdvertPageQuery } from "../../redux/api/advertApi"
import ScrolledAdvertsSection from "../scrolled_adverts_section"

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
                <ScrolledAdvertsSection
                    title="Схожі оголошення"
                    adverts={adverts.items}
                    advertId={advert?.id}
                    className={className}
                    cardClassName="min-w-[20.5vw] max-w-[20.5vw]" />
            }
        </>
    )
}

export default SimilarAdverts