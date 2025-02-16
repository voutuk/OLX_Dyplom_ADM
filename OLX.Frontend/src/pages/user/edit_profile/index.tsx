import { Tabs } from "antd";
import './style.scss'

const UserProfileEdit: React.FC = () => {

    const items = [
        { key: "1", label: "Основна інформація", children: <div className="w-full h-[500px] bg-slate-400"> Основна інформація</div> },
        { key: "2", label: "Історія платежів", children: <div className="w-full h-[500px] bg-slate-400"> Історія платежів</div> },
        { key: "3", label: "Налаштування конфіденційності", children: <div className="w-full h-[500px] bg-slate-400"> Налаштування конфіденційності</div> },
    ];
    return (
        <div className="w-[100%] gap-[5vh] mx-[8vw]   flex flex-col my-[22vh]">
            <h1 className="font-unbounded text-adaptive-3_35-text">Мої налаштування</h1>
            <Tabs
                className="w-full font-montserrat"
                defaultActiveKey="1"
                tabPosition="left"
                tabBarStyle={{ width: '42%' }}
                animated={true}
                tabBarGutter={0}
                items={items}
            />
        </div>
    )
}

export default UserProfileEdit