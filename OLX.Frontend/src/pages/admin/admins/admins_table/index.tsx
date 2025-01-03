import { PageHeader } from "../../../../components/page_header";
import { RobotOutlined } from '@ant-design/icons';
const AdminsTable: React.FC = () => {

    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Адміністратори"
                icon={<RobotOutlined className="text-2xl" />}
            />
            <div className="bg-white p-5">

                <span className="text-black">Admins</span>
            </div>
        </div>)
};

export default AdminsTable;