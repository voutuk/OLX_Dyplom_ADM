import React, { useRef, useState } from 'react'
import { Button, Checkbox, Divider, Form } from 'antd';
import { ILoginLocalRequest } from '../../../models/account';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'react-toastify';
import { IError, IUserLockoutError } from '../../../models/errors';
import { useGoogleLoginMutation, useLoginMutation, useSendConfirmEmailMutation } from '../../../redux/api/accountApi';
import PrimaryButton from '../../../components/primary_button';
import FormInput from '../../../components/form_input';

const loginAction: string = 'login'

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [sendConfEmail] = useSendConfirmEmailMutation();
  const [loginError, setLoginError] = useState<IError | undefined>(undefined)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loginEmail = useRef<string | undefined>('')
  const remeber = useRef<boolean>(true)

  const glLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin(({ token: tokenResponse.access_token, remember: remeber.current }))
      if (!result.error) {
        toast("Ви успішно увійшли в свій акаунт", {
          type: "success"
        })
      }
      else {
        loginEmail.current = ((result.error as IError).data as IUserLockoutError)?.Email || undefined;
        setLoginError(result.error as IError);
      }
    }
  });

  const sendConfirmEmail = async () => {
    if (loginEmail.current) {
      const result = await sendConfEmail(loginEmail.current);
      if (!result.error) {
        setLoginError(undefined)
        toast("Лист підтвердження відправлено на вашу пошту", {
          type: "success"
        })
      }
    }
    else {
      toast("Сталася помилка при відправці листа підтвердження", {
        type: "error"
      })
    }

  }

  const onFinish = async (loginModel: ILoginLocalRequest) => {
    setLoginError(undefined)
    if (executeRecaptcha) {
      loginModel.recapthcaToken = await executeRecaptcha(loginAction);
      loginModel.action = loginAction
      const result = await login(loginModel);
      if (result.error) {
        loginEmail.current = ((result.error as IError)?.data as IUserLockoutError)?.Email || undefined;
        setLoginError(result.error as IError);
      }
      else {
        toast("Ви успішно увійшли в свій акаунт", {
          type: "success"
        })
      }
    }
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="w-[40%] h-[100%]">
         <img className="w-[100%] h-[100%]" src='src\assets\images\login_leftSide.png'/>
      </div>
      <div id='#login' className="w-[60%] flex flex-col items-center justify-center text-center">
        <h2 className='w-[460px] text-[#3A211C] mb-[50px] font-unbounded text-[36px] font-normal'>З поверненням!</h2>
        <Form
          layout='vertical'
          style={{
            maxWidth: 300,
          }}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          className='w-[460px]'
        >
          <FormInput label='Електронна пошта' name='email' placeholder='example@gmail.com' ruleType='email' requiredMessage='Будь ласка, введіть електронну пошту' typeMessage='Неправильно введена пошта' />
          <FormInput label='Пароль' name='password' placeholder='eXampLe_3' requiredMessage='Будь ласка, введіть пароль' />

          <div className='flex justify-between'>
            <Form.Item
              name="remember"
              valuePropName="checked"
            >
              <Checkbox onChange={(event) => { remeber.current = event.target.checked }}>запам'ятати мене</Checkbox>
            </Form.Item>

            <Button onClick={() => navigate('password')} className='text-[#3A211C] font-montserrat border-none underline forget-password' variant="link">
              забули пароль?
            </Button>
          </div>

          <PrimaryButton title='Увійти' htmlType='submit' isLoading={isLoading}/>
          <Divider style={{ color: '#9B7A5B', fontWeight: '400' }}>або</Divider>
          <PrimaryButton title='Увійти з Google' onButtonClick={glLogin} isLoading={isGoogleLoading} />


          {loginError?.status === 403 &&
            <Button onClick={sendConfirmEmail} color="primary" variant="link">Надіслати лист для підтвердження</Button>
          }
        </Form>
      </div>
    </div>
  )
}
export default LoginPage;