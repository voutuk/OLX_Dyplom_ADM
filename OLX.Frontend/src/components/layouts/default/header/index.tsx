import { Avatar, Badge, Dropdown, MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BellOutlined, DownOutlined, LogoutOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Images } from "../../../../constants/images";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";
import { getUser } from "../../../../store/slices/userSlice";
import { IUser } from "../../../../models/account";
import { APP_ENV } from "../../../../constants/env";
import { useLogoutMutation } from "../../../../services/accountServiceAuth";



export const Header: React.FC = () => {
    const [logout] = useLogoutMutation();
    const navigator = useNavigate();
    const user: IUser | null = useSelector((state: RootState) => getUser(state))
    const items: MenuProps['items'] = [
        {
            icon: <UserOutlined />,
            label: <Link to={'/userprofile'}>Профіль</Link>,
            key: '0',
        },
        {
            icon: <SettingOutlined />,
            label: <Link to={'/usersettings'}>Налаштування</Link>,
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
                navigator('/')
            }
        },
    ];


    return (
        <div className='h-[60px] bg-header sticky top-0 items-center flex-shrink-0 flex justify-between z-50'  >
            <div className='flex gap-6 items-center'>
                <Avatar className='ml-3' size={46} src={Images.adminPanelImage} />
                <span>Адмінпанель</span>
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
                <Dropdown menu={{ items }} trigger={['click']} className='w-[180px] cursor-pointer  flex-shrink-0 bg-orange-500 flex gap-2 justify-center items-center'>
                    <div>
                        <Avatar className=" flex-shrink-0" size={40} src={user ? APP_ENV.IMAGES_100_URL + user.photo : Images.noImage} />
                        <span className='flex-shrink-0  text-base text-nowrap'>Ivan Sapun</span>
                        <DownOutlined />
                    </div>
                </Dropdown>

            </div>
        </div>
    )
}