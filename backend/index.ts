import express from "express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { setupUserEnpoints } from "./src/rest/users";
import { setupPostsEndpoint } from "./src/rest/posts";

const uiUrl =  'http://localhost:3000';

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

app.listen(4000);

console.log('Started')