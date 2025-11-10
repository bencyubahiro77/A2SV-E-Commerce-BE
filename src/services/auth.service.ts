import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { sanitizeEmail, sanitizeUsername } from '../utils/sanitizer';
import { ConflictError, AuthenticationError } from '../utils/errors';
import logger from '../utils/logger';
import { RegisterInput, LoginInput } from '../types/auth.types';

// Register a new user
export const register = async (input: RegisterInput) => {
  const { username, email, password } = input;

  // Sanitize inputs
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedUsername = sanitizeUsername(username).toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: sanitizedEmail }, { username: sanitizedUsername }],
    },
  });

  if (existingUser) {
    if (existingUser.email === sanitizedEmail) {
      throw new ConflictError('Email already registered');
    }
    throw new ConflictError('Username already taken');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  logger.info(`New user registered: ${user.email}`);

  return user;
};

// Login user
export const login = async (input: LoginInput) => {
  const { email, password } = input;

  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    logger.warn(`Failed login attempt for email: ${sanitizedEmail}`);
    throw new AuthenticationError('Incorrect email or password');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  logger.info(`User logged in: ${user.email}`);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};
