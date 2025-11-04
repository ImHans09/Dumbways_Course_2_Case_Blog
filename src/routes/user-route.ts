import { Router } from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/user-controller.js";

// Create Router instance
const router = Router();

// Route to get users
router.get('/users', getUsers);

// Route to create user
router.post('/users', createUser);

// Route to update user
router.put('/users/:email', updateUser);

// Route to delete user
router.delete('/users/:email', deleteUser);

// Set default export for router variable
export default router;