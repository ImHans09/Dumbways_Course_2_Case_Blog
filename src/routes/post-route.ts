import { Router } from "express";
import { getPosts, createPost, deletePost } from "../controllers/post-controller.js";

// Create Router instance
const router = Router();

// Route to get posts
router.get('/posts', getPosts);

// Route to create post
router.post('/posts', createPost);

// Route to delete post
router.delete('/posts/:id', deletePost);

// Set default export for router variable
export default router;