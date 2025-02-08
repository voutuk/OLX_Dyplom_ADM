import { IFilterValue } from "./filter";
import { IShortOlxUser, PageRequest } from "./user";

export interface IAdvert{
    id: number,
    userId: number,
    user:IShortOlxUser | undefined,
    phoneNumber: string,
    contactEmail: string,
    contactPersone: string,
    date: Date,
    title: string,
    description: string,
    isContractPrice: boolean,
    price: number,
    categoryId: number,
    settlementName: string,
    filterValues: IFilterValue[],
    images: IAdvertImage[]
}

export interface IAdvertPageRequest extends IAdvertPageData{
       categoryIds?: number[]
}

export interface IAdvertSearchPageData extends IAdvertPageData{
    categoryId?: number
}

export interface IAdvertPageData extends PageRequest{
    priceFrom: number,
    priceTo: number,
    search?: string,
    categorySearch?:string,
    phoneSearch?:string,
    emailSearch?:string,
    settlementSearch?:string,
    isContractPrice?: boolean,
    approved?: boolean,
    blocked?: boolean,
    archived?: boolean,
    filters?: number[][]
}

export interface IAdvertCreationModel {
    id: number,
    userId: number,
    phoneNumber: string,
    contactEmail: string,
    title: string,
    description: string,
    isContractPrice: boolean,
    settlementRef: string,
    price: number,
    categoryId: number,
    filterValueIds: number[],
    imageFiles: File[]
}

export interface IAdvertImage{
    id: number,
    name: string,
    advertId: number,
    priority: number
}