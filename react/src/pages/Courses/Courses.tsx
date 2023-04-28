import React, { useEffect, useState } from "react";
import { Image, Typography, Divider, Button, Spin, Select } from 'antd';
import { API_URL } from "../../constants";
import { createAccount, favouritePost, getPostsFromApi } from "../../util/api";
import { FloatButton } from 'antd';
import {CommentOutlined, HeartOutlined, PlusOutlined} from '@ant-design/icons';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { getUserAvatar } from "../../util/util";
import { v4 as uuidv4 } from 'uuid';

const { Meta } = Card;

const { Title } = Typography;

interface Props {
  navigate: any,
  email: string
}

export const renderPost = (post: any, email: string, navigate: any, renderActions: boolean = true) => {
  const { content, id, owner, title, course, images, comments } = post;

  const actions = [
    <div 
      style={{ color: 'red' }}  
      onClick={async () => {
        await favouritePost(email, id)
      }}>
      Favourite
      <HeartOutlined style={{ marginLeft: 5}}/>
    </div>,
      <div 
      style={{ color: 'blue' }}  
      onClick={async () => {
        localStorage.setItem("lastPostClicked", id);
        navigate(`/courses/${id}/comments`);
      }}>
      Comments ({comments.length})
      <CommentOutlined style={{ marginLeft: 5}}/>
    </div>,
  ]

  if (owner === email) {
    actions.push(
      <div 
      style={{ color: 'black' }}  
      onClick={async () => {
        navigate(`/post/${id}/edit`)
      }}>
      Edit
      <EditOutlined style={{ marginLeft: 5}}/>
    </div>
    )
  }

  return <Card
   id={id}
    key={id}
    style={{ width: 500, marginBottom: 20 }}
    actions={renderActions ? actions : []}

  >
  <Meta
    avatar={getUserAvatar(owner, 55, 55)}
    title={title}
    description={`Course: ${course}, by ${owner}`}
  />
  < br/>
  {content}
  <br />
  <br />
  <div>
    {images.map(image => { 
      const src = `${API_URL}/posts/${id}/${image}`
      return <Image
      width={130}
      style={{ paddingRight: 3 }}
      height={130}
      src={src}
      fallback="data:image/png;base64,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"
    />
    })}
  </div>
  </Card>
}

export const renderPosts = (posts: any, email: string, navigate: any) => {
  return posts.map(post => {
    return renderPost(post, email, navigate)
  })
}

// @ts-ignore
const MyCourses: React.FC = (props: Props) => {
  const [posts, setPosts]: [any, any] = useState(null);
  const [postFilters, setPostFilters]: [any, any] = useState([]);
  const [courseFilters, setCourseFilters]: [any, any] = useState([]);

  const refreshPosts = async () => {
    setPosts(null);
    const data = await getPostsFromApi();
    setPosts(data);
  }

  useEffect(() => {
    const getPosts = async () => {
      const data = await getPostsFromApi();
      setPosts(data);
      await new Promise(resolve => setTimeout(resolve));
      const lastPostClicked = localStorage.getItem("lastPostClicked");
      if (lastPostClicked) {
        const element = document.getElementById(lastPostClicked);
        (element as any).scrollIntoView({ behavior: 'smooth' });
        localStorage.setItem("lastPostClicked", '');
      }
    }
    getPosts();
  }, [])


  const searchCourses = (e) => {
    setCourseFilters(e);
  }

  const searchPosts = (e) => {
    setPostFilters(e);
  }


  const courseNames = new Set();
  const postNames = new Set();

  posts && posts.forEach(post => {
    courseNames.add(post.course);
    postNames.add(post.title);
  })


  const courseOptions = Array.from(courseNames).map(courseName => {
    return (
      {
        label: courseName,
        value:  courseName,
      }
    )
  })

  const postOptions = Array.from(postNames).map(postName => {
    return (
      {
        label: postName,
        value:  postName,
      }
    )
  })

  const filteredPosts = posts && posts.filter(post => {
    let matches = true;
    if (postFilters.length) {
      const matchesPost = postFilters.find(x => x === post.title);
      if (!matchesPost) {
        matches = false;
      }
    }
    if (courseFilters.length) {
      const matchesCourse = courseFilters.find(x => x === post.course);
      if (!matchesCourse) {
        matches = false;
      }
    }
    return matches;
  })


  return (
    <div style={{  width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <div style={{ minWidth: 500 }}>
        <div style={{  width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Title level={1}>
          Courses
        </Title>
        <Button type="primary" onClick={refreshPosts}>
          Refresh
        </Button>
        </div>
      
      Search by Course: 
      <Select 
        mode="multiple"
        allowClear
        style={{ width: 380, marginLeft: 5 }}
        placeholder="Select courses to search"
        onChange={searchCourses}
        options={courseOptions}
      />
      <br /><br />
      Search by Post: 
      <Select 
        mode="multiple"
        allowClear
        style={{ width: 400, marginLeft: 5 }}
        placeholder="Select posts to search"
        onChange={searchPosts}
        options={postOptions}
      />
      <br /><br />
      <div id="posts">
        {
          filteredPosts
            ? renderPosts(filteredPosts || [], props.email, props.navigate)
            : <Spin />
        }
      </div>
      <FloatButton
        type="primary"
        style={{ marginRight: 50, marginBottom: 30 }}
        icon={<PlusOutlined />}
        onClick={() => props.navigate(`/courses/create/${uuidv4()}`)} 
        />
      </div>
  
    </div>
  )
}

export default MyCourses;