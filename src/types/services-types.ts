// Service identifiers
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

// Basic service interfaces
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
  getUsers(): Promise<any[]>;
  getUserByEmail(email: string): Promise<any>;
  getUserBySessionToken(sessionToken: string): Promise<any>;
  getUserById(id: string): Promise<any>;
  createUser(values: any): Promise<any>;
  deleteUserById(id: string): Promise<any>;
  updateUserById(id: string, username: string): Promise<any>;
}

export interface IAuthService {
  login(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }>;
  register(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }>;
}

export interface IUserService {
  getAllUsers(): Promise<any[]>;
  deleteUser(id: string): Promise<boolean>;
  updateUser(id: string, username: string): Promise<any>;
}

export interface IAuthController {
  login(req: any, res: any): Promise<any>;
  register(req: any, res: any): Promise<any>;
}

export interface IUserController {
  getAllUsers(req: any, res: any, next: any): Promise<any>;
  deleteUser(req: any, res: any): Promise<any>;
  updateUser(req: any, res: any): Promise<any>;
}

export interface IAuthMiddleware {
  isAuthenticated(req: any, res: any, next: any): Promise<void | any>;
  isOwner(req: any, res: any, next: any): Promise<void | any>;
}