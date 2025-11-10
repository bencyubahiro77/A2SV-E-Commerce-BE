import validator from 'validator';

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';

  const trimmed = email.trim().toLowerCase();

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

const removeDangerousChars = (input: string): string => {
  if (!input) return '';
  // Remove null bytes, control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '');
};

export const sanitizeString = (input: string): string => {
  if (!input) return '';
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
    } else if (Array.isArray(sanitized[key])) {
      // Handle arrays - map through and sanitize each element
      sanitized[key] = sanitized[key].map((item: any) => {
        if (typeof item === 'string') {
          return sanitizeString(item);
        } else if (typeof item === 'object' && item !== null) {
          return sanitizeObject(item);
        }
        return item;
      }) as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }

  return sanitized;
};
