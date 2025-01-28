import { AdvertCardProps } from "./props"
import { useNavigate } from "react-router-dom";

const AdvertCard: React.FC<AdvertCardProps> = ({ id, image, title, price, settlement }) => {
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uk-UA').format(price);
    };

    return (
        <div className="w-[388px] h-[583px] rounded-bl-lg rounded-br-lg border border-[#9b7a5b]/20 p-0 relative">
            <svg onClick={() => {}} className="w-[50px] h-[50px] absolute right-[0px] top-[6px] cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z" fill="white" />
            </svg>
            <img className="self-stretch w-[100%] h-[400px]" src={image} />
            <div className="p-2.5 mb-[16px] mt-[16px] cursor-pointer" onClick={() => {navigate(`/adverts/${id}`)}}>
                <h4 className="font-unbounded text-[#3a211c] text-2xl font-medium mb-[10px] hover:underline truncate">{title}</h4>
                <p className="text-[#3a211c] text-xl font-medium font-montserrat">{formatPrice(price)} грн</p>
            </div>
            <div className="px-2.5 pt-6 pb-2.5 text-[#9b7a5b] flex items-center justify-start gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 11.88 14.12 16.19 12 18.88C9.92 16.21 7 11.85 7 9Z" fill="#9B7A5B" />
                    <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="#9B7A5B" />
                </svg>
                <p className="text-xl font-normal font-montserrat">{settlement}</p>
            </div>
        </div>
    )
}

export default AdvertCard