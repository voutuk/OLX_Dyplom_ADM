import { PageHeader } from "../../../../components/page_header";
import { UserOutlined } from '@ant-design/icons';
import { useGetUserPageQuery } from "../../../../redux/api/userAuthApi";
import { Pagination, Table, TableColumnsType } from "antd";
import { IOlxUser, IOlxUserPageRequest } from "../../../../models/user";
import PageHeaderButton from "../../../../components/page_header_button";
import { useEffect, useRef, useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { paginatorConfig } from "../../../../utilities/pagintion_settings";
import AdminMessage from "../../../../components/modals/admin_message";
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useCreateAdminMessageMutation } from "../../../../redux/api/adminMessageApi";
import { toast } from "react-toastify";
import { userTableColumns } from "../constants";
import IconButton from "@mui/material/IconButton/IconButton";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import { getUserDescr } from "../../../../utilities/common_funct";
import { useLockUnlockUsersMutation } from "../../../../redux/api/accountAuthApi";
import AdminLock from "../../../../components/modals/admin_user_lock";
import { IUserLockModel } from "../../../../models/account";



const UsersPage: React.FC = () => {

    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const selectedUser = useRef<number | undefined>();

    const [sendAdminMesssage] = useCreateAdminMessageMutation();
    const [isAdminMessageOpen, setAminMessageOpen] = useState<boolean>(false);
    const [isAdminLockOpen, setAminLockOpen] = useState<boolean>(false);
    const adminModalTitle = useRef<string>('')
    const [lockUsers] = useLockUnlockUsersMutation();
    const [pageRequest, setPageRequest] = useState<IOlxUserPageRequest>({
        size: paginatorConfig.pagination.defaultPageSize,
        page: paginatorConfig.pagination.defaultCurrent,
        sortIndex: 0,
        isDescending: false,
        emailSearch: '',
        phoneNumberSearch: '',
        firstNameSearch: '',
        lastNameSearch: '',
        webSiteSearch: '',
        settlementRefSearch: '',
    })
    const { data, isLoading, refetch } = useGetUserPageQuery(pageRequest);

    const currentTaleColumns: TableColumnsType<IOlxUser> = [
        {
            key: 'actions',
            ellipsis: true,
            width: 135,
            render: (_, user: IOlxUser) =>
                <div className='flex'>
                    <Tooltip title="Написати повідомлення">
                        <IconButton onClick={() => sendMessage(user.id)} color="info" size="small">
                            <MessageOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Блокувати">
                        <IconButton onClick={() => lockUser(user.id)} color="warning" size="small">
                            <LockOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Видалити">
                        <IconButton color="error" size="small">
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>


                </div>,
            fixed: 'right',
            align: 'center'
        }
    ]
    const columns = [...userTableColumns, ...currentTaleColumns]

    const getUserName = (userId: number) => getUserDescr(data?.items.find(x => x.id === userId) || null)

    const sendMessage = async (userId: number) => {
        adminModalTitle.current = adminModalTitle.current = `Повідомлення для користувача "${getUserName(userId)}"`
        setAminMessageOpen(true)
        selectedUser.current = userId;
    }

    const lockUser = (userId: number) => {
        selectedUser.current = userId;
        setAminLockOpen(true)
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
            refetch()
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
            onButtonClick={() => { }}
            className="w-[35px] h-[35px] bg-red-900"
            buttonIcon={<FilterAltOffOutlinedIcon className="text-lg" />}
            tooltipMessage="Очистити фільтри"
            tooltipColor="gray"
            disabled={false} />,
        <PageHeaderButton
            key='clear_select'
            onButtonClick={() => setSelectedUsers([])}
            className="w-[35px] h-[35px] bg-red-700"
            buttonIcon={<IndeterminateCheckBoxOutlinedIcon className="text-lg" />}
            tooltipMessage="Очистити вибрані"
            tooltipColor="gray"
            disabled={selectedUsers.length === 0} />,
        <PageHeaderButton
            key='block_users'
            onButtonClick={onGroupeLockUsers}
            className="w-[35px] h-[35px] bg-yellow-700"
            buttonIcon={<LockOutlinedIcon className="text-lg" />}
            tooltipMessage="Блокувати акаунт"
            tooltipColor="gray"
            disabled={selectedUsers.length === 0} />,
        <PageHeaderButton
            key='send_message'
            onButtonClick={onGroupeMessageSend}
            className="w-[35px] h-[35px] bg-orange-500"
            buttonIcon={<MessageOutlinedIcon className="text-lg" />}
            tooltipMessage="Написати повідомлення"
            tooltipColor="gray" />,
        <PageHeaderButton
            key='reload'
            onButtonClick={refetch}
            className="w-[35px] h-[35px] bg-green-700"
            buttonIcon={<CachedOutlinedIcon className="text-lg" />}
            tooltipMessage="Перезавантажити"
            tooltipColor="gray" />,

    ]

    const onPaginationChange = (currentPage: number, pageSize: number) => {
        setPageRequest({ ...pageRequest, page: currentPage, size: pageSize })
    }

    const rowSelection: TableRowSelection<IOlxUser> = {
        selectedRowKeys: selectedUsers.map(x => x as React.Key),
        onSelect: (record, selected, _selectedRows) => {
            if (selected) {
                setSelectedUsers((prev) => [...prev, record.id])
            }
            else {
                setSelectedUsers(selectedUsers.filter(x => x !== record.id))
            }
        },
        onSelectAll: (selected, _selectedRows, changeRows) => {
            if (selected) {
                const selected = changeRows?.map(x => x.id) || []
                setSelectedUsers((prev) => [...prev, ...selected])
            } else {
                const selected = selectedUsers.filter(z => !changeRows.some(x => x.id === z))
                setSelectedUsers(selected)
            }
        }
    }

    useEffect(() => {
        (async () => {
            await refetch()
        })()
    }, [pageRequest])

    return (
        <div className="m-6 flex-grow  text-center overflow-hidden">
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

            <PageHeader
                title="Всі окористувачі"
                icon={<UserOutlined className="text-2xl" />}
                buttons={pageHeaderButtons} />

            <Table<IOlxUser>
                rowKey="id"
                columns={columns}
                dataSource={data?.items}
                scroll={{ x: 1000 }}
                loading={isLoading}
                bordered
                rowSelection={rowSelection}
                pagination={false} />

            {(data?.total && data?.total > 0) &&
                <Pagination
                    align="center"
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                    locale={paginatorConfig.pagination.locale}
                    showTotal={paginatorConfig.pagination.showTotal}
                    current={pageRequest.page}
                    total={data.total}
                    pageSize={pageRequest.size}
                    onChange={onPaginationChange}
                    className='mt-4' />
            }
        </div>
    );
};

export default UsersPage;