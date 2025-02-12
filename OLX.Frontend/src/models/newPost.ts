export interface IArea {
    description: string;
    regionType: string;
    ref: string;
}

export interface IRegion {
    description: string;
    regionType: string;
    ref: string;
    areaRef: string;
}

export interface ISettlement {
    description: string;
    ref: string;
    region: string;
}