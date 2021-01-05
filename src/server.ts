import App from './app';
import PostsController from './posts/posts.controller';
import * as mongoose from 'mongoose';
import 'dotenv/config';

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
} = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`

mongoose.connect(uri, options);


const app = new App(
  [
    new PostsController(),
  ],
  5000,
);

app.listen();
