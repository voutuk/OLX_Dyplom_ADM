
import { BellOutlined, DownOutlined, LogoutOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import './style.scss'
import { Avatar, Badge, Dropdown, MenuProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import { Images } from '../../../constants/images';
import { useSelector } from 'react-redux';
import { getUser } from '../../../store/slices/userSlice';
import { useLogoutMutation } from '../../../services/accountServiceAuth';
import { getUserDescr } from '../../../utilities/common_funct';
import UserAvatar from '../../../components/user_avatar';



export const AdminHeader: React.FC = () => {
    const [logout] = useLogoutMutation();
    const navigator = useNavigate();
    const user = useSelector(getUser)
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
                <Dropdown menu={{ items }} trigger={['click']} className=' min-w-[180] px-5 cursor-pointer  flex-shrink-0 bg-orange-500 flex gap-2 justify-center items-center'>
                    <div>
                        <UserAvatar size={40} user={user} />
                        <span className='flex-shrink-0  text-base text-nowrap'>{user ? getUserDescr(user) : ''}</span>
                        <DownOutlined />
                    </div>
                </Dropdown>

            </div>
        </div>
    )
}