import { Request, Response } from "express";
import { prisma, prismaClient } from "../prisma/client.js";

// Fetch posts data from database
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { categoryId, sortBy, sort, limit, offset } = req.query;
    const postFields = prisma.dmmf.datamodel.models.find((model) => model.name === 'Post')?.fields.map((field) => field.name);
    const sortMethods = ['asc', 'desc'];
    const filter: any = {};

    if (Number.isNaN(Number(categoryId))) {
      throw 'Category id must be numeric';
    }

    if (!postFields?.includes(sortBy as string) && (sortBy as string).length !== 0) {
      throw `Post doesn't have ${sortBy} property`;
    }

    if (!sortMethods.includes(sort as string) && (sort as string).length !== 0) {
      throw 'Sort method is invalid';
    }

    if (Number.isNaN(Number(limit)) && (limit as string).length !== 0) {
      throw 'Limit value must be numeric';
    }

    if (Number.isNaN(Number(offset)) && (offset as string).length !== 0) {
      throw 'Offset value must be numeric';
    }

    if (categoryId) filter.categoryId = categoryId

    const sortByStr = ((sortBy as string).length === 0) ? 'id' : sortBy as string;
    const posts = await prismaClient.post.findMany({
      where: filter,
      orderBy: {
        [sortByStr]: ((sort as string).length === 0) ? sortMethods[0] : sort as string
      },
      take: ((limit as string).length === 0) ? 5 : Number(limit),
      skip: ((offset as string).length === 0) ? 0 : Number(offset)
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
    const { authorId, categoryId, title, content } = req.body;

    if (Number.isNaN(Number(authorId))) {
      throw 'Author id must be numeric';
    }

    if (Number.isNaN(Number(categoryId))) {
      throw 'Category id must be numeric';
    }

    if (title.trim().length === 0) {
      throw 'Post title is empty';
    }

    if (content.trim().length === 0) {
      throw 'Post content is empty';
    }

    const post = await prismaClient.post.create({
      data: {
        authorId: Number(authorId),
        categoryId: Number(categoryId),
        title: title as string,
        content: content as string
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
    const { categoryId, title, content } = req.body;

    if (Number.isNaN(postId)) {
      throw 'Post id must be numeric';
    }

    if (Number.isNaN(Number(categoryId))) {
      throw 'Category id must be numeric';
    }

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

    const updateDate = new Date(Date.now());
    const updatedPost = await prismaClient.post.update({
      where: {
        id: postId
      },
      data: {
        categoryId: Number(categoryId),
        title: title,
        content: content,
        updatedAt: updateDate
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

    if (Number.isNaN(postId)) {
      throw 'Post id must be numeric';
    }

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