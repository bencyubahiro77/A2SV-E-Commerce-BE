import validator from 'validator';

// Sanitize email - trim, lowercase, and validate format
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';

  const trimmed = email.trim().toLowerCase();

  // Normalize email (remove dots in Gmail, etc.)
  return (
    validator.normalizeEmail(trimmed, {
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false,
    }) || trimmed
  );
};

// Sanitize string - trim and remove dangerous characters
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  // Trim whitespace and remove null bytes/control characters
  return removeDangerousChars(input.trim());
};

// Sanitize username - trim, remove special characters except underscore and dash
export const sanitizeUsername = (username: string): string => {
  if (!username) return '';
  return username.trim().replace(/[^a-zA-Z0-9_-]/g, '');
};

// Sanitize object - recursively sanitize all string values
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }

  return sanitized;
};

// Remove potentially dangerous characters from input
export const removeDangerousChars = (input: string): string => {
  if (!input) return '';
  // Remove null bytes, control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '');
};
