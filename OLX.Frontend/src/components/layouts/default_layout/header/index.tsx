import { Avatar, Badge, Dropdown, MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BellOutlined, DownOutlined, LogoutOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Images } from "../../../../constants/images";
import { getRefreshToken, getUnreadedCount, getUser } from "../../../../redux/slices/userSlice";
import { getUserDescr } from "../../../../utilities/common_funct";
import UserAvatar from "../../../user_avatar";
import { useLogoutMutation } from "../../../../redux/api/accountApi";
import { useAppSelector } from "../../../../redux";
import { useGetUserMessagesQuery } from "../../../../redux/api/adminMessageApi";
import { useEffect } from "react";
import { useSignalR } from "../../../hendlers/signalR/signalRContext";


export const Header: React.FC = () => {
    const signalRConnection = useSignalR();
    const [logout] = useLogoutMutation();
    const navigator = useNavigate();
    const user = useSelector(getUser)
    const unreadMesssageCount = useAppSelector(getUnreadedCount)
    const {data,refetch} = useGetUserMessagesQuery();
    const refreshToken = useAppSelector(getRefreshToken)
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
                await signalRConnection?.connection?.invoke("Disconnect");
                await logout(refreshToken || '').unwrap();
            }
        },
    ];

    useEffect(()=>{refetch()},[user])

    return (
        <div className='h-[60px] bg-header sticky bg-blue-700 top-0 items-center flex-shrink-0 flex justify-between z-50'  >
            <div className='flex gap-6 items-center'>
                <Avatar className='ml-3' size={46} src={Images.adminPanelImage} />
                <span className="text-white">Site name</span>
            </div>
            <div className='flex gap-7 h-full'>
                {user &&
                    <div className='flex gap-5 flex-shrink-0 items-center'>
                        <Badge count={unreadMesssageCount} size='small' className={unreadMesssageCount > 0 ? "animate-pulse" : ''} >
                            <BellOutlined className='text-xl text-white' />
                        </Badge>
                        <Badge count={data?.length} size='small'>
                            <MailOutlined className='text-xl text-white animate-wiggle' />
                        </Badge>
                    </div>}

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