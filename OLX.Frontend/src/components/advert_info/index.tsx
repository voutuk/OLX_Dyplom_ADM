import { formatPrice } from "../../utilities/common_funct"
import PrimaryButton from "../buttons/primary_button"
import ToggleFavoriteButton from "../buttons/toggle_favorite_button"
import UserInfo from "../user_info"
import UserRating from "../user_rating"
import { IAdvertInfoProps } from "./props"


const AdvertInfo: React.FC<IAdvertInfoProps> = ({ advert, buttons = true }) => {
    return (
        <div className=" flex flex-1 flex-col justify-between gap-[8vh]">
            <div className=" flex flex-col gap-[8vh]">
                <div className="flex  justify-between">
                    <div className="flex  flex-col gap-[3vh]">
                        <span className="font-unbounded text-adaptive-advert-page-price-text font-medium">{formatPrice(advert?.price || 0)} грн.</span>
                        <span className="font-unbounded text-adaptive-card-price-text font-medium">{advert?.title}</span>
                    </div>
                    {buttons &&
                        <ToggleFavoriteButton
                            advertId={advert?.id || 0}
                            isAdvertPage />
                    }
                </div>
                <div className="flex flex-col w-[28vw] gap-[1vh]">
                    <span className="font-unbounded text-adaptive-card-price-text font-medium">Опис</span>
                    <span className="font-montserrat text-adaptive-card-price-text ">{advert?.description}</span>
                </div>
            </div>
            <div className=" flex flex-col gap-[6vh]">
                {buttons &&
                    <div className="flex flex-col gap-[2.4vh]">
                        <PrimaryButton
                            title={"Купити зараз"}
                            bgColor="#9B7A5B"
                            fontColor="white"
                            fontSize="clamp(14px, 2.1vh, 36px)"
                            isLoading={false}
                            className="h-[4.6vh] w-[22vw] " />
                        <PrimaryButton
                            title={"Написати продавцю"}
                            isLoading={false}
                            bgColor="transparent"
                            fontColor="#3A211C"
                            brColor="#9B7A5B"
                            fontSize="clamp(14px, 2.1vh, 36px)"
                            className="h-[4.6vh] w-[22vw] border-2" />
                    </div>
                }
                <div className="flex flex-col gap-[3vh] w-[22vw]">
                    <UserRating user={advert?.user} />
                    <UserInfo user={advert?.user} />
                </div>
            </div>
        </div>
    )
}

export default AdvertInfo