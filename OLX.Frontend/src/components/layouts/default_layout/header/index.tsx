import { Avatar, Badge, Dropdown, MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BellOutlined, DownOutlined, LogoutOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Images } from "../../../../constants/images";
import { getUser } from "../../../../redux/slices/userSlice";
import { getUserDescr } from "../../../../utilities/common_funct";
import UserAvatar from "../../../user_avatar";
import { useLogoutMutation } from "../../../../redux/api/accountApi";



export const Header: React.FC = () => {
    const [logout] = useLogoutMutation();
    const navigator = useNavigate();
    const user = useSelector(getUser)
    const items: MenuProps['items'] = [
        {
            icon: <UserOutlined />,
            label: <Link to={'user/userprofile'}>Профіль</Link>,
            key: '0',
        },
        {
            icon: <SettingOutlined />,
            label: <Link to={'user/usersettings'}>Налаштування</Link>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            icon: <LogoutOutlined />,
            label: 'Вийти',
            key: '3',
            onClick: async () => {
                await logout({}).unwrap();
            }
        },
    ];

    return (
        <div className='h-[60px] bg-header sticky bg-blue-700 top-0 items-center flex-shrink-0 flex justify-between z-50'  >
            <div className='flex gap-6 items-center'>
                <Avatar className='ml-3' size={46} src={Images.adminPanelImage} />
                <span className="text-white">Site name</span>
            </div>
            <div className='flex gap-7 h-full'>
                <div className='flex gap-5 flex-shrink-0 items-center'>
                    <Badge count={2} size='small' >
                        <BellOutlined className='text-xl text-white animate-pulse' />
                    </Badge>
                    <Badge count={4} size='small'>
                        <MailOutlined className='text-xl text-white animate-wiggle' />
                    </Badge>
                </div>
                {user
                ?
                    <Dropdown menu={{ items }} trigger={['click']} className='px-3 cursor-pointer  flex-shrink-0 bg-orange-500 flex gap-2 justify-center items-center'>
                        <div>
                            <UserAvatar user={user} size={40} />
                            <span className='flex-shrink-0  text-base text-nowrap'>{getUserDescr(user)}</span>
                            <DownOutlined />
                        </div>
                    </Dropdown>
                    :
                    <span onClick={() => navigator('auth')} className=" self-center px-4 text-white">Увійти</span>}
            </div>
        </div>
    )
}