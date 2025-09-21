import express from 'express';
import { container } from '../container';
import { TYPES, IAuthController } from '../types/service-types';

// Get the auth controller from the DI container
const authController = container.get<IAuthController>(TYPES.AuthController);

export const login = (req: express.Request, res: express.Response): Promise<express.Response> => {
    return authController.login(req, res);
};

export const register = (req: express.Request, res: express.Response): Promise<express.Response> => {
    return authController.register(req, res);
};