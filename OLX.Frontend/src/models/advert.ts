import { IFilterValue } from "./filter";
import { PageRequest } from "./user";

export interface IAdvert{
    id: number,
    userId: number,
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

export interface IAdvertPageRequest extends PageRequest{
    priceFrom: number,
    priceTo: number,
    search?: string,
    categorySearch?:string,
    phoneSearch?:string,
    emailSearch?:string,
    settlementSearch?:string,
    isContractPrice: boolean,
    approved: boolean,
    blocked: boolean,
    archived: boolean,
    categoryIds?: number[],
    filters?: number[]
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
    position: number
}