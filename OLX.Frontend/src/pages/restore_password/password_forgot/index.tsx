import { Button, Form, Input } from "antd";
import { useSendPasswordResetEmailMutation } from "../../../services/accountService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordPage: React.FC = () => {
  const [passFogot] = useSendPasswordResetEmailMutation()
  const navigator = useNavigate();

  const sendPassResetEmail = async (formResult: { email: string }) => {
    const result = await passFogot(formResult.email);
    if (!result.error) {
      toast("Лист відновлененя паролю відправлено на вашу пошту", {
        type: "success"
      })
      navigator('/')
    }
  }

  return (
    <Form
      layout='vertical'
      style={{
        maxWidth: 300,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={sendPassResetEmail}
      className='mx-auto text-center'
      autoComplete="off"
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

      <Button className='mt-3' style={{ width: 200 }} type="primary" htmlType="submit">
        Надіслати
      </Button>
    </Form>
  );
};

export default ForgotPasswordPage;