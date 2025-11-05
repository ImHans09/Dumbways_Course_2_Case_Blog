import express from "express";
import postRoutes from "../src/routes/post-route.js";
import userRoutes from "../src/routes/user-route.js";
import commentRoutes from "../src/routes/comment-route.js";

// Create Express app
const app = express();

// Initialize port
const port = 3000;

// Parsing user data from input form
app.use(express.urlencoded({ extended: false }));

// Use middleware to access API route
app.use('/api/v1', [postRoutes, userRoutes, commentRoutes]);

// Running application
app.listen(port, () => {
  console.log(`Listening app on http://localhost:${port}`);
});