import { IFilter } from "../../../models/filter"

export interface AdminFilterResultModel {
    filters: number[]
    categoryId: number | undefined
}


export interface FilterData {
    filters: IFilter[]
    filterWidth: number
}
