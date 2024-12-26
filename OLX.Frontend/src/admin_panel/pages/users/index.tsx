
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Form, Input, message } from 'antd';
import { ILoginRequest } from '../../../models/account';
import { useLoginMutation } from '../../../services/accountService';




const LoginPage: React.FC = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate()

  const onFinish = async (loginModel: ILoginRequest) => {
    const result = await login(loginModel);
    if (result.error) {
      console.log(result.error)
    }
    else {
      navigate('/admin/users');
      message.success('Ви успішно увійшли в свій акаунт')
    }
  }
  return (
    <>
      <div className=' w-50 mx-auto my-4'>
        <Divider className='fs-5 border-dark-subtle mb-5' orientation="left">Вхід адміністратора</Divider>
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
          <Button className='mt-3' style={{ width: 200 }} type="primary" htmlType="submit">
            Увійти
          </Button>

        </Form>
      </div>
    </>
  )
}
export default LoginPage;