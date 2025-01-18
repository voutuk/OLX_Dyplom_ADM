import { TableColumnsType } from "antd"
import { IOlxUser } from "../../../../models/user"
import UserAvatar from "../../../../components/user_avatar";
import { CheckOutlined } from "@mui/icons-material";
import { getDateTime } from "../../../../utilities/common_funct";

export const userTableColumns: TableColumnsType<IOlxUser> = [
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
    


];