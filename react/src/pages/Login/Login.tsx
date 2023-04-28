import React from "react";
import { Typography, Button, Switch } from 'antd';
import {
  Form,
  Input
} from 'antd';

interface Props {
  email: string,
  setEmail: any,
  password: string,
  setPassword: any,
  login: any
}

const { Item } = Form;

const { Title } = Typography;
const { Password } = Input;


const Login = (props: Props) => {

  const onFinish = async (e: any) => {
    console.log(e);
    const { email, password, rememberMe } = e;

    await props.login(email, password, rememberMe);
  }


  const [form] = Form.useForm();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
    <div style={{ width: 500 }}>
      <Title level={1}>
        Login
      </Title>
      <Form
        form={form}
        name="loginAccount"
        onFinish={onFinish}
        style={{ maxWidth: 500 }}
      >
        <Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'Please input a valid email',
            },
            {
              required: true,
              message: "Please add your email account"
            }
          ]}
        >
          <Input />
        </Item>
        <Item
          name="password"
          label="Password"
          rules={[
            {
              message: 'Please add a password',
              required: true,
            },
          ]}
        >
        <Password />
      </Item>
      <Item
        name="rememberMe"  
        label="Remember Me"
      > 
        <Switch />
      </Item>
      <Item >
        <Button 
          type="primary" 
          htmlType="submit"
          >
          Login
        </Button>
      </Item>
      </Form>

    </div>
    </div>
  )
}

export default Login;