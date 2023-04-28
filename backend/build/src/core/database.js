"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.doesUserExistInDatabase = exports.createUserInDatabase = exports.getAllPortsFromDatabase = exports.createPostInDatabase = exports.updateUserInDatabase = exports.addPostToUserFavourites = exports.getUserFromDatabase = exports.addCommentToPostInDatabase = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const moment_1 = __importDefault(require("moment"));
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient({
    region: 'ap-southeast-2'
});
const USER_TABLE_NAME = 'infs3202_users';
const POSTS_TABLE_NAME = 'infs3202_posts';
const addCommentToPostInDatabase = async (id, email, comment) => {
    const post = await getPostFromDatabase(id);
    const comments = JSON.parse(post.comments);
    comments.push({
        author: email,
        content: comment,
        datetime: (0, moment_1.default)().format()
    });
    const params = {
        TableName: POSTS_TABLE_NAME,
        Item: {
            ...post,
            comments: JSON.stringify(comments),
        }
    };
    // console.log(params);
    await dynamoDb.put(params).promise();
};
exports.addCommentToPostInDatabase = addCommentToPostInDatabase;
const getUserFromDatabase = async (email) => {
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
};
exports.getUserFromDatabase = getUserFromDatabase;
const addPostToUserFavourites = async (email, id) => {
    const user = await (0, exports.getUserFromDatabase)(email);
    const favourites = new Set(JSON.parse(user.favourites));
    favourites.add(id);
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
};
exports.addPostToUserFavourites = addPostToUserFavourites;
const updateUserInDatabase = async (email, phoneNumber, name) => {
    const user = await (0, exports.getUserFromDatabase)(email);
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
};
exports.updateUserInDatabase = updateUserInDatabase;
const createPostInDatabase = async (id, owner, title, content, course) => {
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
};
exports.createPostInDatabase = createPostInDatabase;
const getPostFromDatabase = async (id) => {
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
};
const getAllPortsFromDatabase = async () => {
    const params = {
        TableName: POSTS_TABLE_NAME,
    };
    return dynamoDb.scan(params).promise();
};
exports.getAllPortsFromDatabase = getAllPortsFromDatabase;
const createUserInDatabase = async (email, password) => {
    const params = {
        TableName: USER_TABLE_NAME,
        Item: {
            email,
            password,
            favourites: JSON.stringify([])
        }
    };
    await dynamoDb.put(params).promise();
};
exports.createUserInDatabase = createUserInDatabase;
const doesUserExistInDatabase = async (email) => {
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
};
exports.doesUserExistInDatabase = doesUserExistInDatabase;
const validateUser = async (email, password) => {
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
};
exports.validateUser = validateUser;
