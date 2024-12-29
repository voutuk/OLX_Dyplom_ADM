
import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { ILoginRequest } from '../../models/account';
import { useGoogleLoginMutation, useLoginMutation, useSendConfirmEmailMutation } from '../../services/accountService';
import { ILoginErrorData } from '../../models/Errors';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdmin, isUser } from '../../store/slices/userSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { APP_ENV } from '../../constants/env';

const loginAction: string = 'login'

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const admin = useSelector(isAdmin)
  const user = useSelector(isUser)
  const [login] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [sendConfEmail] = useSendConfirmEmailMutation();
  const [loginError, setLoginError] = useState<ILoginErrorData | undefined>(undefined)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loginEmail = useRef<string>('')
  const remeber = useRef<boolean>(true)

  const glLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin(({ token: tokenResponse.access_token, remember: remeber.current }))
      if (result.error) {
        message.error('Сталася помилка...')
      }
      else {
        message.success('Ви успішно увійшли в свій акаунт')
      }
    }
  });

  const sendConfirmEmail = async () => {
    const result = await sendConfEmail(loginEmail.current);
    if (result.error) {
      message.error('Сталася помилка при відправці листа підтвердження...')
    }
    else {
      message.success('Лист підтвердження відправлено на вашу пошту')
    }
  }


  const onFinish = async (loginModel: ILoginRequest) => {
    setLoginError(undefined)
    if (executeRecaptcha) {
      loginModel.recapthcaToken = await executeRecaptcha(loginAction);
      loginModel.action = loginAction
      const result = await login(loginModel);
      if (result.error) {
        loginEmail.current = loginModel.email;
        setLoginError(result.error as ILoginErrorData);
      }
      else {
        message.success('Ви успішно увійшли в свій акаунт')
      }
    }

  }

  useEffect(() => {
    if (admin) {
      navigate('/admin')
    }
    else if (user) {
      navigate('/')
    }
  }, [admin, user])

  return (
    <div className=' w-50 mx-auto my-4'>
      <Divider className='fs-5 border-dark-subtle mb-5' orientation="left">Вхід</Divider>
      <Form
        layout='vertical'
        style={{
          maxWidth: 300,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        className='mx-auto text-center'
      //autoComplete="off"
      >
        <Form.Item
          label="Електронна пошта"
          name="email"
          rules={[
            {
              required: true,
              message: "Будьласка введіть eлектронну пошту!",
            },
            {
              type: 'email',
              message: "Невірно введена пошта!",
            },
          ]}
        >
          <Input type='large' />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            {
              required: true,
              message: 'Будьласка введіть пароль!',
            },
          ]}
        >
          <Input.Password type='large' />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
        >
          <Checkbox onChange={(event) => { remeber.current = event.target.checked }} defaultChecked>Запам'ятати мене</Checkbox>
        </Form.Item>

        <Button className='mt-3' style={{ width: 200 }} type="primary" htmlType="submit">
          Увійти
        </Button>

        <Button className='mt-3' onClick={() => glLogin()} style={{ width: 200 }} type="primary" >
          Увійти з Google
        </Button>



        <Button onClick={() => navigate('/password/forgot')} className='mt-3' color="primary" variant="link">
          Забули пароль ?
        </Button>

        <div hidden={!loginError} className='flex flex-col text-red-500 text-xs'>
          <span className=' mt-4'>{loginError?.data.message || loginError?.data.Message}</span>
          {loginError?.data.UnlockTime &&
            <span>До {new Date(loginError?.data.UnlockTime).toLocaleDateString()} {new Date(loginError?.data.UnlockTime).toLocaleTimeString()}</span>
          }

          {loginError?.status === 403 &&
            <Button onClick={sendConfirmEmail} color="primary" variant="link">Надіслати лист для підтвердження</Button>
          }

        </div>
      </Form>

    </div>
  )
}
export default LoginPage;