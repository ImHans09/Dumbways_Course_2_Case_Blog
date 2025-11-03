import { Request, Response } from "express";
import { Post, posts } from "../models/post-model.js";

// Fetch posts data and convert to JSON for reponse
export const getPosts = (req: Request, res: Response) => {
  res.status(200).json(posts);
};

// Create new post and add to posts array
export const createPost = (req: Request, res: Response) => {
  const { title, content } = req.body;
  const newPostId = posts.length > 0 ? posts[posts.length - 1]?.id : 1;
  const newPost: Post = {
    id: (typeof newPostId === 'number' && posts.length > 0) ? newPostId + 1 : 1,
    title: title,
    content: content
  };

  posts.push(newPost);
  res.status(201).json(newPost);
};

// Delete post from posts array
export const deletePost = (req: Request, res: Response) => {
  const postId = Number(req.params.id);
  const targetDeletionPostIndex = posts.findIndex(post => post.id === postId);
  let message = 'Deletion is failed';

  if (targetDeletionPostIndex !== -1) {
    posts.splice(targetDeletionPostIndex, 1);
    message = `Delete post with id: ${postId} successful.`;
  }

  const response = {
    message: message,
    posts: posts
  };

  res.status(200).json(response);
};