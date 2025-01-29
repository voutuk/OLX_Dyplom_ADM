import { APP_ENV } from "../../constants/env"
import AdvertCard from "../advert_card"
import { AdvertsSectionProps } from "./props"


const AdvertsSection: React.FC<AdvertsSectionProps> = ({ title, adverts }) => {
  return (
    <div>
      <h2 className='text-[#3A211C] mb-[6vh] font-unbounded text-adaptive-login-header-text font-normal text-center'>{title}</h2>
      <div className="flex justify-center flex-wrap gap-y-[20px] gap-x-[10px]">
        {adverts?.map(advert => (
          <AdvertCard key={advert.id} id={advert.id} title={advert.title} image={APP_ENV.IMAGES_400_URL + advert.images[0].name} price={advert.price} settlement={advert.settlementRef} />
        ))}
      </div>
    </div>
  )
}

export default AdvertsSection