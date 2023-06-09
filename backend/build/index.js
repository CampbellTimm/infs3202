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
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const uiUrl = 'http://infs3202-s4479445.s3-website-ap-southeast-2.amazonaws.com';
// const uiUrl = 'http://localhost:3000';
const MY_KEY_LOCATION = path_1.default.join(process.cwd(), './keys/private.key');
const MY_CERT_LOCATION = path_1.default.join(process.cwd(), './keys/certificate.crt');
const MY_CHAIN_LOCATION = path_1.default.join(process.cwd(), './keys/ca_bundle.crt');
const key = fs_1.default.readFileSync(MY_KEY_LOCATION, 'utf8');
const cert = fs_1.default.readFileSync(MY_CERT_LOCATION, 'utf8');
const ca = fs_1.default.readFileSync(MY_CHAIN_LOCATION, 'utf8');
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
https_1.default.createServer({
    key,
    cert,
    ca
}, app).listen(443, () => {
    console.log('started');
});
