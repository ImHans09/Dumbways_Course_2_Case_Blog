import { Router } from "express";
import { getComments, countCommentsWithGrouping, createComment, updateComment, deleteComment } from "../controllers/comment-controller.js";

// Create Router instance
const router = Router();

// Route to get comments
router.get('/posts/:id/comments', getComments);

// Route to get comments summmary
router.get('/posts/comments-summary', countCommentsWithGrouping);

// Route to create comment
router.post('/posts/:id/comments', createComment);

// Route to update comment
router.put('/posts/:postId/comments/:commentId', updateComment);

// Route to delete comment
router.delete('/posts/:postId/comments/:commentId', deleteComment);

// Set default export for router variable
export default router;