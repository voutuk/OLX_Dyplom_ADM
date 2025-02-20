import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../constants/env";
import AdvertCard from "../../../components/advert_card";
import { useGetFavoritesQuery } from "../../../redux/api/accountAuthApi";
import PrimaryButton from "../../../components/buttons/primary_button";
import { BackButton } from "../../../components/buttons/back_button";

const FavoritesAdverts = () => {
    const { data: favorites } = useGetFavoritesQuery();
    const navigate = useNavigate();

    const advertsCards = useMemo(() => favorites?.map(advert => (
        <AdvertCard
            key={advert.id}
            id={advert.id}
            title={advert.title}
            image={APP_ENV.IMAGES_400_URL + advert.images.find(img => img.priority === 0)?.name}
            price={advert.price}
            settlement={advert.settlementName}
        />
    )) || [], [favorites])

    return (
        <div className="w-[100%] my-[8vh]">
            <BackButton title="Назад" className="mb-[12vh] ml-[9vw] text-adaptive-1_9_text font-medium self-start" />
            <h2 className='text-[#3A211C] font-unbounded text-adaptive-3_5-text font-normal  ml-[8vw]'>Обране</h2>
            {favorites && favorites.length > 0 ?
                <div className='grid grid-cols-4 gap-y-[2.5vh]  gap-x-[2.5vh] my-[6vh] mx-[8vw]'>
                    {...advertsCards}
                </div>
                :
                <div className="w-[100%] py-[10vh] px-[8vw] h-[400px] flex-col justify-start items-center inline-flex">
                    <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]">Тут поки нічого немає</p>
                    <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Додайте декілька оголошень до обраного</p>
                    <PrimaryButton onButtonClick={() => { navigate(`/`) }} className="w-[16.4vw] h-[4.8vh]" title="На головну" brColor="#9B7A5B" bgColor="#9B7A5B" fontColor="white" fontSize="clamp(14px,1.9vh,36px)" isLoading={false} />
                </div>
            }
        </div>
    )
}

export default FavoritesAdverts