import * as express from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";

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
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
  }

  private getAllPosts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const posts = await this.post.find();
    response.send(posts);
  };

  private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    try {
      const post = await this.post.findById(id)
      if (post) {
        response.send(post);
      } else {

      }
    } catch(e) {
      next(new PostNotFoundException(id));
    }
  }

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
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    try {
      const successResponse = this.post.findByIdAndDelete(id);
      if (successResponse) {
        response.send(200);
      } else {
        next(new PostNotFoundException(id))
      }
    } catch (e) {
      next(new PostNotFoundException(id))
    }
  };
}

export default PostsController;
