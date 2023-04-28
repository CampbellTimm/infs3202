import React, { useEffect, useState } from "react";
import { Image, Typography, Divider, Button } from 'antd';
import { API_URL } from "../../constants";
import { createAccount, favouritePost, getFavouritesForUser, getPostsFromApi } from "../../util/api";
import { FloatButton } from 'antd';
import {HeartOutlined, PlusOutlined} from '@ant-design/icons';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { getUserAvatar } from "../../util/util";
import { v4 as uuidv4 } from 'uuid';
import { renderPosts } from "../Courses/Courses";

const { Meta } = Card;

const { Title } = Typography;

const Favourites: React.FC = (props: any) => {

  const [posts, setPosts]: [any, any] = useState([]);
  const [favourites, setFavourites]: [any, any] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getPostsFromApi();
      setPosts(data);
      
    }
    const getFavourites = async () => {
      const favourites = await getFavouritesForUser(props.email);
      setFavourites(favourites)
    }
    getPosts();
    getFavourites();
  }, [])

  // console.log(props);


  const filteredPosts = posts.filter(post => {
    return !!favourites.find(id => id === post.id)
  });

  console.log(posts);
  console.log(favourites);
  console.log(filteredPosts);

  return (
    <div style={{  width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <div>
        <Title level={1}>
          Favourites
        </Title>
        {renderPosts(filteredPosts || [], props.email, props.navigate)}
      </div>
    </div>
  )
}

export default Favourites;