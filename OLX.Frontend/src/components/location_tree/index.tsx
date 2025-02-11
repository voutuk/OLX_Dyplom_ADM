import React, { useState, useMemo} from "react";
import { TreeSelect } from "antd";
import {
    useGetAreasQuery,
    useGetRegionsByAreaQuery,
    useGetSettlementsByRegionQuery,
} from "../../redux/api/newPostApi";


const { SHOW_PARENT } = TreeSelect;

interface LocationSelectProps {
    onSelect: (value: { regionRef: string; areaRef: string; settlementRef: string }) => void;
}

interface Area {
    description: string;
    regionType: string;
    ref: string;
}

interface Region {
    description: string;
    regionType: string;
    ref: string;
    areaRef: string;
}

interface Settlement {
    description: string;
    ref: string;
    regionRef: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ onSelect }) => {
    const [areaRef, setAreaRef] = useState(null);
    const [regionRef, setRegionRef] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);

    const { data: areas, isLoading: areasLoading } = useGetAreasQuery(undefined);
    const { data: regions, isFetching: regionsLoading } = useGetRegionsByAreaQuery(areaRef, { skip: !areaRef });
    const { data: settlements, isFetching: settlementsLoading } = useGetSettlementsByRegionQuery(regionRef, { skip: !regionRef });

    const treeData = useMemo(() => {
        return areas?.map((area: Area) => ({
            title: `${area.description} ${area.regionType}`,
            value: area.ref,
            key: area.ref,
            isLeaf: false,
            children: regions?.filter((r: Region) => r.areaRef === area.ref).map((region: Region) => ({
                title: `${region.description} ${region.regionType}`,
                value: region.ref,
                key: region.ref,
                isLeaf: false,
                children: settlements?.filter((s: Settlement) => s.regionRef === region.ref).map((settlement: Settlement) => ({
                    title: settlement.description,
                    value: settlement.ref,
                    key: settlement.ref,
                    isLeaf: true,
                })) || []
            })) || []
        })) || [];
    }, [areas, regions, settlements]);


    const handleSelect = (value: any) => {
        setSelectedValue(value);
        let area = null;
        let region = null;
        let settlement = null;

        if (areas?.some((a: Area) => a.ref === value)) {
            area = areas.find((a: Area) => a.ref === value);
            setAreaRef(area.ref);
            setRegionRef(null);
        } else if (regions?.some((r: Region) => r.ref === value)) {
            region = regions.find((r: Region) => r.ref === value);
            setRegionRef(region.ref);
        } else {
            settlement = settlements?.find((s: Settlement) => s.ref === value);
        }

        onSelect({
            areaRef: area?.ref || "",
            regionRef: region?.ref || "",
            settlementRef: settlement?.ref || ""
        });
    };

    const onLoadData = ({ key }: any) =>
        new Promise<void>((resolve) => {
            const area = areas?.find((a: Area) => a.ref === key);
            if (area) {
                setAreaRef(area.ref);
            }
            const region = regions?.find((r: Region) => r.ref === key);
            if (region) {
                setRegionRef(region.ref);
            }
            resolve();
        });

    return (
        <TreeSelect
            showSearch
            style={{ width: "100%" }}
            value={selectedValue}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Оберіть населений пункт"
            treeDefaultExpandAll
            treeData={treeData}
            onSelect={handleSelect}
            loading={areasLoading || regionsLoading || settlementsLoading}
            allowClear
            treeCheckable={false}
            showCheckedStrategy={SHOW_PARENT}
            loadData={onLoadData}
        />
    );
};

export default LocationSelect;
