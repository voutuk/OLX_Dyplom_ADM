import { PageHeader } from "../../../../components/page_header";
import { ProfileOutlined } from '@ant-design/icons';
const AdminCategoryCreate: React.FC = () => {

    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Нова категорія"
                icon={<ProfileOutlined className="text-2xl" />}
            />
            <div className="bg-white p-5">

                <span className="text-black">New_category</span>
            </div>
        </div>)
};

export default AdminCategoryCreate;