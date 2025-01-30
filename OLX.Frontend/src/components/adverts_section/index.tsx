import { APP_ENV } from "../../constants/env"
import AdvertCard from "../advert_card"
import { AdvertsSectionProps } from "./props"

const AdvertsSection: React.FC<AdvertsSectionProps> = ({ title, adverts, isLoading }) => {
  return (
    <div>
      <h2 className='text-[#3A211C] mb-[6vh] font-unbounded text-adaptive-login-header-text font-normal text-center'>{title}</h2>
      <div className="flex justify-center flex-wrap gap-y-[20px] gap-x-[10px]">
        {isLoading ?
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500"></div>
          </div>
          :
          adverts?.map(advert => (
            <AdvertCard key={advert.id} id={advert.id} title={advert.title} image={APP_ENV.IMAGES_400_URL + advert.images[0].name} price={advert.price} settlement={advert.settlementName} />
          ))}
      </div>
    </div>
  )
}

export default AdvertsSection