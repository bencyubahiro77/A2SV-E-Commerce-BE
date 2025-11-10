import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authRateLimiter } from '../middlewares/security.middleware';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), register);

router.post('/login', authRateLimiter, validate(loginSchema), login);

export default router;
