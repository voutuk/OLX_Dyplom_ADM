import { PageHeader } from "../../../../components/page_header";
import { UserOutlined } from '@ant-design/icons';

const UsersPage: React.FC = () => {

    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Всі окористувачі"
                icon={<UserOutlined className="text-2xl" />}
            />
            <div className="bg-white p-5">

                <span className="text-black">All_users</span>
            </div>
        </div>
    );
};

export default UsersPage;