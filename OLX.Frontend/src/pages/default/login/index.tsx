
import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { ILoginLocalRequest } from '../../../models/account';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'react-toastify';
import { IError } from '../../../models/errors';
import { useSelector } from 'react-redux';
import { useGoogleLoginMutation, useLoginMutation, useSendConfirmEmailMutation } from '../../../redux/api/accountApi';
import { getAuth } from '../../../redux/slices/userSlice';

const loginAction: string = 'login'

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [sendConfEmail] = useSendConfirmEmailMutation();
  const [loginError, setLoginError] = useState<IError | undefined>(undefined)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loginEmail = useRef<string>('')
  const remeber = useRef<boolean>(true)
  const { isAuth, location } = useSelector(getAuth)
  
  useEffect(()=>{ if(isAuth)navigate(location)},[isAuth])

  const glLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin(({ token: tokenResponse.access_token, remember: remeber.current }))
      if (!result.error) {
        toast("Ви успішно увійшли в свій акаунт через", {
          type: "success"
        })
      }
    }
  });

  const sendConfirmEmail = async () => {
    const result = await sendConfEmail(loginEmail.current);
    if (!result.error) {
      toast("Лист підтвердження відправлено на вашу пошту", {
        type: "success"
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
        loginEmail.current = loginModel.email;
        setLoginError(result.error as IError);
      }
      else {
        toast("Ви успішно увійшли в свій акаунт через", {
          type: "success"
        })
      }
    }
  }

 

  return (
    <div id='#login' className=' w-50 mx-auto my-4'>
      <Divider className='fs-5 border-dark-subtle mb-5' orientation="left">Вхід</Divider>
      <Form
        layout='vertical'
        style={{
          maxWidth: 300,
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

        <Button onClick={() => navigate('password')} className='mt-3' color="primary" variant="link">
          Забули пароль ?
        </Button>

        {loginError?.status === 403 &&
          <Button onClick={sendConfirmEmail} color="primary" variant="link">Надіслати лист для підтвердження</Button>
        }
      </Form>

    </div>
  )
}
export default LoginPage;