import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi"
import PrimaryButton from "../buttons/primary_button";
import { useMemo } from "react";

const CategoriesSection = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const navigate = useNavigate();

  const categoryButtons = useMemo(() => categories?.filter(i => i.id != 4).slice(0, 9).map((category, index) => (
    <PrimaryButton
      onButtonClick={() => { navigate(`/adverts?categoryId=${category.id}`) }}
      key={category.id}
      title={category.name}
      isLoading={false}
      bgColor="transparent"
      brColor="#9B7A5B"
      fontColor="black"
      className={`mb-[5vh] w-[13vw] h-[5vh] ${(index + 1) % 2 === 0 ? "mx-[4vw]" : ""}`} />
  )) || [], [categories])


  return (
    <div className="my-[40px]">
      <h2 className='text-[#3A211C] mb-[6vh] font-unbounded text-adaptive-login-header-text font-normal text-center'>Популярні категорії</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {...categoryButtons}
      </div>
    </div>
  )
}

export default CategoriesSection