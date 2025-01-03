import { PageHeader } from "../../../../components/page_header";
import { FilterOutlined } from '@ant-design/icons';
const AdminFilterCreate: React.FC = () => {

    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Новий фільтер"
                icon={<FilterOutlined className="text-2xl" />}
            />
            <div className="bg-white p-5">

                <span className="text-black">New_filter</span>
            </div>
        </div>)
};

export default AdminFilterCreate;