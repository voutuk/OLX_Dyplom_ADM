import { IAdvert } from "../../../models/advert";
import { AdvertCardProps } from "../../advert_card/props";

export interface AdvertsSectionProps{
    title: string,
    adverts?: IAdvert[]
}