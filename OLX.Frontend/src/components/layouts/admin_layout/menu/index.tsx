import { Menu, MenuProps } from "antd";
import { FileDoneOutlined, FilterOutlined, LockOutlined, ProfileOutlined, RobotOutlined, SnippetsOutlined, SolutionOutlined, TeamOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
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
            key: "users_main",
            icon: <TeamOutlined style={{ fontSize: 20 }} />,
            label: <span className='text-base font-medium'>Користувачі</span>,
            children: [
                {
                    key: "/admin",
                    icon: <UserOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="/admin"><span className='text-sm font-medium'>Всі</span></Link>,
                },
                {
                    key: "/admin/blocked",
                    icon: <LockOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="blocked"><span className='text-sm font-medium'>Заблковані</span></Link>,
                }
            ]

        },
        {
            key: "adverts_main",
            icon: <SolutionOutlined style={{ fontSize: 20 }} />,
            label: <span className='text-base font-medium'>Оголошення</span>,
            children: [
                {
                    key: "/admin/adverts",
                    icon: <SnippetsOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="adverts"><span className='text-sm font-medium'>Всі</span></Link>,
                },
                {
                    key: "/admin/adverts/approve",
                    icon: <FileDoneOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="adverts/approve"><span className='text-sm font-medium'>Не підтверджені</span></Link>,
                },
            ]

        },
        {
            key: "categories_main",
            icon: <ProfileOutlined style={{ fontSize: 20 }} />,
            label: <span className='text-base font-medium'>Категорії</span>,
            children: [
                {
                    key: "/admin/categories",
                    icon: <ProfileOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="categories"><span className='text-sm font-medium'>Всі</span></Link>,
                }
            ]
        },

        {
            key: "filters_main",
            icon: <FilterOutlined style={{ fontSize: 20 }} />,
            label: <span className='text-base font-medium'>Фільтри</span>,
            children: [
                {
                    key: "/admin/filters",
                    icon: <FilterOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="filters"><span className='text-sm font-medium'>Всі</span></Link>,
                }
            ]
        },
        {
            key: "admins_main",
            icon: <RobotOutlined style={{ fontSize: 20 }}/>,
            label: <span className='text-base font-medium'>Адміністрвтори</span>,
            children: [
                {
                    key: "/admin/admins",
                    icon: <RobotOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="admins"><span className='text-sm font-medium'>Адміністратори</span></Link>,
                },
                {
                    key: "/admin/admins/new",
                    icon: <UserAddOutlined style={{ fontSize: 16 }} />,
                    label: <Link className='link' to="admins/new"><span className='text-sm font-medium'>Додати</span></Link>,
                }
            ]
        }


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