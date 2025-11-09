import { Request, Response, NextFunction } from 'express';
import { register as registerService, login as loginService } from '../services/auth.service';
import { created, success } from '../utils/response';

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await registerService(req.body);
    created(res, 'User registered successfully', user);
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await loginService(req.body);
    success(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};
