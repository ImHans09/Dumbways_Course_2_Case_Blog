import { Request, Response } from "express";
import prismaClient from "../connection/client.js";

// Fetch users data and convert to JSON for reponse
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'Users retrieved successfully',
      dataCount: users.length,
      data: {
        users: users
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

// Create new user and insert to database
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (email.trim().length === 0) {
      throw 'Email is empty';
    }

    if (name.trim().length === 0) {
      throw 'Name is empty';
    }

    if (password.trim().length === 0) {
      throw 'Password is empty';
    }

    if (password.length < 8) {
      throw 'Password must be more than 8 characters';
    }

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser !== null) {
      throw `Email ${email} has been used`;
    }

    const user = await prismaClient.user.create({
      data: {
        email: email,
        name: name,
        password: password
      }
    });
    const userArray = [user];
    const statusCode = 201;
    const response = {
      success: true,
      code: statusCode,
      message: 'User created successfully',
      dataCount: userArray.length,
      data: {
        users: userArray
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

// Update user from database
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userEmail = (req.params.email) ? req.params.email : '';
    const { email, name, password } = req.body;

    if (email.trim().length === 0) {
      throw 'Email is empty';
    }

    if (name.trim().length === 0) {
      throw 'Name is empty';
    }

    if (password.trim().length === 0) {
      throw 'Password is empty';
    }

    if (password.length < 8) {
      throw 'Password must be more than 8 characters';
    }

    if (userEmail.trim().length === 0) {
      throw 'Email given is invalid';
    }

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: userEmail
      }
    });

    if (existingUser === null) {
      throw `User with email: ${userEmail} is not exist`;
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        email: userEmail
      },
      data: {
        email: email,
        name: name,
        password: password
      }
    });
    const userArray = [updatedUser];
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'User updated successfully',
      dataCount: userArray.length,
      data: {
        users: userArray
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

// Delete user from database
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userEmail = (req.params.email) ? req.params.email : '';

    if (userEmail.trim().length === 0) {
      throw 'Email given is invalid';
    }

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: userEmail
      }
    });

    if (existingUser === null) {
      throw `User with email: ${userEmail} is not exist`;
    }

    const deletedUser = await prismaClient.user.delete({
      where: {
        email: userEmail
      }
    });
    const userArray = [deletedUser];
    const statusCode = 200;
    const response = {
      success: true,
      code: statusCode,
      message: 'User deleted successfully',
      dataCount: userArray.length,
      data: {
        users: userArray
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