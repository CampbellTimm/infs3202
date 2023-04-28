import {Express, Request, Response} from "express";
import { addCommentToPostInDatabase, addPostToUserFavourites, createPostInDatabase, createUserInDatabase, doesUserExistInDatabase, getAllPortsFromDatabase } from "../core/database";
import fs from "fs";
import path from "path";
import { cookieOptions } from "./users";

const createPost = async (request: Request, response: Response) => {
  const { id, owner, title, content, course } = request.body;
  await createPostInDatabase(id, owner, title, content, course);

  response.statusMessage = 'Successsfully created post';
  response.status(200).send();
}

const uploadImageForPost = async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    fs.mkdirSync(path.join(process.cwd(), `/public/posts/${id}`));
  } catch (err) {}

  // @ts-ignore
  await request.files.postUpload.mv(path.join(process.cwd(), `/public/posts/${id}/${request.files.postUpload.name}`));
  response.status(200).send();
}


const getAllPosts = async (request: Request, response: Response) => {
  const data = await getAllPortsFromDatabase();

  const posts = (data.Items || []).map(post => {
    const images = fs.readdirSync(path.join(process.cwd(), `/public/posts/${post.id}`));
    console.log(images);
    return {
      ...post,
      images,
      comments: JSON.parse(post.comments)
    }
  });

  response.status(200).send(posts);
}

const favouritePost = async (request: Request, response: Response) => {
  const { email, id } = request.body;
  const user: any = await addPostToUserFavourites(email, id);
  const { name, phoneNumber, favourites, password } = user;

  response.cookie("userDetails", JSON.stringify({ email, password, name, phoneNumber, favourites: JSON.parse(favourites) }), cookieOptions);


  response.statusMessage = 'Saved post to favourites';
  response.status(200).send();
}



const addCommentToPost = async (request: Request, response: Response) => {
  const { id, email, comment } = request.body;
  await addCommentToPostInDatabase(id, email, comment);
  response.statusMessage = 'Comment added';
  response.status(200).send();
}

export const setupPostsEndpoint = (app: Express) => {
  app.post('/posts/create', createPost);
  app.get('/posts', getAllPosts);
  app.post('/posts/favourite', favouritePost);
  app.post('/posts/:id/upload', uploadImageForPost);
  app.post('/posts/comment', addCommentToPost);
}