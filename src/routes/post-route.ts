import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/post-controller.js";

// Create Router instance
const router = Router();

// Route to get posts
router.get('/posts', getPosts);

// Route to create post
router.post('/posts', createPost);

// Route to update post
router.put('/posts/:id', updatePost);

// Route to delete post
router.delete('/posts/:id', deletePost);

// Set default export for router variable
export default router;