"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = require("./src/rest/users");
const posts_1 = require("./src/rest/posts");
const uiUrl = 'http://localhost:3000';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: uiUrl }));
app.use((0, cookie_parser_1.default)("secret"));
app.options('*', (0, cors_1.default)({ credentials: true }));
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
app.use((0, express_fileupload_1.default)({}));
(0, users_1.setupUserEnpoints)(app);
(0, posts_1.setupPostsEndpoint)(app);
app.get('/', (request, response) => {
    response.send("Good");
});
app.listen(80);
console.log('Started');
