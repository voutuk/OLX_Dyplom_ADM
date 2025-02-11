import { BackButton } from "../../../components/buttons/back_button"
import UploadWithDnd from "../../../components/image_upload"



const CreateAdvert: React.FC = () => {


    return (
        <div className="flex flex-1 flex-col gap-[5vh]">
            <div className="mx-[8vw] flex flex-1 items-start flex-col  gap-[5vh]">
            <BackButton className="text-adaptive-1_9_text ml-[1vw] font-medium mt-[7.9vh]" title="Назад"/>
            <h1 className=" mt-[7vh] font-unbounded text-adaptive-3_35-text">Створити оголошення</h1>
            <div className="flex flex-col  gap-[2.7vh] ">
                <div className="flex flex-col gap-[1vh]">
                    <span className="font-unbounded font-medium text-adaptive-1_7-text">Додати фото</span>
                    <span className="font-montserrat  text-adaptive-1_7-text">Перше фото буде на обкладинці оголошення. Перетягніть, щоб змінити порядок фото.</span>
                </div>
                <UploadWithDnd maxCount={15}  className="gap-[2.1%] w-[58vw]"/>
            </div>
            </div>
            
           
        </div>)
}

export default CreateAdvert