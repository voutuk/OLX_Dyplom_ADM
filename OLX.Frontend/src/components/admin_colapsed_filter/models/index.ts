import { IFilter } from "../../../models/filter"

export interface AdminFilterResultModel {
    filters: number[]
    categoryIds: number[]
}


export interface FilterData {
    filters: IFilter[]
    filtersValues:number[]
    filterWidth: number
    isFilterClear:boolean
}
