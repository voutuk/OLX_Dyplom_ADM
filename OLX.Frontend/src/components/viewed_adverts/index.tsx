import { APP_ENV } from '../../constants/env';
import { IAdvert } from '../../models/advert';
import ScrolledAdvertsSection from '../scrolled_adverts_section';

interface ViewedAdvertsProps {
    advert: IAdvert | undefined,
    className?: string
}

const ViewedAdverts : React.FC<ViewedAdvertsProps> = ({advert, className}) => {
    const adverts : IAdvert[] = sessionStorage.getItem(APP_ENV.VIEWED_KEY) ? JSON.parse(sessionStorage.getItem(APP_ENV.VIEWED_KEY) as string) : null;
    return (
        <>
            {adverts && adverts.length > 0 && 
            <ScrolledAdvertsSection title='Нещодавно переглянуті' adverts={adverts} advertId={advert?.id} className={className} />}
        </>

    )
}

export default ViewedAdverts