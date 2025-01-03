import { PageHeader } from "../../../../components/page_header";
import { LockOutlined } from '@ant-design/icons';
const BlockedUsersPage: React.FC = () => {

    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Заблоковані окористувачі"
                icon={<LockOutlined  className="text-2xl" />}
            />
            <div className="bg-white p-5">

                <span className="text-black">Blocked_users</span>
            </div>
        </div>
    );
};

export default BlockedUsersPage;