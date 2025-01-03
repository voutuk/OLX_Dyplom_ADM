import { PageHeader } from "../../../../components/page_header";
import { ProfileOutlined } from '@ant-design/icons';
const AdminCategoryTable: React.FC = () => {

    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Всі категоріїї"
                icon={<ProfileOutlined className="text-2xl" />}
            />
            <div className="bg-white p-5">

                <span className="text-black">All_categories</span>
            </div>
        </div>)
};

export default AdminCategoryTable;