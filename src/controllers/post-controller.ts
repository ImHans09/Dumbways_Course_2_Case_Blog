import { Request, Response } from "express";
import prismaClient from "../connection/client.js";

// Fetch posts data and convert to JSON for reponse
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prismaClient.post.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'Posts retrieved successfully',
      dataCount: posts.length,
      data: {
        posts: posts
      }
    };

    res.status(statusCode).json(response);
  } catch (error) {
    const statusCode = 500;
    const response = {
      success: false,
      error: {
        code: statusCode,
        message: error
      }
    };

    res.status(statusCode).json(response);
  }
};

// Create new post and insert to database
export const createPost = async (req: Request, res: Response) => {
  try {
    const { authorEmail, title, content } = req.body;

    if (authorEmail.trim().length === 0) {
      throw 'Author email is empty';
    }

    if (title.trim().length === 0) {
      throw 'Post title is empty';
    }

    if (content.trim().length === 0) {
      throw 'Post content is empty';
    }

    const post = await prismaClient.post.create({
      data: {
        authorEmail: authorEmail,
        title: title,
        content: content
      }
    });
    const postArray = [post];
    const statusCode = 201;
    const response = {
      success: true,
      code: statusCode,
      message: 'Post created successfully',
      dataCount: postArray.length,
      data: {
        posts: postArray
      }
    };

    res.status(statusCode).json(response);
  } catch (error) {
    const statusCode = 400;
    const response = {
      success: false,
      error: {
        code: statusCode,
        message: error
      }
    };

    res.status(statusCode).json(response);
  }
};

// Update post from database
export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const { title, content } = req.body;

    if (title.trim().length === 0) {
      throw 'Post title is empty';
    }

    if (content.trim().length === 0) {
      throw 'Post content is empty';
    }

    const existingPost = await prismaClient.post.findUnique({
      where: {
        id: postId
      }
    });

    if (existingPost === null) {
      throw `Post with id: ${postId} is not exist`;
    }

    const updatedPost = await prismaClient.post.update({
      where: {
        id: postId
      },
      data: {
        title: title,
        content: content
      }
    });
    const postArray = [updatedPost];
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'Post updated successfully',
      dataCount: postArray.length,
      data: {
        posts: postArray
      }
    };

    res.status(statusCode).json(response);
  } catch (error) {
    const statusCode = 400;
    const response = {
      success: false,
      error: {
        code: statusCode,
        message: error
      }
    };

    res.status(statusCode).json(response);
  }
};

// Delete post from database
export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const existingPost = await prismaClient.post.findUnique({
      where: {
        id: postId
      }
    });

    if (existingPost === null) {
      throw `Post with id: ${postId} is not exist`;
    }

    const deletedPost = await prismaClient.post.delete({
      where: {
        id: postId
      }
    });
    const postArray = [deletedPost];
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'Post deleted successfully',
      dataCount: postArray.length,
      data: {
        posts: postArray
      }
    };

    res.status(statusCode).json(response);
  } catch (error) {
    const statusCode = 400;
    const response = {
      success: false,
      error: {
        code: statusCode,
        message: error
      }
    };

    res.status(statusCode).json(response);
  }
};