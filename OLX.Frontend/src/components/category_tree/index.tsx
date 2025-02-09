import { Tree } from "antd"
import { Key, useEffect, useMemo, useState } from "react"
import { buildTree, getAllParentsIds } from "../../utilities/common_funct"
import { CategoryTreeProps } from "./props"


const CategoryTree: React.FC<CategoryTreeProps> = ({ categoryId, categories, onSelect, className }) => {

    const [expandedCategories, setExpandedCategories] = useState<Key[]>([])
    const categoryTree = useMemo(() => buildTree(categories || []), [categories])
    const allParentsIds = useMemo(() => getAllParentsIds(categories || [], categoryId) as Key[], [categories, categoryId])
    useEffect(() => {
        if (categoryId) {
            setExpandedCategories(allParentsIds);
        }
    }, [categoryId]);
    return (
        <Tree
            onExpand={(keys) => setExpandedCategories(keys)}
            expandedKeys={expandedCategories}
            selectedKeys={[categoryId as Key]}
            onSelect={(element) => {
                if (element[0] && onSelect) {
                    onSelect(element[0] as number)
                }
            }}
            treeData={categoryTree}
            className={className} />
    )
}

export default CategoryTree