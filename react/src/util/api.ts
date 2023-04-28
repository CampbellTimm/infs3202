import {
  Form,
  Input,
  message
} from 'antd';
import axios from "axios";
import { API_URL } from '../constants';

export const getFavouritesForUser = async (email: string) => {
  const response = await axios({
    method: "get",
    url: API_URL + `/account/${email}/favourites`,
    withCredentials: true,
  });
  return response.data;
}

export const updateAccount = async (email: string, phoneNumber: string, name: string) => {
  try {
    const response = await axios({
      method: "patch",
      url: API_URL + "/account",
      withCredentials: true,
      data: {
        email,
        phoneNumber,
        name
      }
    });
    message.success(response.statusText);
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
    return null;
  }
}

export const getPostsFromApi = async () => {
  try {
    const response = await axios({
      method: "get",
      url: API_URL + "/posts",
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
    return null;
  }
}

export const addCommentToPost = async (id: string, email: string, comment: string) => {
  try {
    const response = await axios({
      method: "post",
      url: API_URL + "/posts/comment",
      withCredentials: true,
      data: {
        id,
        email,
        comment
      }
    });
    message.success(response.statusText);
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
    return null;
  }
}

export const createPost = async (id: string, owner: string, title: string, content: string, course: string) => {
  try {
    const response = await axios({
      method: "post",
      url: API_URL + "/posts/create",
      withCredentials: true,
      data: {
        id,
        owner,
        title,
        content,
        course
      }
    });
    message.success(response.statusText);
    return true;
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
    return false;
  }
}


export const getCookieEmail = async (): Promise<any> => {
  try {
    const response = await axios({
      method: "get",
      url: API_URL + "/account",
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    // message.error(err.response.statusText)
    return {};
  }
}

export const favouritePost = async (email: string, id: string) => {
  try {
    const response = await axios({
      method: "post",
      url: API_URL + "/posts/favourite",
      withCredentials: true,
      data: {
        email,
        id
      }
    });
    message.success(response.statusText);
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
  }
  return true;
}

export const logoutAccount = async (): Promise<boolean> => {
  try {
    const response = await axios({
      method: "post",
      url: API_URL + "/account/logout",
      withCredentials: true,
    });
    message.success(response.statusText);
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
  }
  return true;
}

export const loginAccount = async (email: string, password: string, rememberMe: boolean) => {
  try {
    const response = await axios({
      method: "post",
      url: API_URL + "/account/login",
      withCredentials: true,
      data: {
        email,
        password,
        rememberMe
      }
    });
    message.success(response.statusText);
    return response.data;
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
    return false;
  }
}

export const createAccount = async (email: string, password: string) => {
  try {
    const response = await axios({
      method: "post",
      url: API_URL + "/account/create",
      withCredentials: true,
      data: {
        email,
        password
      }
    });
    message.success(response.statusText);
    return true;
  } catch (err) {
    console.log(err);
    message.error(err.response.statusText)
    return false;
  }
}