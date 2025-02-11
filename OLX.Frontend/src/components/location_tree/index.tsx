import React, { useState, useEffect } from "react";
import { TreeSelect, TreeSelectProps } from "antd";
import {
    useGetAreasQuery,
    useGetRegionsByAreaQuery,
    useGetSettlementsByRegionQuery,
} from "../../redux/api/newPostApi";

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
    region: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ onSelect }) => {
    const { data: areas } = useGetAreasQuery(undefined);
    const [treeData, setTreeData] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
    const [areaRef, setAreaRef] = useState<string | null>(null);
    const [regionRef, setRegionRef] = useState<string | null>(null);
    
    const { data: regions } = useGetRegionsByAreaQuery(areaRef, { skip: !areaRef });
    const { data: settlements } = useGetSettlementsByRegionQuery(regionRef, { skip: !regionRef });

    useEffect(() => {
        if (areas) {
            const formattedAreas = areas.map((area: Area) => ({
                id: area.ref,
                pId: null,
                title: `${area.description} ${area.regionType}`,
                value: area.ref,
                isLeaf: false,
            }));
            setTreeData(formattedAreas);
            console.log(treeData);
        }
    }, [areas]);

    useEffect(() => {
        if (regions) {
            const formattedRegions = regions.map((region: Region) => ({
                id: region.ref,
                pId: region.areaRef,
                title: `${region.description} ${region.regionType}`,
                value: region.ref,
                isLeaf: false,
            }));
            setTreeData((prevData) => [...prevData, ...formattedRegions]);
            console.log(treeData);
        }
    }, [regions]);

    useEffect(() => {
        if (settlements) {
            const formattedSettlements = settlements.map((settlement: Settlement) => ({
                id: settlement.ref,
                pId: settlement.region,
                title: settlement.description,
                value: settlement.ref,
                isLeaf: true,
            }));
            setTreeData((prevData) => [...prevData, ...formattedSettlements]);
            console.log(treeData);
        }
    }, [settlements]);

    const onLoadData: TreeSelectProps['loadData'] = ({ id }) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                if (areas?.some((area: Area) => area.ref === id)) {
                    setAreaRef(id);
                } else if (regions?.some((region: Region) => region.ref === id)) {
                    setRegionRef(id);
                }
                resolve(undefined);
            }, 300);
           
        });
    };

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        
        const selectedArea = areas?.find((a: Area) => a.ref === value);
        const selectedRegion = regions?.find((r: Region) => r.ref === value);
        const selectedSettlement = settlements?.find((s: Settlement) => s.ref === value);

        onSelect({
            areaRef: selectedArea?.ref || "",
            regionRef: selectedRegion?.ref || "",
            settlementRef: selectedSettlement?.ref || ""
        });
    };

    return (
        <TreeSelect
            treeDataSimpleMode
            style={{ width: "100%" }}
            value={selectedValue}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Уся Україна"
            treeData={treeData}
            loadData={onLoadData}
            onSelect={handleSelect}
        />
    );
};

export default LocationSelect;