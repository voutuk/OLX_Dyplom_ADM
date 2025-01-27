import { Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSendPasswordResetEmailMutation } from "../../../../redux/api/accountApi";
import PrimaryButton from "../../../../components/primary_button";
import { Images } from "../../../../constants/images";
import FormInput from "../../../../components/form_input";
import { LeftOutlined } from '@ant-design/icons';

const ForgotPasswordPage: React.FC = () => {
  const [passFogot, { isLoading }] = useSendPasswordResetEmailMutation()
  const navigate = useNavigate();

  const sendPassResetEmail = async (formResult: { email: string }) => {
    const result = await passFogot(formResult.email);
    if (!result.error) {
      toast("Лист відновлененя паролю відправлено на вашу пошту", {
        type: "success"
      })
      
    }
  }

  return (
    <div className="flex h-screen w-screen  justify-between">
      <div className="w-[50%] h-[100%]">
        <img className="w-[100%] h-[100%] object-cover" src={Images.loginImage} />
      </div>
      <div className="mx-auto my-auto w-[24%] text-center">
        <div className="flex flex-col gap-2 mb-[8vh] text-center">
          <span className="font-unbounded text-adaptive-login-header-text ">Забули пароль?</span>
          <span className="font-montserrat text-adaptive-text">Не хвилюйтесь, ми надішлемо електронний лист з підтвердженням скидання паролю</span>
        </div>
        <Form
          className='w-full'
          layout='vertical'
          initialValues={{
            remember: true
          }}
          onFinish={sendPassResetEmail}
        >
          <FormInput
            className='h-[5vh] min-h-[35px] mb-[2vh] text-adaptive-input-form-text text-[#9B7A5B]'
            label='Електронна пошта'
            name='email'
            placeholder='example@gmail.com'
            rules={[
              { required: true, message: 'Будь ласка, введіть електронну пошту' },
              { type: 'email', message: 'Неправильний формат електронної пошти' }
            ]} />
          <PrimaryButton
            htmlType='submit'
            className='w-full h-[5vh] mb-[8vh]'
            title='Скинути пароль'
            isLoading={isLoading} />
        </Form>
        <Button onClick={() => navigate(-1)} className='text-[#3A211C] text-adaptive-input-form-error-text shadow-none font-montserrat border-none  ml-[5px]' variant="link">
          <div className='flex gap-2 items-center'>
            <LeftOutlined className='text-black text-adaptive-input-form-error-text' />
            Назад
          </div>
        </Button>
      </div>
    </div >
  );
};

export default ForgotPasswordPage;