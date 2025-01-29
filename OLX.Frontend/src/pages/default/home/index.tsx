import AdvertsSection from '../../../components/adverts_section';
import HomePageImageBlock from '../../../components/home_page_image';
import PrimaryButton from '../../../components/primary_button';
import { useGetAllAdvertsQuery } from '../../../redux/api/advertApi';
import './style.scss'


const HomePage: React.FC = () => {
  const {data: adverts, isLoading: isAdvertsLoading} = useGetAllAdvertsQuery();
  
  if (isAdvertsLoading) return <p>Loading...</p>;

  return (
    <div className="flex-1 flex flex-col justify-center">
      <HomePageImageBlock />
      <div className='flex flex-col items-center px-[50px] py-[50px] gap-[50px]'>
        <AdvertsSection title='Рекомендовані оголошення' adverts={adverts} />
        <PrimaryButton title='Завантажити більше' disabled={false} isLoading={false} className='w-[420px] h-[60px] p-[8px]' bgColor='#9B7A5B' fontColor='white' brColor='#9B7A5B' />
      </div>
    </div>
  );
};

export default HomePage;