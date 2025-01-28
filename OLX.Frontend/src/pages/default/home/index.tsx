import { AdvertCardProps } from '../../../components/advert_card/props';
import AdvertsSection from '../../../components/adverts_section';
import HomePageImageBlock from '../../../components/home_page_image';
import PrimaryButton from '../../../components/primary_button';
import './style.scss'


const HomePage: React.FC = () => {
  const adverts: AdvertCardProps[] = [
    {
      id: 1,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    },
    {
      id: 2,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    },
    {
      id: 3,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    },
    {
      id: 4,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    },
    {
      id: 5,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    },
    {
      id: 6,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    },
    {
      id: 7,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    },
    {
      id: 8,
      title: 'Мальтіпу',
      image: 'src/assets/images/image.png',
      price: 40000,
      settlement: 'Київ'
    }
  ];

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