import { Tabs, TabsProps } from "antd";
import './style.scss'



const UserProfile: React.FC = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <h5 className="ml-[8vw] font-montserrat text-adaptive-card-price-text" >Мої оголошення</h5>,
            children: <div className="mx-[8vw] h-[300px] bg-slate-50">Мої оголошення</div>
        },
        {
            key: '2',
            label:<h5 className="ml-[.5vw] font-montserrat text-adaptive-card-price-text" >Відгуки</h5>,
            children:<div className="mx-[8vw] h-[300px] bg-slate-100">Відгуки</div>,
        },
        {
            key: '3',
            label: <h5 className="ml-[.51vw] font-montserrat text-adaptive-card-price-text" >Неактивні оголошення</h5>,
            children: <div className="mx-[8vw] h-[300px] bg-slate-200">Неактивні оголошення</div>,
        },
    ];
    return (
        <div className="w-[100%] gap-[8vh]  flex flex-col my-[6vh]">
            <div className="bg-blue-50 mx-[8vw] h-[36.5vh] ">

            </div>
            <Tabs
                className="profile-tabs hover:text-black"
                defaultActiveKey="1"
                indicator={{ size: 0 }}
                items={items} />
        </div>
    )
}

export default UserProfile