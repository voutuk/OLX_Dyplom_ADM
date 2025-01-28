import AdvertsSection from '../../../components/adverts_section';
import HomePageImageBlock from '../../../components/home_page_image';
import './style.scss'


const HomePage: React.FC = () => {

  return (
    <div className="flex-1 flex flex-col justify-center">
      <HomePageImageBlock />
      <AdvertsSection title='Рекомендовані оголошення' adverts={[]} />
    </div>
  );
};

export default HomePage;