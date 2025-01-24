import { Badge, Dropdown, MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BellOutlined, HeartOutlined, LogoutOutlined, MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Images } from "../../../../constants/images";
import { getRefreshToken, getUnreadedCount, getUser } from "../../../../redux/slices/userSlice";
import UserAvatar from "../../../user_avatar";
import { useLogoutMutation } from "../../../../redux/api/accountApi";
import { useAppSelector } from "../../../../redux";
import { useGetUserMessagesQuery } from "../../../../redux/api/adminMessageApi";
import { useEffect } from "react";
import { useSignalR } from "../../../hendlers/signalR/signalRContext";
import SearchInput from "../../../inputs/search_input";

export const Header: React.FC = () => {
    const signalRConnection = useSignalR();
    const [logout] = useLogoutMutation();
    const navigator = useNavigate();
    const user = useSelector(getUser)
    const unreadMesssageCount = useAppSelector(getUnreadedCount)
    const { data, refetch } = useGetUserMessagesQuery();
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

    useEffect(() => { refetch() }, [user])

    return (
        <div className='h-[11vh] bg-header sticky mx-[8vw] top-0 items-center flex-shrink-0 flex justify-between z-50'  >
            <img alt="logo" className="h-[4vh]" src={Images.logo} />
            <SearchInput />
            <div className='flex gap-10  items-center'>
                {user && <Badge count={data?.length} size='small'>
                    <MessageOutlined className='text-[3vh] text-amber-950 cursor-pointer animate-wiggle' />
                </Badge>}

                <HeartOutlined className='text-[3vh] text-amber-950 cursor-pointer' />

                {user && <Badge count={unreadMesssageCount} size='small' className={unreadMesssageCount > 0 ? "animate-pulse" : ''} >
                    <BellOutlined className='text-[3vh] text-amber-950 cursor-pointer' />
                </Badge>}

                {user
                    ?
                    <Dropdown menu={{ items }} trigger={['click']} className='px-3 cursor-pointer  flex-shrink-0 flex gap-2 justify-center items-center'>
                        <div>
                            <UserAvatar user={user} size={40} />
                        </div>
                    </Dropdown>
                    :
                    <UserOutlined onClick={() => navigator('auth')} className='text-[3vh] text-amber-950 cursor-pointer' />}

            </div>
        </div>
    )
}