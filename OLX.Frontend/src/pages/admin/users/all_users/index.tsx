import { PageHeader } from "../../../../components/page_header";
import { CheckOutlined, ExclamationCircleFilled, UserOutlined } from '@ant-design/icons';
import { useGetUserPageQuery } from "../../../../redux/api/userAuthApi";
import { Modal, Pagination, Table, TableColumnsType } from "antd";
import { IOlxUser, IOlxUserPageRequest } from "../../../../models/user";
import UserAvatar from "../../../../components/user_avatar";
import { getDateTime } from "../../../../utilities/common_funct";
import PageHeaderButton from "../../../../components/page_header_button";
import { useEffect, useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { paginatorConfig } from "../../../../utilities/pagintion_settings";
import AdminMessage from "../../../../components/modals/admin_message";
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import RemoveDoneOutlinedIcon from '@mui/icons-material/RemoveDoneOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { useCreateAdminMessageMutation } from "../../../../redux/api/adminMessageApi";
import { toast } from "react-toastify";

const columns: TableColumnsType<IOlxUser> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width: 50,
        fixed: 'left',
        align: 'center'
    },
    {
        title: 'Фото',
        dataIndex: 'photo',
        key: 'photo',
        ellipsis: true,
        render: (_, user: IOlxUser) => <UserAvatar user={user} size={40} />,
        width: 80,
        fixed: 'left',
        align: 'center'
    },
    {
        title: "Прізвище",
        dataIndex: 'lastName',
        key: 'lastName',
        ellipsis: true,
        width: 120,
        render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
        fixed: 'left',
    },
    {
        title: "Ім'я",
        dataIndex: 'firstName',
        key: 'firstName',
        ellipsis: true,
        width: 120,
        render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
    },
    {
        title: "Телефон",
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        ellipsis: true,
        width: 100,
        render: (value: string, user: IOlxUser) =>
            <div className="flex gap-5">
                <span >{value ? value : "- - - - - - "}</span>
                {user.phoneNumberConfirmed && <CheckOutlined className=" text-green-700" />}
            </div>,
        align: 'center'
    },
    {
        title: "Електронна пошта",
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
        width: 250,
        render: (value: string, user: IOlxUser) =>
            <div className="flex gap-5">
                <span >{value}</span>
                {user.emailConfirmed && <CheckOutlined className=" text-green-700" />}
            </div>
    },

    {
        title: "Населений пункт",
        dataIndex: 'settlementDescrption',
        key: 'settlementDescrption',
        width: 150,
        render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
    },

    {
        title: "Оголошеня",
        key: 'advertCount',
        render: (_, user: IOlxUser) => <span >{user.adverts.length}</span>,
        width: 110,
        align: 'center'
    },
    {
        title: "Дата реєстрації",
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (value: string) => <span >{getDateTime(value)}</span>,
        width: 160,
        align: 'center'
    },
    {
        title: "Остання активність",
        dataIndex: 'lastActivity',
        key: 'lastActivity',
        render: (value: string) => <span >{getDateTime(value)}</span>,
        width: 160,
        align: 'center'
    },
    {
        key: 'actions',
        ellipsis: true,
        width: 100,
        render: () => <span >Actions</span>,
        fixed: 'right',
        align: 'center'
    },


];

const UsersPage: React.FC = () => {
    const { confirm } = Modal;
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [sendAdminMesssage] = useCreateAdminMessageMutation();
    const [isAdminMessageOpen, setAminMessageOpen] = useState<boolean>(false);
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

    // const sendMessage = async (message: string) => {
    //     selectedUsers.forEach(element => console.log(message + ' sended ' + element + '-user'));
    //     setAminMessageOpen(false)
    // }

    const sendGroupeMessage = async (data: any) => {
        console.log(data.message, data.subject)
        const result = await sendAdminMesssage({
            userIds: selectedUsers,
            content: data.message,
            subject: data.subject
        })
        if (!result.error) {
            toast(`Повідомлення успішно відправлен${selectedUsers.length > 1 ? 'і' : 'о'}`, {
                type: 'info',
                style: { width: 'fit-content' }
            })
            setAminMessageOpen(false)
            setSelectedUsers([])

        }
    }

    const onGroupeMessageSend = () => {
        if (selectedUsers.length === 0) {
            confirm({
                title: 'Відправка повідомлень',
                icon: <ExclamationCircleFilled />,
                content: 'Ви не обрали користувачів.Відправити повідомлення всім користувачам?',
                okText: 'Відправити',
                cancelText: 'Скасувати',
                onOk() { setAminMessageOpen(true) }
            });
        }
        else {
            setAminMessageOpen(true)
        }
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
            buttonIcon={<RemoveDoneOutlinedIcon className="text-lg" />}
            tooltipMessage="Очистити вибрані"
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
                title="Нове повідомлення" />

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