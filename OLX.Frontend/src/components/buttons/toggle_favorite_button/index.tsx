import React, { useEffect, useState } from "react"
import { ToggleFavoriteButtonProps } from "./props"
import { useNavigate } from "react-router-dom"
import { useAddToFavoritesMutation, useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "../../../redux/api/accountAuthApi";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/slices/userSlice";

const ToggleFavoriteButton: React.FC<ToggleFavoriteButtonProps> = ({ className, advertId }) => {
    const navigate = useNavigate();
    const { data: favorites } = useGetFavoritesQuery();
    const [addToFavorites] = useAddToFavoritesMutation();
    const [removeFromFavorites] = useRemoveFromFavoritesMutation();
    const user = useSelector(getUser)

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (user && favorites) {
            setIsFavorite(favorites.some(fav => fav.id == advertId));
        }
    }, [favorites, advertId]);

    const toggleButton = async () => {
        if (user == null) {
            navigate("/auth");
            return;
        }

        if (isFavorite) {
            await removeFromFavorites(advertId);
        } else {
            await addToFavorites(advertId);
        }
    }
    return (
        <div className="items">
            {isFavorite ?
                <svg onClick={toggleButton} className={`w-[50px] h-[50px] cursor-pointer ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 3H7C5.9 3 5.01 3.9 5.01 5L5 21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" fill="white" />
                </svg>
                :
                <svg onClick={toggleButton} className={`w-[50px] h-[50px] cursor-pointer ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z" fill="white" />
                </svg>
            }
        </div>
    )
}

export default ToggleFavoriteButton