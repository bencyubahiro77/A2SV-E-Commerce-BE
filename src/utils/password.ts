import bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

// Compare password with hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
