import { PageHeader } from "../../../../components/page_header";
import { FilterOutlined } from '@ant-design/icons';
const AdminFilterTable: React.FC = () => {

    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Всі фільтрі"
                icon={<FilterOutlined className="text-2xl" />}
            />
            <div className="bg-white p-5">

                <span className="text-black">All_filters</span>
            </div>
        </div>)
};

export default AdminFilterTable;