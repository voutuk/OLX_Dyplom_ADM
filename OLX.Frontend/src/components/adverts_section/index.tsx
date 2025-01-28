import AdvertCard from "../advert_card"
import { AdvertsSectionProps } from "./props"


const AdvertsSection: React.FC<AdvertsSectionProps> = ({ title, adverts }) => {
  return (
    <div className="px-[150px] py-[100px]">
      <h2 className='text-[#3A211C] mb-[6vh] font-unbounded text-adaptive-login-header-text font-normal text-center'>{title}</h2>
      <div className="grid grid-cols-4 gap-y-[20px]">
        {adverts.map(advert => (
          <AdvertCard key={advert.id} id={advert.id} title={advert.title} image={advert.image} price={advert.price} settlement={advert.settlement} />
        ))}
      </div>
    </div>
  )
}

export default AdvertsSection