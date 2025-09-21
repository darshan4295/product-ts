import express from 'express';
import { container } from '../container';
import { TYPES, IUserController } from '../types/service-types';

// Get the user controller from the DI container
const userController = container.get<IUserController>(TYPES.UserController);

export const getAllUsers = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return userController.getAllUsers(req, res, next);
};

export const deleteUser = (req: express.Request, res: express.Response) => {
    return userController.deleteUser(req, res);
};

export const updateUser = (req: express.Request, res: express.Response) => {
    return userController.updateUser(req, res);
};