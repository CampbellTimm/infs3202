import React, { useEffect, useState } from "react";
import { Image, Typography, Divider, Button, Upload, Avatar } from 'antd';
import {
  Form,
  Input,
  message
} from 'antd';
import axios from "axios";
import { API_URL } from "../../constants";
import { addCommentToPost, createAccount, createPost, getPostsFromApi } from "../../util/api";
import { FloatButton } from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import { useParams } from "react-router-dom";
import { renderPost } from "../Courses/Courses";
import { Comment } from '@ant-design/compatible'
import { List, Tooltip } from 'antd';
import moment from "moment";

const { Title } = Typography;
const { TextArea } = Input;


const renderComments = (comments: any[]) => {
  return (
    <List
      itemLayout={"horizontal"}
      dataSource={comments}
      renderItem={comment => (
        <li>
          <Comment
            actions={[]}
            avatar={API_URL + `/avatars/${comment.author}`}
            author={comment.author}
            content={comment.content}
            datetime={moment(comment.datetime).fromNow()}
          />
        </li>
      )}
    />
  )
}

const Comments: React.FC = (props: any) => {

  const [post, setPost]: [any, any] = useState(null);
  const [commentText, setCommentText]: [any, any] = useState('');
  const { id } = useParams();
  
  const downloadPost = async () => {
    const data = await getPostsFromApi();
    const post = data.find(x => x.id === id);
    setPost(post);
  }

  useEffect(() => {
    downloadPost();
  }, [])

  const addComment = async () => {
    await addCommentToPost(post.id, props.email, commentText);
    await downloadPost();
  }

  const onChange = (e) => {
    const { value } = e.target;
    setCommentText(value);
  }

  return (
    <div style={{  width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <div>
      <Title level={1}>
        Post Comments
      </Title>
      {post && renderPost(post, props.email, props.navigate, false)}
      {((post && post.comments) || []).length} Comments
      {post && renderComments(post.comments)}
      
      <Comment
        avatar={<Avatar src={API_URL + `/avatars/${props.email}`} />}
        content={<div>
           <TextArea rows={4} onChange={onChange} value={commentText} />
           <br />
        <Button htmlType="submit" loading={false} onClick={addComment} type="primary">
          Add Comment
        </Button>
        </div>}
      />
     
      </div>
    </div>
  )

}


export default Comments;