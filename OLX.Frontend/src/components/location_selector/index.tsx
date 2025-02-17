import { TreeSelect, TreeSelectProps } from "antd"
import { IArea, IRegion, ISettlement } from "../../models/newPost";
import { useGetAreasQuery, useGetRegionsByAreaQuery, useGetSettlementsByIdQuery, useGetSettlementsByRegionQuery } from "../../redux/api/newPostApi";
import { useEffect, useMemo, useState } from "react";

interface LocationSelectorProps {
    value?: string | undefined
    onChange?: () => void
    placeholder?:string
    width?:string
    height?:string
}


const LocationSelector: React.FC<LocationSelectorProps> = ({ value, width,height,placeholder, onChange = () => { } }) => {
   
    const { data: settlement } = useGetSettlementsByIdQuery(value || '', { skip: !value })
    const [areaRef, setAreaRef] = useState<any>()
    const [regionRef, setRegionRef] = useState<any>()
    const [locationTreeData, setLocationTreeData] = useState<any[]>([])
    const { data: areas, isLoading: isAreasLoading } = useGetAreasQuery();
    const { data: regions, isLoading: isRegionsLoading } = useGetRegionsByAreaQuery(areaRef, { skip: !areaRef });
    const { data: settlements, isLoading: isSettlementsLoading } = useGetSettlementsByRegionQuery(regionRef, { skip: !regionRef });


    useEffect(() => {
        setAreaRef(settlement?.area)
        setRegionRef(settlement?.region)
    }, [settlement])

    const formattedAreas = useMemo(() => areas ? areas.map((area: IArea) => ({
        id: area.ref,
        disabled: true,
        pId: null,
        title: `${area.description} ${area.regionType}`,
        value: area.ref,
        isLeaf: false,
    })) : [], [areas])

    const formattedRegions = useMemo(() => regions ? regions.map((region: IRegion) => ({
        id: region.ref,
        disabled: true,
        pId: region.areaRef,
        title: `${region.description} ${region.regionType}`,
        value: region.ref,
        isLeaf: false,
    })) : [], [regions]);

    const formattedSettlements = useMemo(() => settlements ? settlements.map((settlement: ISettlement) => ({
        id: settlement.ref,
        pId: settlement.region,
        title: settlement.description,
        value: settlement.ref,
        isLeaf: true,
    })) : [], [settlements])

    useEffect(() => {
        setLocationTreeData([...locationTreeData, ...formattedAreas, ...formattedRegions, ...formattedSettlements]);
    }, [areas, settlements, regions]);

    const onLoadData: TreeSelectProps['loadData'] = ({ id }) => {
        return new Promise<void>((resolve) => {
            if (areas?.some((area: IArea) => area.ref === id)) {
                setAreaRef(id);
            } else if (regions?.some((region: IRegion) => region.ref === id)) {
                setRegionRef(id);
            }
            resolve(undefined);
        });
    };


    return (

        <TreeSelect
            value={value}
            treeDataSimpleMode
            popupClassName="create-advert-select-popup"
            allowClear
            showSearch
            loading={isAreasLoading || isRegionsLoading || isSettlementsLoading}
            style={{ height: height, width: width }}
            className="create-advert-select"
            treeData={locationTreeData}
            placeholder={placeholder}
            loadData={onLoadData}
            onChange={onChange}
        />

    )
}

export default LocationSelector