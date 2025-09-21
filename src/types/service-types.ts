import { IUser } from './index';
import express from 'express';

export const TYPES = {
  Logger: Symbol.for('Logger'),
  CryptoHelper: Symbol.for('CryptoHelper'),
  UserRepository: Symbol.for('UserRepository'),
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  AuthController: Symbol.for('AuthController'),
  UserController: Symbol.for('UserController'),
  AuthMiddleware: Symbol.for('AuthMiddleware')
};

export interface ILogger {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
}

export interface ICryptoHelper {
  random(): string;
  authentication(salt: string, password: string): Buffer;
}


export interface IUserRepository {
  getUsers(): Promise<IUser[]>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserBySessionToken(sessionToken: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  createUser(values: Partial<IUser>): Promise<IUser>;
  deleteUserById(id: string): Promise<IUser | null>;
  updateUserById(id: string, username: string): Promise<IUser | null>;
}

export interface IAuthService {
  login(email: string, password: string): Promise<{ success: boolean; user?: IUser; error?: string }>;
  register(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }>;
}

export interface IUserService {
  getAllUsers(): Promise<IUser[]>;
  deleteUser(id: string): Promise<boolean>;
  updateUser(id: string, username: string): Promise<IUser | null>;
}

export interface IAuthController {
  login(req: express.Request, res: express.Response): Promise<express.Response>;
  register(req: express.Request, res: express.Response): Promise<express.Response>;
}

export interface IUserController {
  getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response>;
  deleteUser(req: express.Request, res: express.Response): Promise<express.Response>;
  updateUser(req: express.Request, res: express.Response): Promise<express.Response>;
}

export interface IAuthMiddleware {
  isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void | express.Response>;
  isOwner(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void | express.Response>;
}