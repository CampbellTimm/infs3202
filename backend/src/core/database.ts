import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'ap-southeast-2'
});

const USER_TABLE_NAME = 'infs3202_users';
const POSTS_TABLE_NAME = 'infs3202_posts';

export const addCommentToPostInDatabase = async (id: string, email: string, comment: string) => {
  const post = await getPostFromDatabase(id);
  const comments = JSON.parse(post.comments);
  comments.push({
    author: email,
    content: comment,
    datetime: moment().format()
  })
  const params = {
    TableName: POSTS_TABLE_NAME,
    Item: {
       ...post,
       comments: JSON.stringify(comments),
       
    }
  };
  // console.log(params);
  await dynamoDb.put(params).promise();
}

export const getUserFromDatabase = async (email: string) => {
  const params = {
    TableName: USER_TABLE_NAME,
    KeyConditionExpression: 'email = :hkey',
    ExpressionAttributeValues: {
      ':hkey': email,
    }
  };
  // console.log(params);
  const response = await dynamoDb.query(params).promise();
   // @ts-ignore
  return response.Items[0];
}

export const addPostToUserFavourites = async (email: string, id: string) => {
  const user = await getUserFromDatabase(email);
  const favourites = new Set(JSON.parse(user.favourites));
  favourites.add(id)
  const params = {
    TableName: USER_TABLE_NAME,
    Item: {
       ...user,
       favourites: JSON.stringify(Array.from(favourites)),
    }
  };
  // console.log(params);
  await dynamoDb.put(params).promise();
  return {
    ...user,
    favourites: JSON.stringify(Array.from(favourites)),
 };
}

export const updateUserInDatabase = async (email: string, phoneNumber: string, name: string) => {
  const user = await getUserFromDatabase(email);
  const params = {
    TableName: USER_TABLE_NAME,
    Item: {
       ...user,
       phoneNumber,
       name
    }
  };
  // console.log(params);
  await dynamoDb.put(params).promise();
  return user;
}

export const createPostInDatabase = async (id: string, owner: string, title: string, content: string, course: string) => {
  const params = {
    TableName: POSTS_TABLE_NAME,
    Item: {
      id,
      owner,
      title,
      content,
      course,
      comments: '[]'
    }
  };
  await dynamoDb.put(params).promise();
}

const getPostFromDatabase = async (id: string) => {
  const params = {
    TableName: POSTS_TABLE_NAME,
    KeyConditionExpression: 'id = :hkey',
    ExpressionAttributeValues: {
      ':hkey': id,
    }
  };
  const response = await dynamoDb.query(params).promise();
  // @ts-ignore
  return response.Items[0];
}

export const getAllPortsFromDatabase = async () => {
  const params = {
    TableName: POSTS_TABLE_NAME,
  };
  return dynamoDb.scan(params).promise();
}

export const createUserInDatabase = async (email: string, password: string) => {
  const params = {
    TableName: USER_TABLE_NAME,
    Item: {
       email,
       password,
       favourites: JSON.stringify([])
    }
  };
  await dynamoDb.put(params).promise();
}

export const doesUserExistInDatabase = async (email: string): Promise<boolean> => {
  const params = {
    TableName: USER_TABLE_NAME,
    KeyConditionExpression: 'email = :hkey',
    ExpressionAttributeValues: {
      ':hkey': email,
    }
  };
  const response = await dynamoDb.query(params).promise();
  if (!response.Items) {
    return true;
  }
  return !!response.Items.length;
}

export const validateUser = async (email: string, password: string): Promise<boolean> => {
  const params = {
    TableName: USER_TABLE_NAME,
    KeyConditionExpression: 'email = :hkey',
    ExpressionAttributeValues: {
      ':hkey': email,
    }
  };
  const response = await dynamoDb.query(params).promise();
  if (!response.Items || !response.Items.length) {
    return false;
  }
  return response.Items[0].password === password;
}