import { Checkbox, Form, Input, InputNumber, Select, TreeSelect, UploadFile } from "antd"
import { BackButton } from "../../../components/buttons/back_button"
import UploadWithDnd from "../../../components/image_upload"
import TextArea from "antd/es/input/TextArea"
import './style.scss'
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi"
import { useMemo, useState } from "react"
import { buildTree, getAllParentFilterIds } from "../../../utilities/common_funct"
import { useGetAllFilterQuery } from "../../../redux/api/filterApi"
import { IAdvertCreationModel } from "../../../models/advert"
import { useAppSelector } from "../../../redux"
import PrimaryButton from "../../../components/buttons/primary_button"


const CreateAdvert: React.FC = () => {
    const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery()
    const getCategoryTree = useMemo(() => buildTree(categories || [], undefined, undefined, true), [categories])
    const { data: filters } = useGetAllFilterQuery();
    const user = useAppSelector(state => state.user.user);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>()
    const onFinish = (data: any) => {
        const filterValues = Object.entries(data).filter(x => !isNaN(Number(x[0])) && x[1]).map(x => x[1])
        const imageFiles = data.files.map((x: UploadFile) => x?.originFileObj as Blob)
        const advertCreationModel: IAdvertCreationModel = {
            id: 0,
            userId: user?.id || 0,
            phoneNumber: data.phoneNumber,
            contactEmail: data.contactEmail,
            title: data.title,
            description: data.description,
            isContractPrice: data.isContractPrice,
            settlementRef: data.settlementRef,
            price: data.price,
            categoryId: data.categoryId,
            filterValueIds: filterValues as [],
            imageFiles: imageFiles,
            contactPersone: `${data.contactSurname} ${data.contactName}`
        }
        console.log(advertCreationModel)
    }

    const categoryFilters = useMemo(() => {
        const categoryFilters = getAllParentFilterIds(categories || [], selectedCategoryId);
        return <div className="ml-[8vw] flex flex-col gap-[2.5vh]">
            {filters?.filter(x => categoryFilters?.includes(x.id)).map(filter =>
                <Form.Item
                    label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">{filter.name}</div>}
                    key={filter.id}
                    name={filter.id} >
                    <Select
                        popupClassName="create-advert-select-popup"
                        allowClear
                        options={filter.values.map(value => ({ value: value.id.toString(), label: value.value }))}
                        placeholder={filter.name}
                        style={{ height: '5vh', width: '23vw' }}
                        className="create-advert-select"

                    />
                </Form.Item>)}
        </div>

    }, [filters, selectedCategoryId])

    return (
        <>
            <div className="flex w-[100%] items-start flex-col  gap-[5vh]  mb-[18vh]">
                <BackButton className="text-adaptive-1_9_text ml-[9vw] font-medium mt-[7.9vh]" title="Назад" />
                <h1 className=" mt-[7vh]  ml-[8vw] font-unbounded text-adaptive-3_35-text">Створити оголошення</h1>

                <Form
                    name="advertForm"
                    onFinish={onFinish}
                    layout="vertical"
                    className=" w-full flex flex-col gap-[4.2vh]" >

                    <div className="flex flex-col mx-[8vw] gap-[5.3vh] ">
                        <div className="flex flex-col gap-[0.7vh]">
                            <span className="font-unbounded font-medium text-adaptive-1_7_text">Додати фото</span>
                            <span className="font-montserrat  text-adaptive-1_7_text">Перше фото буде на обкладинці оголошення. Перетягніть, щоб змінити порядок фото.</span>
                        </div>
                        <Form.Item
                            name="files"
                            valuePropName="images"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть як мінімум одине фото</span>
                                },
                            ]}
                        >
                            <UploadWithDnd
                                maxCount={15}
                                columns={5}
                                rowHeight={21}
                                className="gap-[2.5vh]"
                                defaultCount={4} />

                        </Form.Item>
                    </div>
                    <hr className="mb-[2vh]" />

                    <div className="flex flex-col gap-[2.7vh]">
                        <Form.Item
                            name="title"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Назва</div>}
                            className="ml-[8vw]"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть назву оголошення</span>
                                },
                            ]}
                        >
                            <Input
                                className="h-[5vh] w-[47.3vw] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Назва" />

                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={
                                <div className="mb-[0.5vh] flex flex-col gap-[.8vh]">
                                    <span className="font-unbounded font-medium text-adaptive-1_7_text">Опис</span>
                                    <span className="font-montserrat text-adaptive-1_7_text">Введіть щонайменше 40 символів</span>
                                </div>}
                            className="ml-[8vw]"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть опис</span>
                                },
                                {
                                    min: 40,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть щонайменше 40 символів</span>
                                },
                                {
                                    max: 600,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Максимум 600 символів</span>
                                },
                            ]}
                        >
                            <TextArea
                                showCount
                                maxLength={600}
                                placeholder="Опис"
                                className="h-[21vh] w-[47.3vw] font-montserrat text-adaptive-1_7_text resize-none border-[#9B7A5B]" />


                        </Form.Item>

                        <Form.Item
                            name="categoryId"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Оберіть категорію</div>}
                            className="ml-[8vw]"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть категорію</span>
                                },
                            ]}
                        >
                            <TreeSelect
                                popupClassName="create-advert-select-popup"
                                allowClear
                                showSearch
                                loading={isCategoriesLoading}
                                style={{ height: '5vh', width: '47.3vw' }}
                                className="create-advert-select"
                                treeData={getCategoryTree}
                                placeholder="Оберіть категорію"
                                onChange={(categoryId: number) => setSelectedCategoryId(categoryId)}
                            />
                        </Form.Item>

                    </div>
                    <hr className="mb-[2vh]" />

                    <div className="flex flex-col ml-[8vw]">
                        <Form.Item
                            name="price"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text">Ціна</div>}
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть ціну</span>
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                className="h-[5vh] w-[23vw] font-montserrat create-advert-number-input"
                                placeholder="Ціна" />

                        </Form.Item>

                        <Form.Item
                            noStyle
                            name="isContractPrice"
                            valuePropName="checked">
                            <Checkbox
                                className="filter-checkbox "
                                style={{ fontSize: 'clamp(14px, 1.7vh, 36px)' }}>
                                Договірна ціна
                            </Checkbox>

                        </Form.Item>
                    </div>

                    {categoryFilters}
                    <hr className="mb-[2vh]" />
                    <div className="flex flex-col gap-[2.5vh] ml-[8vw]">
                        <div className="flex gap-[1.8vw]">
                            <Form.Item
                                name="contactSurname"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Прізвище</div>}
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть прізвище контактної особи</span>
                                    },
                                ]}
                            >
                                <Input
                                    className="h-[5vh] w-[22.9vw] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Прізвище" />

                            </Form.Item>

                            <Form.Item
                                name="contactName"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Ім'я</div>}
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть ім'я контактної особи</span>
                                    },
                                ]}
                            >
                                <Input
                                    className="h-[5vh] w-[22.8vw] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Ім'я" />

                            </Form.Item>
                        </div>

                        <Form.Item
                            name="phoneNumber"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Номер телефону</div>}
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть номер телефону</span>
                                },
                                {
                                    pattern: RegExp('^\\d{3}[-\\s]{1}\\d{3}[-\\s]{1}\\d{2}[-\\s]{0,1}\\d{2}$'),
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Невірно введений телефон!(xxx-xxx-xx-xx) (xxx xxx xx xx) (xxx xxx xxxx) (xxx-xxx-xxxx)</span>
                                },
                            ]}
                        >
                            <Input
                                className="h-[5vh] w-[47.3vw] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Номер телефону" />

                        </Form.Item>

                        <Form.Item
                            name="contactEmail"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Електронна пошта</div>}
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть електронну пошту</span>
                                },
                                {
                                    type: 'email',
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Неправильний формат електронної пошти</span>
                                },

                            ]}
                        >
                            <Input
                                className="h-[5vh] w-[47.3vw] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Електронна пошта" />

                        </Form.Item>

                        <Form.Item
                            name="settlementRef"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Місцезнаходження</div>}
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть місцезнаходження</span>
                                },
                            ]}
                        >
                            <TreeSelect
                                popupClassName="create-advert-select-popup"
                                allowClear
                                showSearch
                                loading={false}
                                style={{ height: '5vh', width: '47.3vw' }}
                                className="create-advert-select"
                                treeData={undefined}
                                placeholder="Місцезнаходження"
                                onChange={() => {}}
                            />
                        </Form.Item>
                    </div>

                    <PrimaryButton
                        title="Завантажити"
                        htmlType="submit"
                        isLoading={false}
                        className="w-[15vw]  ml-[8vw] h-[4.6vh] mt-[3vh]"
                        fontColor="white"
                        fontSize="clamp(14px,1.9vh,36px)"
                        bgColor="#9B7A5B"
                        brColor="#9B7A5B" />
                </Form>





            </div>
        </>)
}

export default CreateAdvert