import { Menu, MenuProps} from "antd";
import {  ProfileOutlined,  SettingOutlined,  SkinOutlined } from '@ant-design/icons';
import './menu.scss'
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
type MenuItem = Required<MenuProps>['items'][number];

export const AdminSideBarMenu: React.FC = () => {

    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);

    useEffect(() => {
        if (location) {
            if (current !== location.pathname) {
                setCurrent(location.pathname);
            }
        }
    }, [location, current]);

    const items: MenuItem[] = [
        {
            key: "users",
            icon: <SkinOutlined style={{fontSize:20}}/>,
            label: <Link className='link' to="users"><span className='text-lg font-medium'>Користувачі</span></Link>,

        },
        {
            key: "categories",
            icon: <ProfileOutlined style={{fontSize:20}}/> ,
            label: <Link className='link' to="categories"><span className='text-lg font-medium'>Категорії</span></Link>,
        },
        
        {
            key: "settings",
            icon: <SettingOutlined style={{fontSize:20}}/>,
            label: <Link className='link' to="settings"><span className='text-lg font-medium'>Налаштування</span></Link>,

        },
    ]
    return (
        <>
            <Menu
                theme="dark"
                mode="inline"
                items={items}
                selectedKeys={[current]}
            />
        </>)
}