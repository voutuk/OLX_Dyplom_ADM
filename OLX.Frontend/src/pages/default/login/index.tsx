
import React, { useRef, useState } from 'react'
import { Button, Checkbox, Divider, Form, Input } from 'antd';
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
    <div id='#login' className=' w-50 mx-auto my-4'>
      <Divider className='fs-5 border-dark-subtle mb-5' orientation="left">Вхід</Divider>
      <Form
        layout='vertical'
        style={{
          maxWidth: 300,
        }}
        initialValues={{
          remember: true
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
        
        <FormInput label='Електронна пошта' name='email' placeholder='example@gmail.com' ruleType='email' typeMessage='Будь ласка, введіть електронну пошту' requiredMessage='Неправильно введена пошта'/>
        <FormInput label='Пароль' name='password' placeholder='eXampLe_3' requiredMessage='Будь ласка, введіть пароль'/>
        <Form.Item
          name="remember"
          valuePropName="checked"
        >
          <Checkbox onChange={(event) => { remeber.current = event.target.checked }}>Запам'ятати мене</Checkbox>
        </Form.Item>

        
        <PrimaryButton title='Увійти' htmlType='submit' isLoading={isLoading}/>
        <PrimaryButton title='Увійти з Google' onButtonClick={glLogin} isLoading={isGoogleLoading}/>

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