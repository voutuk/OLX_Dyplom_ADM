import { useNavigate, useParams } from "react-router-dom";
import AdvertCard from "../../../components/advert_card";
import { BackButton } from "../../../components/buttons/back_button"
import { APP_ENV } from "../../../constants/env";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import { Form, Input, Radio } from "antd";
import { app_regex } from "../../../constants/regex";
import LocationSelector from "../../../components/location_selector";
import { useAppSelector } from "../../../redux";
import PrimaryButton from "../../../components/buttons/primary_button";
import '../../../components/price_filter/style.scss'

const BuyAdvertPage: React.FC = () => {
    const user = useAppSelector(state => state.user.user)
    const { id } = useParams();
    const { data: advert } = useGetAdvertByIdQuery(Number(id))
    const navigate = useNavigate();
    const onFinish = (data: any) => {
        console.log(data);
        navigate( `/user/advert/payment/${id}`);
    }
    return (
        <div className="w-[100%] gap-[5vh] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text my-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            <div className="flex gap-[8vw]">
                <AdvertCard
                    id={Number(id)}
                    image={APP_ENV.IMAGES_400_URL + advert?.images.find(x => x.priority === 0)?.name}
                    title={advert?.title || ''}
                    price={advert?.price || 0}
                    settlement={advert?.settlementName || ''}
                    isFavorite={false}
                />
                <div className="flex flex-col w-[47.3vw]">
                    <h1 className="font-unbounded text-adaptive-3_35-text mb-[7vh]">Купити з доставкою</h1>
                    <div className="flex flex-col gap-[.6vh]">
                        <span className="font-unbounded font-medium text-adaptive-1_7_text">Контактні дані</span>
                        <span className="font-montserrat text-adaptive-1_7_text">Заповніть контактні дані отримувача</span>
                    </div>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            lastName: user?.lastName,
                            firstName: user?.firstName,
                            phoneNumber: user?.phone,
                            email: user?.email,
                            settlementRef: user?.settlement
                        }}>
                        <div className='grid grid-cols-2 gap-y-[1.2vw]  gap-x-[2.1vw] mt-[2.8vh]'>
                            <Form.Item
                                name="lastName"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Прізвище</div>}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть прізвище</span>
                                    },
                                ]}
                            >
                                <Input
                                    className="h-[5vh]   font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Прізвище" />

                            </Form.Item>
                            <Form.Item
                                name="firstName"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Ім'я</div>}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть ім'я</span>
                                    },
                                ]}
                            >
                                <Input
                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Ім'я" />

                            </Form.Item>
                            <Form.Item
                                name="phoneNumber"
                                className="w-full"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Номер телефону</div>}
                                rules={[
                                    {
                                        pattern: RegExp(app_regex.phone),
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Невірно введений телефон!(xxx-xxx-xx-xx) (xxx xxx xx xx) (xxx xxx xxxx) (xxx-xxx-xxxx)</span>
                                    },
                                ]}
                            >
                                <Input
                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Номер телефону" />

                            </Form.Item>
                            <Form.Item
                                name="email"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Електронна пошта</div>}
                                className="w-full"
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
                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Електронна пошта" />

                            </Form.Item>
                            <Form.Item
                                name="settlementRef"
                                className="w-full"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Місто/Населений пункт</div>}
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть населений пункт</span>
                                    }
                                ]}
                            >
                                <LocationSelector
                                    height="5vh"
                                    width="100%"
                                    placeholder="Місто/Населений пункт" />

                            </Form.Item>
                        </div>
                        <span className="font-montserrat text-adaptive-1_7_text">*Поля обов’язкові для заповнення</span>
                        <div className="flex flex-col mt-[12.5vh] gap-[.6vh]">
                            <span className="font-unbounded font-medium text-adaptive-1_7_text">Служба доставки</span>
                            <span className="font-montserrat text-adaptive-1_7_text">Оберіть спосіб отримання замовлення</span>
                        </div>

                        <Form.Item
                            name='delivery'
                            noStyle
                        >
                            <Radio.Group defaultValue={"Укрпошта"} className="flex gap-[3.3vw] mt-[4vh] ">
                                <div className="flex flex-col gap-[.5vh] ">
                                    <Radio className="big-radio" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }} key={"Укрпошта"} value={"Укрпошта"}>Укрпошта</Radio>
                                    <div className="font-montserrat text-adaptive-1_7_text ml-[1.7vw]">Безкоштовна доставка</div>
                                </div>
                                <div className="flex flex-col gap-[.5vh]">
                                    <Radio className="big-radio" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }} key={"Нова Пошта"} value={"Нова Пошта"}>Нова Пошта</Radio>
                                    <div className="font-montserrat text-adaptive-1_7_text ml-[1.7vw]">Доставка від 60 грн</div>
                                </div>
                                <div>
                                    <Radio className="big-radio" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }} key={"Самовиві"} value={"Самовиві"}>Самовивіз</Radio>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                        <PrimaryButton
                            title='Перейти до оплати'
                            htmlType="submit"
                            isLoading={false}
                            className="w-[22.6vw]  h-[4.6vh] my-[15vh]"
                            fontColor="white"
                            fontSize="clamp(14px,1.9vh,36px)"
                            bgColor="#9B7A5B"
                            brColor="#9B7A5B" />
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default BuyAdvertPage