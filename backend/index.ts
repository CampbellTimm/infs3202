import express from "express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { setupUserEnpoints } from "./src/rest/users";
import { setupPostsEndpoint } from "./src/rest/posts";
import {Express, Request, Response} from "express";
import fs from 'fs';
import https from 'https';

const uiUrl = 'http://infs3202-s4479445.s3-website-ap-southeast-2.amazonaws.com';
// const uiUrl = 'http://localhost:3000';

const MY_KEY_LOCATION = path.join(process.cwd(), './keys/private.key');
const MY_CERT_LOCATION = path.join(process.cwd(), './keys/certificate.crt');
const MY_CHAIN_LOCATION = path.join(process.cwd(), './keys/ca_bundle.crt');

const key = fs.readFileSync(MY_KEY_LOCATION, 'utf8');
const cert = fs.readFileSync(MY_CERT_LOCATION, 'utf8');
const ca = fs.readFileSync(MY_CHAIN_LOCATION, 'utf8');

const app = express();
app.use(express.json());
app.use(express.json());
app.use(cors({ credentials: true, origin: uiUrl}))
app.use(cookieParser("secret"))
app.options('*', cors({ credentials: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(
  fileUpload({})
);

setupUserEnpoints(app);
setupPostsEndpoint(app);

app.get('/', (request: Request, response: Response) => {
  response.send("Good");
});

https.createServer({
  key,
  cert,
  ca
}, app).listen(443, () => {
  console.log('started');
});
