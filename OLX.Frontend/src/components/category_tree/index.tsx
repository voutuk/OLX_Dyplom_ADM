import { Tree } from "antd"
import { Key, useCallback, useEffect, useState } from "react"
import { buildTree, getAllParentsIds } from "../../utilities/common_funct"
import { ICategory } from "../../models/category"
interface CategoryTreeProps {
    categoryId?: number,
    categories?: ICategory[]
    onSelect?: (id: number) => void
    className?: string
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ categoryId, categories, onSelect, className }) => {

    const [expandedCategories, setExpandedCategories] = useState<Key[]>([])
    const buildCategoryTree = useCallback(() => buildTree(categories || []), [categories])
    useEffect(() => {
        console.log(categoryId)
        if (categoryId) {
            setExpandedCategories(getAllParentsIds(categories || [], categoryId) as Key[]);
        }
    }, [categoryId]);
    return (
        <Tree
            onExpand={(keys) => setExpandedCategories(keys)}
            expandedKeys={expandedCategories ? expandedCategories : []}
            selectedKeys={[categoryId as Key]}
            onSelect={(element) => {
                if (element[0] && onSelect) {
                    onSelect(element[0] as number)
                }
            }}
            treeData={buildCategoryTree()}
            className={className} />
    )
}

export default CategoryTree