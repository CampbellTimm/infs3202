import React from "react";
import { Image, Typography, Divider, Button, Upload } from 'antd';
import {
  Form,
  Input,
  message
} from 'antd';
import axios from "axios";
import { API_URL } from "../../constants";
import { createAccount, createPost } from "../../util/api";
import { FloatButton } from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import { useParams } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const { Item } = Form;

const { Dragger } = Upload;

const CreateCourse: React.FC = (props: any) => {

  const { id } = useParams();
  
  const onFinish = async (e: any) => {
    console.log(e);
    const { title, content, course } = e;

    await createPost(id as string, props.email, title, content, course);
    props.navigate('/courses')
  }


  const [form] = Form.useForm();

  return (
    <div style={{  width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
    <div>
      <Title level={1}>
        Create Post
      </Title>
      <Form
        form={form}
        name="loginAccount"
        onFinish={onFinish}
        style={{ maxWidth: 500 }}
      >
         <Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please add a title for your post"
            }
          ]}
        >
          <Input />
        </Item>
        <Item
          name="course"
          label="Course"
          rules={[
            {
              required: true,
              message: "Please add a course for your post"
            }
          ]}
        >
          <Input />
        </Item>
        <Item
          name="content"
          label="Content"
          rules={[
            {
              required: true,
              message: "Please add a course for your post"
            }
          ]}
        >
          <TextArea />
        </Item>
        <Dragger 
          name={"postUpload"}
          action={API_URL + `/posts/${id}/upload`}
          multiple={true}
          style={{ width: 500 }}
          onChange={async (info) => {
            console.log(info)
            // @ts-ignore
            if (info.file.status === 'done') {
              message.success(`Files uploaded successfully. Refresh page to see the images`);
                // @ts-ignore
            } else if (info.file.status === 'error') {
              message.error(`File upload failed.`);
            }
          }}
        >
           Upload one or more images to the post <UploadOutlined />
        </Dragger>
        <br />

      <Item >
        <Button 
          type="primary" 
          htmlType="submit"
          >
          Create
        </Button>
      </Item>
      </Form>
    </div>
    </div>
  )
}

export default CreateCourse;