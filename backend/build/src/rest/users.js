"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserEnpoints = exports.cookieOptions = void 0;
const database_1 = require("../core/database");
const path_1 = __importDefault(require("path"));
const specialCharacters = ['?', '!', '#'];
exports.cookieOptions = {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    signed: true,
    sameSite: 'none'
};
const getFavourites = async (request, response) => {
    const { email } = request.params;
    const user = await (0, database_1.getUserFromDatabase)(email);
    response.status(200).send(JSON.parse(user.favourites));
};
const createAccount = async (request, response) => {
    try {
        const { email, password, } = request.body;
        const specialCharactersMet = specialCharacters.filter(char => password.includes(char));
        if (!specialCharactersMet.length) {
            response.statusMessage = 'Password needs a ?, !, or #';
            response.status(400).send();
            return;
        }
        if (password.length < 8) {
            response.statusMessage = 'Password needs to be length at least 8';
            response.status(400).send();
            return;
        }
        const user = await (0, database_1.doesUserExistInDatabase)(email);
        if (user) {
            response.statusMessage = 'User with email already exists';
            response.status(400).send();
            return;
        }
        await (0, database_1.createUserInDatabase)(email, password);
        response.statusMessage = 'Successsfully created user';
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.statusMessage = 'Unknown error occurred';
        response.status(500).send();
    }
};
const updateAccount = async (request, response) => {
    try {
        const { email, phoneNumber, name } = request.body;
        const { password, favourites } = await (0, database_1.updateUserInDatabase)(email, phoneNumber, name);
        response.cookie("userDetails", JSON.stringify({ email, password, name, phoneNumber, favourites: JSON.parse(favourites) }), exports.cookieOptions);
        response.statusMessage = 'Successsfully updated user';
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.statusMessage = 'Unknown error occurred';
        response.status(500).send();
    }
};
const loginAccount = async (request, response) => {
    const { email, password, rememberMe } = request.body;
    const userValid = await (0, database_1.validateUser)(email, password);
    const user = await (0, database_1.getUserFromDatabase)(email);
    const { name, phoneNumber, favourites } = user;
    if (rememberMe && userValid) {
        response.cookie("userDetails", JSON.stringify({ email, password, name, phoneNumber, favourites: JSON.parse(favourites) }), exports.cookieOptions);
    }
    if (!rememberMe && userValid) {
        response.cookie("userDetails", null, exports.cookieOptions);
    }
    if (userValid) {
        response.statusMessage = "Successfully logged in";
        response.status(200).send({
            ...user,
            favourites: JSON.parse(favourites)
        });
    }
    else {
        response.statusMessage = "Invalid login credentials";
        response.status(400).send();
    }
};
const logout = async (request, response) => {
    // response.clearCookie("userDetails");
    response.cookie("userDetails", null, exports.cookieOptions);
    response.statusMessage = "Successfully logged out";
    response.status(200).send();
};
const getCookieAccount = async (request, response) => {
    const { userDetails } = request.signedCookies;
    console.log(userDetails);
    if (userDetails && !userDetails.includes('j:null')) {
        console.log(request.signedCookies.userDetails);
        console.log(JSON.parse(request.signedCookies.userDetails));
        const { email, phoneNumber, name, favourites } = JSON.parse(request.signedCookies.userDetails);
        response.status(200).send({ email, phoneNumber, name, favourites });
    }
    else {
        response.status(200).send({ email: null, phoneNumber: null, name: null });
    }
};
const uploadAvatar = async (request, response) => {
    console.log(request.params.email);
    console.log(request.files);
    const { email } = request.params;
    // @ts-ignore
    await request.files.avatarUpload.mv(path_1.default.join(process.cwd(), `/public/avatars/${email}`));
    response.status(200).send();
};
const setupUserEnpoints = (app) => {
    app.post('/account/create', createAccount);
    app.post('/account/login', loginAccount);
    app.post('/account/logout', logout);
    app.get('/account/:email/favourites', getFavourites);
    app.patch('/account', updateAccount);
    app.get('/account', getCookieAccount);
    app.post('/account/:email/avatar', uploadAvatar);
};
exports.setupUserEnpoints = setupUserEnpoints;
