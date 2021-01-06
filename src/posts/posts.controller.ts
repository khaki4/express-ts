import * as express from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./posts.model";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, this.createPost);
  }

  private getAllPosts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const posts = await this.post.find();
    response.send(posts);
  };

  private getPostById = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const post = this.post.findById(id);
    response.send(post);
  };

  private modifyPost = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    const post = this.post.findByIdAndUpdate(id, postData, { new: true });
    response.send(post);
  };

  private createPost = async (
    request: express.Request,
    response: express.Response
  ) => {
    const postData: Post = request.body;
    const createdPost = new this.post(postData);
    const savedPost = await createdPost.save();
    response.send(savedPost);
  };

  private deletePost = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const successResponse = this.post.findByIdAndDelete(id);
    if (successResponse) {
      response.send(200);
    } else {
      response.send(404);
    }
  };
}

export default PostsController;
