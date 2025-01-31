import { PageHeader } from "../../../../components/page_header";
import { ProfileOutlined } from '@ant-design/icons';
import PageHeaderButton from "../../../../components/buttons/page_header_button";
import { CachedOutlined } from "@mui/icons-material";
import AdminAdvertCollapsedFilters from "../../../../components/admin_colapsed_filter";
import { AdminFilterResultModel } from "../../../../components/admin_colapsed_filter/models";
//import { Table } from "antd";
const AdminAdvertTable: React.FC = () => {
    const onFiltersChange = (filterValues: AdminFilterResultModel) => {
        console.log(filterValues)
    }
    return (
        <div className="m-6 flex-grow  text-center ">
            <PageHeader
                title="Діючі оголошення"
                icon={<ProfileOutlined className="text-2xl" />}
                buttons={[
                    // <PageHeaderButton
                    //     key='filters'
                    //     onButtonClick={() => setIsFiltersOpen( true )}
                    //     className="w-[35px] h-[35px] bg-green-700"
                    //     buttonIcon={<FilterOutlined  className="text-lg" />}
                    //     tooltipMessage="Фільтри"
                    //     tooltipColor="gray" />,
                    <PageHeaderButton
                        key='reload'
                        onButtonClick={() => { }}
                        className="w-[35px] h-[35px] bg-sky-700"
                        buttonIcon={<CachedOutlined className="text-lg" />}
                        tooltipMessage="Перезавантажити"
                        tooltipColor="gray" />
                ]}
            />
            <div className="bg-white p-5">
                <AdminAdvertCollapsedFilters
                    onFiltersChange={onFiltersChange} />

                {/* <Table<IOlxUser>
                    size="small"
                    rowKey="id"
                    columns={columns}
                    dataSource={pageResponse?.items}
                    scroll={{ x: 1000 }}
                    loading={isLoading}
                    bordered
                    rowSelection={selected ? rowSelection : undefined}
                    pagination={false}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                    onChange={tableChange} />

                {((pageResponse?.total || 0) > paginatorConfig.pagination.defaultPageSize) &&
                    <Pagination
                        align="center"
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                        locale={paginatorConfig.pagination.locale}
                        showTotal={paginatorConfig.pagination.showTotal}
                        current={pageRequest.page}
                        total={pageResponse?.total}
                        pageSize={pageRequest.size}
                        onChange={onPaginationChange}
                        className='mt-4' />
                } */}

            </div>
        </div>)
};

export default AdminAdvertTable;