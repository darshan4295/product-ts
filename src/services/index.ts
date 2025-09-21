import crypto from 'crypto';
import { get, merge } from 'lodash';
import { createUser, getUserByEmail, getUserBySessionToken, getUsers, deleteUserById, updateUserById } from '../db/user';
import { authentication, random } from '../helpers';
import { 
  ILogger, ICryptoHelper, IUserRepository, IAuthService, 
  IUserService, IAuthController, IUserController, IAuthMiddleware 
} from '../types/service-types';

// Logger Service
export function createLogger(): ILogger {
  return {
    info: (message: string) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
    error: (message: string) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`),
    warn: (message: string) => console.warn(`[WARN] ${new Date().toISOString()}: ${message}`),
    debug: (message: string) => console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`)
  };
}

// Crypto Helper Service
export function createCryptoHelper(): ICryptoHelper {
  return {
    random,
    authentication
  };
}

// User Repository Service (wraps your existing db functions)
export function createUserRepository(logger: ILogger): IUserRepository {
  return {
    async getUsers() {
      logger.debug('Fetching all users');
      return getUsers();
    },
    async getUserByEmail(email: string) {
      logger.debug(`Fetching user by email: ${email}`);
      return getUserByEmail(email);
    },
    async getUserBySessionToken(sessionToken: string) {
      logger.debug('Fetching user by session token');
      return getUserBySessionToken(sessionToken);
    },
    async getUserById(id: string) {
      logger.debug(`Fetching user by ID: ${id}`);
      return getUserBySessionToken(id);
    },
    async createUser(values: any) {
      logger.debug(`Creating new user: ${values.email}`);
      return createUser(values);
    },
    async deleteUserById(id: string) {
      logger.debug(`Deleting user by ID: ${id}`);
      return deleteUserById(id);
    },
    async updateUserById(id: string, username: string) {
      logger.debug(`Updating user ${id} with username: ${username}`);
      return updateUserById(id, username);
    }
  };
}

// Auth Service
export function createAuthService(userRepo: IUserRepository, crypto: ICryptoHelper, logger: ILogger): IAuthService {
  return {
    async login(email: string, password: string) {
      try {
        logger.info(`Login attempt for email: ${email}`);
        
        if (!email || !password) {
          return { success: false, error: 'Email and password are required' };
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        
        if (!user) {
          logger.warn(`Login failed: User not found for email ${email}`);
          return { success: false, error: 'Invalid credentials' };
        }

        const expectedHash = crypto.authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash.toString()) {
          logger.warn(`Login failed: Invalid password for email ${email}`);
          return { success: false, error: 'Invalid credentials' };
        }

        const salt = crypto.random();
        user.authentication.sessionToken = crypto.authentication(salt, (user._id as string).toString()).toString();
        await user.save();
        
        logger.info(`Login successful for email: ${email}`);
        return { success: true, user };
      } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return { success: false, error: 'Login failed' };
      }
    },

    async register(email: string, password: string, username: string) {
      try {
        logger.info(`Registration attempt for email: ${email}`);
        
        if (!email || !password || !username) {
          return { success: false, error: 'Email, password, and username are required' };
        }

        const existingUser = await userRepo.getUserByEmail(email);

        if (existingUser) {
          logger.warn(`Registration failed: User already exists for email ${email}`);
          return { success: false, error: 'User already exists' };
        }

        const salt = crypto.random();
        await userRepo.createUser({
          email,
          username,
          authentication: {
            salt,
            password: crypto.authentication(salt, password).toString()
          }
        });

        logger.info(`Registration successful for email: ${email}`);
        return { success: true };
      } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        return { success: false, error: 'Registration failed' };
      }
    }
  };
}

// User Service
export function createUserService(userRepo: IUserRepository, logger: ILogger): IUserService {
  return {
    async getAllUsers() {
      logger.info('Fetching all users');
      return await userRepo.getUsers();
    },

    async deleteUser(id: string) {
      logger.info(`Deleting user with ID: ${id}`);
      const result = await userRepo.deleteUserById(id);
      return !!result;
    },

    async updateUser(id: string, username: string) {
      logger.info(`Updating user ${id} with username: ${username}`);
      return await userRepo.updateUserById(id, username);
    }
  };
}

// Auth Controller
export function createAuthController(authService: IAuthService, logger: ILogger): IAuthController {
  return {
    async login(req: any, res: any) {
      try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        
        if (!result.success) {
          return res.status(401).json({ message: result.error });
        }

        res.cookie('Rest-AUTH', result.user.authentication.sessionToken, { 
          domain: 'localhost', 
          path: '/' 
        });

        return res.status(200).json(result.user);
      } catch (error) {
        logger.error(`Controller login error: ${error.message}`);
        return res.sendStatus(400);
      }
    },

    async register(req: any, res: any) {
      try {
        const { email, password, username } = req.body;
        const result = await authService.register(email, password, username);
        
        if (!result.success) {
          return res.status(400).json({ message: result.error });
        }

        return res.status(200).json({ message: "Registration Successful" });
      } catch (error) {
        logger.error(`Controller registration error: ${error.message}`);
        return res.sendStatus(400);
      }
    }
  };
}

// User Controller
export function createUserController(userService: IUserService, logger: ILogger): IUserController {
  return {
    async getAllUsers(req: any, res: any, next: any) {
      try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users).end();
      } catch (error) {
        logger.error(`Get all users error: ${error.message}`);
        return res.sendStatus(400);
      }
    },

    async deleteUser(req: any, res: any) {
      try {
        const { id } = req.params;
        const success = await userService.deleteUser(id);
        
        if (!success) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json({ message: 'User deleted successfully' }).end();
      } catch (error) {
        logger.error(`Delete user error: ${error.message}`);
        return res.sendStatus(400);
      }
    },

    async updateUser(req: any, res: any) {
      try {
        const { id } = req.params;
        const { username } = req.body;
        const user = await userService.updateUser(id, username);
        
        return res.status(200).json(user).end();
      } catch (error) {
        logger.error(`Update user error: ${error.message}`);
        return res.sendStatus(400);
      }
    }
  };
}

// Auth Middleware
export function createAuthMiddleware(userRepo: IUserRepository, logger: ILogger): IAuthMiddleware {
  return {
    async isAuthenticated(req: any, res: any, next: any) {
      try {
        const sessionToken = req.cookies['Rest-AUTH'];

        if (!sessionToken) {
          logger.warn('Authentication failed: No session token');
          return res.sendStatus(403);
        }

        const existingUser = await userRepo.getUserBySessionToken(sessionToken);
        
        if (!existingUser) {
          logger.warn('Authentication failed: Invalid session token');
          return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });
        logger.debug('Authentication successful');
        return next();
      } catch (error) {
        logger.error(`Authentication middleware error: ${error.message}`);
        return res.sendStatus(400);
      }
    },

    async isOwner(req: any, res: any, next: any) {
      try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
          logger.warn('Owner check failed: No current user');
          return res.sendStatus(403);
        }

        if (currentUserId.toString() !== id) {
          logger.warn(`Owner check failed: User ${currentUserId} trying to access ${id}`);
          return res.sendStatus(403);
        }

        logger.debug('Owner check successful');
        return next();
      } catch (error) {
        logger.error(`Owner middleware error: ${error.message}`);
        return res.sendStatus(400);
      }
    }
  };
}