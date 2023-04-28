"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPostsEndpoint = void 0;
const database_1 = require("../core/database");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const users_1 = require("./users");
const createPost = async (request, response) => {
    const { id, owner, title, content, course } = request.body;
    await (0, database_1.createPostInDatabase)(id, owner, title, content, course);
    response.statusMessage = 'Successsfully created post';
    response.status(200).send();
};
const uploadImageForPost = async (request, response) => {
    const { id } = request.params;
    try {
        fs_1.default.mkdirSync(path_1.default.join(process.cwd(), `/public/posts/${id}`));
    }
    catch (err) { }
    // @ts-ignore
    await request.files.postUpload.mv(path_1.default.join(process.cwd(), `/public/posts/${id}/${request.files.postUpload.name}`));
    response.status(200).send();
};
const getAllPosts = async (request, response) => {
    const data = await (0, database_1.getAllPortsFromDatabase)();
    const posts = (data.Items || []).map(post => {
        const images = fs_1.default.readdirSync(path_1.default.join(process.cwd(), `/public/posts/${post.id}`));
        console.log(images);
        return {
            ...post,
            images,
            comments: JSON.parse(post.comments)
        };
    });
    response.status(200).send(posts);
};
const favouritePost = async (request, response) => {
    const { email, id } = request.body;
    const user = await (0, database_1.addPostToUserFavourites)(email, id);
    const { name, phoneNumber, favourites, password } = user;
    response.cookie("userDetails", JSON.stringify({ email, password, name, phoneNumber, favourites: JSON.parse(favourites) }), users_1.cookieOptions);
    response.statusMessage = 'Saved post to favourites';
    response.status(200).send();
};
const addCommentToPost = async (request, response) => {
    const { id, email, comment } = request.body;
    await (0, database_1.addCommentToPostInDatabase)(id, email, comment);
    response.statusMessage = 'Comment added';
    response.status(200).send();
};
const setupPostsEndpoint = (app) => {
    app.post('/posts/create', createPost);
    app.get('/posts', getAllPosts);
    app.post('/posts/favourite', favouritePost);
    app.post('/posts/:id/upload', uploadImageForPost);
    app.post('/posts/comment', addCommentToPost);
};
exports.setupPostsEndpoint = setupPostsEndpoint;
