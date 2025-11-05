import { Request, Response } from "express";
import { prisma, prismaClient } from "../prisma/client.js";

// Fetch comments data from database
export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const { sortBy, sort, limit, offset } = req.query;
    const commentFields = prisma.dmmf.datamodel.models.find((model) => model.name === 'Comment')?.fields.map((field) => field.name);
    const sortMethods = ['asc', 'desc'];

    if (Number.isNaN(postId)) {
      throw 'Post id must be numeric';
    }

    if (!commentFields?.includes(sortBy as string) && (sortBy as string).length !== 0) {
      throw `Comment doesn't have ${sortBy} property`;
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
    
    const sortByStr = ((sortBy as string).length === 0) ? 'id' : sortBy as string;
    const comments = await prismaClient.comment.findMany({
      where: { postId: postId },
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
      message: 'Comments retrieved successfully',
      dataCount: comments.length,
      data: {
        comments: comments
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

// Count comments data grouped by post ID from database
export const countCommentsWithGrouping = async (req: Request, res: Response) => {
  try {
    const { minComments, sortBy, sort, limit, offset } = req.query;
    const commentFields = prisma.dmmf.datamodel.models.find((model) => model.name === 'Comment')?.fields.map((field) => field.name);
    const sortMethods = ['asc', 'desc'];

    if (!commentFields?.includes(sortBy as string) && (sortBy as string).length !== 0) {
      throw `Comment doesn't have ${sortBy} property`;
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

    if (Number.isNaN(Number(minComments)) && (minComments as string).length !== 0) {
      throw 'Minimum comments in a post value must be numeric';
    }

    const sortByStr = ((sortBy as string).length === 0) ? 'id' : sortBy as string;
    const comments = await prismaClient.comment.groupBy({
      by: ['postId'],
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gt: ((minComments as string).length === 0) ? 0 : Number(minComments),
          },
        },
      },
      orderBy: {
        _count: {
          [sortByStr]: ((sort as string).length === 0) ? sortMethods[0] : sort as string
        }
      },
      take: ((limit as string).length === 0) ? 5 : Number(limit),
      skip: ((offset as string).length === 0) ? 0 : Number(offset)
    });
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'Comments retrieved successfully',
      dataCount: comments.length,
      data: {
        comments: comments
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
}

// Create new comment and insert to database
export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const { authorId, content } = req.body;

    if (Number.isNaN(postId)) {
      throw 'Post id must be numeric';
    }

    if (Number.isNaN(Number(authorId))) {
      throw 'Author id must be numeric';
    }

    if (content.trim().length === 0) {
      throw 'Comment content is empty';
    }

    const existingPost = await prismaClient.post.findUnique({
      where: { id: postId }
    });

    if (existingPost === null) {
      throw `Post with id: ${postId} is not exist. Can't create comment.`;
    }

    const comment = await prismaClient.comment.create({
      data: {
        authorId: Number(authorId),
        postId: postId,
        content: content
      }
    });
    const commentArray = [comment];
    const statusCode = 201;
    const response = {
      success: true,
      code: statusCode,
      message: 'Comment created successfully',
      dataCount: commentArray.length,
      data: {
        comments: commentArray
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

// Update comment from database
export const updateComment = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    if (Number.isNaN(postId)) {
      throw 'Post id must be numeric';
    }

    if (Number.isNaN(commentId)) {
      throw 'Comment id must be numeric';
    }

    if (content.trim().length === 0) {
      throw 'Comment content is empty';
    }

    const existingPost = await prismaClient.post.findUnique({
      where: { id: postId }
    });
    
    if (existingPost === null) {
      throw `Post with id: ${postId} is not exist. Cant't update comment.`;
    }

    const existingComment = await prismaClient.comment.findUnique({
      where: { id: commentId }
    });

    if (existingComment === null) {
      throw `Comment with id: ${commentId} is not exist`;
    }

    const updateDate = new Date(Date.now());
    const updatedComment = await prismaClient.comment.update({
      where: { id: commentId },
      data: {
        content: content,
        updatedAt: updateDate
      }
    });
    const commentArray = [updatedComment];
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'Comment updated successfully',
      dataCount: commentArray.length,
      data: {
        comments: commentArray
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

// Delete comment from database
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);

    if (Number.isNaN(postId)) {
      throw 'Post id must be numeric';
    }

    if (Number.isNaN(commentId)) {
      throw 'Comment id must be numeric';
    }

    const existingPost = await prismaClient.post.findUnique({
      where: { id: postId }
    });
    
    if (existingPost === null) {
      throw `Post with id: ${postId} is not exist. Cant't delete comment.`;
    }

    const existingComment = await prismaClient.comment.findUnique({
      where: { id: commentId }
    });

    if (existingComment === null) {
      throw `Comment with id: ${commentId} is not exist`;
    }

    const deletedComment = await prismaClient.comment.delete({
      where: { id: commentId }
    });
    const commentArray = [deletedComment];
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'Comment deleted successfully',
      dataCount: commentArray.length,
      data: {
        comments: commentArray
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