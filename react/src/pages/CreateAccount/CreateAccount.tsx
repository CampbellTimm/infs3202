import React from "react";
import { Image, Typography, Divider, Button } from 'antd';
import {
  Form,
  Input,
  message
} from 'antd';
import axios from "axios";
import { API_URL } from "../../constants";
import { createAccount } from "../../util/api";
import { useNavigate } from "react-router-dom";

const { Item } = Form;

const { Title } = Typography;
const { Password } = Input;

interface Props {
  navigate: any
}

interface State {}


// @ts-ignore
const CreateAccount: React.FC = ({ navigate }: Props) =>  {


  const onFinish = async (e: any) => {
    const { email, password } = e;
    const created = await createAccount(email, password);
    if (created) {
      navigate('/login');
    }
  }

  const [form] = Form.useForm();

  return (
    <div style={{  width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
    <div style={{ width: 500 }}>
      <Title level={1}>
        Create Account
      </Title>
      <Form
        form={form}
        name="createAccount"
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
      <Item >
        <Button 
          type="primary" 
          htmlType="submit"
          >
          Create Account
        </Button>
      </Item>
      </Form>
    </div>
    </div>
  )
}

export default CreateAccount;