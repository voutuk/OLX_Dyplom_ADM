import { PageHeader } from "../../../../components/page_header";
import { UserOutlined } from '@ant-design/icons';
import { Modal } from "antd";
import { IOlxUser, IOlxUserPageRequest } from "../../../../models/user";
import PageHeaderButton from "../../../../components/buttons/page_header_button";
import { useCallback, useEffect, useRef, useState } from "react";
import { paginatorConfig } from "../../../../utilities/pagintion_settings";
import AdminMessage from "../../../../components/modals/admin_message";
import { useCreateAdminMessageMutation } from "../../../../redux/api/adminMessageApi";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton/IconButton";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import { getUserDescr } from "../../../../utilities/common_funct";
import { useLockUnlockUsersMutation } from "../../../../redux/api/accountAuthApi";
import AdminLock from "../../../../components/modals/admin_user_lock";
import UserTable from "../../../../components/user_table/intedx";
import {
    SearchOff,
    MessageOutlined,
    CachedOutlined,
    IndeterminateCheckBoxOutlined,
    DeleteForever,
    LockOutlined,
    LockOpen
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { useGetUserPageQuery } from "../../../../redux/api/userAuthApi";

const updatedPageRequest = (searchParams: URLSearchParams) => ({
    isAdmin: location.pathname === '/admin/admins',
    isLocked:location.pathname === '/admin/adverts/blocked',
    size: Number(searchParams.get("size")) || paginatorConfig.pagination.defaultPageSize,
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    sortKey: searchParams.get("sortKey") || '',
    isDescending: searchParams.get("isDescending") === "true",
    emailSearch: searchParams.get("emailSearch") || '',
    phoneNumberSearch: searchParams.get("phoneNumberSearch") || '',
    firstNameSearch: searchParams.get("firstNameSearch") || '',
    lastNameSearch: searchParams.get("lastNameSearch") || '',
    webSiteSearch: searchParams.get("webSiteSearch") || '',
    settlementRefSearch: searchParams.get("settlementRefSearch") || '',
});


const UsersPage: React.FC = () => {
    const [searchParams] = useSearchParams('');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const selectedUser = useRef<number | undefined>();
    const [modal, contextHolder] = Modal.useModal();
    const [sendAdminMesssage] = useCreateAdminMessageMutation();
    const [isAdminMessageOpen, setAminMessageOpen] = useState<boolean>(false);
    const [isAdminLockOpen, setAminLockOpen] = useState<boolean>(false);
    const adminModalTitle = useRef<string>('')
    const [lockUsers] = useLockUnlockUsersMutation();
    const [pageRequest, setPageRequest] = useState<IOlxUserPageRequest>(updatedPageRequest(searchParams));
    const { data, isLoading, refetch } = useGetUserPageQuery(pageRequest)
    
    useEffect(() => {
        setPageRequest(updatedPageRequest(searchParams));
    }, [location.search,location.pathname]);

    const actions = useCallback((_value: any, user: IOlxUser) =>
        <div className='flex justify-around'>
            {(location.pathname !== '/admin/admins') &&
                <>
                    <Tooltip title="Написати повідомлення">
                        <IconButton onClick={() => sendMessage(user.id)} color="info" size="small">
                            <MessageOutlined />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={location.pathname !== '/admin/adverts/blocked' ? "Блокувати" : "Розблокувати"}>
                        <IconButton onClick={() => location.pathname !== '/admin/adverts/blocked' ? lockUser(user.id) : unLockUser(user.id)} color="warning" size="small">
                            {location.pathname !== '/admin/adverts/blocked' ? <LockOutlined /> : <LockOpen />}
                        </IconButton>
                    </Tooltip>
                </>
            }
            {(location.pathname !== '/admin/admins' || (data?.items.length && data?.items.length > 1)) &&
                <Tooltip title="Видалити">
                    <IconButton color="error" size="small">
                        <DeleteForever />
                    </IconButton>
                </Tooltip>
            }
        </div>, [location.pathname])


    const getUserName = (userId: number) => getUserDescr(data?.items.find(x => x.id === userId) || null)

    const sendMessage = async (userId: number) => {
        adminModalTitle.current = adminModalTitle.current = `Повідомлення для користувача "${getUserName(userId)}"`
        setAminMessageOpen(true)
        selectedUser.current = userId;
    }

    const lockUser = (userId: number) => {
        selectedUser.current = userId;
        adminModalTitle.current = adminModalTitle.current = `Блокування користувача "${getUserName(selectedUser.current)}"`
        setAminLockOpen(true)
    }

    const unLockUser = (userId: number) => {
        selectedUser.current = userId;
        onGroupeUnLockUsers();
    }

    const onLockUsers = async (data: any) => {
        const result = await lockUsers({
            userIds: selectedUser.current ? [selectedUser.current] : selectedUsers,
            lockReason: data.lockReason,
            lock: true,
            lockoutEndDate: data.lockEndDate
        })
        if (!result.error) {
            toast(`Користувач${selectedUsers.length > 1 ? 'ів' : 'а'} заблоковано`, {
                type: 'info',
                style: { width: 'fit-content' }
            })
            setSelectedUsers([])
            selectedUser.current = undefined;
            setAminLockOpen(false)
        }
    }

    const onGroupeLockUsers = async () => {
        if (selectedUsers.length === 1) {
            adminModalTitle.current = adminModalTitle.current = `Блокування користувача "${getUserName(selectedUsers[0])}"`
        }
        else {
            adminModalTitle.current = "Блокування обраних користувачів"
        }
        setAminLockOpen(true)
    }

    const unlockUsers = async () => {
        const result = await lockUsers({
            userIds: selectedUser.current ? [selectedUser.current] : selectedUsers,
            lock: false,
        })
        if (!result.error) {
            toast(`Користувач${selectedUsers.length > 1 ? 'ів' : 'а'} розблоковано`, {
                type: 'info',
                style: { width: 'fit-content' }
            })
            setSelectedUsers([])
            selectedUser.current = undefined;
        }
    }

    const onGroupeUnLockUsers = async () => {
        modal.confirm({
            title: `Розблокування ${selectedUser.current || selectedUsers.length === 1 ? " користувача" : " користувачів"}`,
            icon: <LockOpen />,
            content: `Розблокувати обран${selectedUser.current || selectedUsers.length === 1 ? "ого користувача" : "их користувачів"}?`,
            okText: 'Розблокувати',
            cancelText: 'Відмінити',
            onOk: unlockUsers
        });
    }

    const sendGroupeMessage = async (data: any) => {
        const result = await sendAdminMesssage({
            userIds: selectedUser.current ? [selectedUser.current] : selectedUsers,
            content: data.message,
            subject: data.subject
        })
        if (!result.error) {
            toast(`Повідомлення успішно відправлен${selectedUsers.length > 1 ? 'і' : 'о'}`, {
                type: 'info',
                style: { width: 'fit-content' }
            })
            setAminMessageOpen(false)
            selectedUser.current = undefined;
        }
    }

    const onGroupeMessageSend = () => {
        if (selectedUsers.length === 0) {
            adminModalTitle.current = "Повідомлення для всіх користувачів"
        }
        else if (selectedUsers.length === 1) {
            adminModalTitle.current = `Повідомлення для користувача "${getUserName(selectedUsers[0])}"`
        }
        else {
            adminModalTitle.current = "Повідомлення для обраних користувачів"
        }
        setAminMessageOpen(true)
    }

    const pageHeaderButtons = [
        <PageHeaderButton
            key='clear_filter'
            onButtonClick={() => {
                setPageRequest((prev) => ({
                    ...prev,
                    emailSearch: '',
                    phoneNumberSearch: '',
                    firstNameSearch: '',
                    lastNameSearch: '',
                    webSiteSearch: '',
                    settlementRefSearch: ''
                }))
            }}
            className="w-[35px] h-[35px] bg-red-900"
            buttonIcon={<SearchOff className="text-lg" />}
            tooltipMessage="Очистити фільтри"
            tooltipColor="gray"
            disabled={
                pageRequest.emailSearch === '' &&
                pageRequest.phoneNumberSearch === '' &&
                pageRequest.firstNameSearch === '' &&
                pageRequest.lastNameSearch === '' &&
                pageRequest.webSiteSearch === '' &&
                pageRequest.settlementRefSearch === ''} />,
        <PageHeaderButton
            key='clear_select'
            onButtonClick={() => setSelectedUsers([])}
            className="w-[35px] h-[35px] bg-red-700"
            buttonIcon={<IndeterminateCheckBoxOutlined className="text-lg" />}
            tooltipMessage="Очистити вибрані"
            tooltipColor="gray"
            disabled={selectedUsers.length === 0} />,
        <PageHeaderButton
            key='block_users'
            onButtonClick={location.pathname !== '/admin/adverts/blocked' ? onGroupeLockUsers : onGroupeUnLockUsers}
            className="w-[35px] h-[35px] bg-yellow-700"
            buttonIcon={location.pathname !== '/admin/adverts/blocked' ? <LockOutlined className="text-lg" /> : <LockOpen className="text-lg" />}
            tooltipMessage={location.pathname !== '/admin/adverts/blocked' ? "Блокувати акаунт" : "Розблокувати акаунт"}
            tooltipColor="gray"
            disabled={selectedUsers.length === 0 || location.pathname === '/admin/admins'} />,
        <PageHeaderButton
            key='send_message'
            onButtonClick={onGroupeMessageSend}
            className="w-[35px] h-[35px] bg-orange-500"
            buttonIcon={<MessageOutlined className="text-lg" />}
            tooltipMessage="Написати повідомлення"
            tooltipColor="gray"
            disabled={location.pathname === '/admin/admins'} />,
        <PageHeaderButton
            key='reload'
            onButtonClick={refetch}
            className="w-[35px] h-[35px] bg-green-700"
            buttonIcon={<CachedOutlined className="text-lg" />}
            tooltipMessage="Перезавантажити"
            tooltipColor="gray" />,
    ]

    return (
        <div className="m-6 flex-grow  text-center overflow-hidden">
            {contextHolder}
            {location.pathname !== '/admin/admins' &&
                <>
                    <AdminMessage
                        isOpen={isAdminMessageOpen}
                        onConfirm={sendGroupeMessage}
                        onCancel={() => setAminMessageOpen(false)}
                        title={adminModalTitle.current} />
                    <AdminLock
                        isOpen={isAdminLockOpen}
                        onConfirm={onLockUsers}
                        onCancel={() => setAminLockOpen(false)}
                        title={adminModalTitle.current} />
                </>
            }

            <PageHeader
                title={location.pathname === '/admin'
                    ? 'Всі користувачі'
                    : location.pathname === '/admin/admins'
                        ? 'Адміністратори'
                        : 'Заблоковані користувачі'}
                icon={<UserOutlined className="text-2xl" />}
                buttons={pageHeaderButtons} />

            <UserTable
                selectedUsers={selectedUsers}
                pageResponse={data}
                pageRequest={pageRequest}
                actions={actions}
                isLoading={isLoading}
                onRowSelection={setSelectedUsers}
                page={pageRequest.page || paginatorConfig.pagination.defaultCurrent}
                total={data?.total || 0}
                size={pageRequest.size || paginatorConfig.pagination.defaultPageSize}
                selected={location.pathname !== '/admin/admins'} />
        </div>
    );
};

export default UsersPage;