import { Breadcrumb } from "antd"
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi"
import { BackButton } from "../buttons/back_button"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getAllParents } from "../../utilities/common_funct"
import { CategoryNavigationProps } from "./props"
import './style.scss'


const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ categoryId }) => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery()
    const [items,setItems] = useState<any>([])
    
    useEffect(()=>{
        const tree  = getAllParents(categories || [] ,categoryId)
        const newItems = tree.reverse().map(x=>({
            title:<Link style={{color:'#3A211C'}} className=" breadcrumb-link" to={`/adverts?categoryId=${x.id}`}>{x.name}</Link>,
        }))
        setItems([{ title: <Link style={{color:'#3A211C'}} className=" breadcrumb-link" to="/">Головна</Link> },...newItems])
    },[categories,categoryId])
    return (
        <div className="flex gap-20 items-center">
            <BackButton
                title="Назад"
                className="text-adaptive-1_9_text text-black font-medium " />
            {!isLoading &&
                <Breadcrumb
                    separator={<span className="text-adaptive-1_8_text font-montserrat text-['#3A211C']">/</span>}
                    items={items}
                     />}
        </div>)
}

export default CategoryNavigation