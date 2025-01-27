import React from 'react'
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Images } from '../../../../constants/images';
import PrimaryButton from '../../../../components/primary_button';
import { LeftOutlined } from '@ant-design/icons';

const PasswordChangeConfirmPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-screen w-screen  justify-between">
            <div className="w-[50%] h-[100%]">
                <img className="w-[100%] h-[100%] object-cover" src={Images.loginImage} />
            </div>
            <div className="mx-auto flex flex-col gap-[6vh]  w-[24%] justify-center text-center">
                <h2 className='text-[#3A211C]  font-unbounded text-adaptive-text font-medium'>На вашу електронну пошту направлено лист для зміни паролю</h2>
                <PrimaryButton
                    title='На головну'
                    onButtonClick={() => navigate('/')}
                    className='w-full h-[5vh]' isLoading={false}
                />
                <Button onClick={() => navigate(-1)} className='text-[#3A211C] text-adaptive-input-form-error-text shadow-none font-montserrat border-none  ml-[5px]' variant="link">
                    <div className='flex gap-2 items-center'>
                        <LeftOutlined className='text-black text-adaptive-input-form-error-text' />
                        Назад
                    </div>
                </Button>
            </div>
        </div >
    )
}
export default PasswordChangeConfirmPage;