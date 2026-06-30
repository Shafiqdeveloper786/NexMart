/**
 * Security utilities for input validation and sanitization
 */

// Password strength checker
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push("Password must be at least 8 characters long");
  } else {
    score++;
  }

  if (password.length >= 12) {
    score++;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("Include both uppercase and lowercase letters");
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push("Include at least one number");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("Include at least one special character (!@#$%^&*)");
  }

  return {
    valid: score >= 3,
    score,
    feedback,
  };
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Pakistani format)
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^03\d{9}$/.test(cleaned);
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  const entities = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;'
  };
  
  return input
    .replace(/[&<>"']/g, (char) => entities[char as keyof typeof entities]);
}

// Sanitize for SQL (basic - Prisma handles most of this)
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Detect suspicious patterns
export function detectSuspiciousActivity(data: {
  email?: string;
  password?: string;
  name?: string;
}): string[] {
  const suspicious: string[] = [];

  // Check for common malicious patterns
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC)\b)/i,
    /(--)|(;)|(\/\*)|(\*\/)/,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
  ];

  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
  ];

  const testValues = [data.email, data.password, data.name].filter(Boolean);

  for (const value of testValues) {
    if (typeof value !== "string") continue;

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(value)) {
        suspicious.push("SQL injection attempt detected");
        break;
      }
    }

    for (const pattern of xssPatterns) {
      if (pattern.test(value)) {
        suspicious.push("XSS attempt detected");
        break;
      }
    }
  }

  return suspicious;
}

// Rate limiting for sensitive operations
const sensitiveOps = new Map<string, { count: number; lastAttempt: number }>();

export function checkSensitiveOpRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 300000 // 5 minutes
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = sensitiveOps.get(key);

  if (!record || now - record.lastAttempt > windowMs) {
    sensitiveOps.set(key, { count: 1, lastAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  record.lastAttempt = now;
  return { allowed: true, remaining: maxAttempts - record.count };
}

// Validate product data
export function validateProductData(data: {
  name: string;
  price: number;
  category: string;
  stock: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.length < 3) {
    errors.push("Product name must be at least 3 characters");
  }

  if (data.name.length > 200) {
    errors.push("Product name must be less than 200 characters");
  }

  if (isNaN(data.price) || data.price < 0) {
    errors.push("Price must be a positive number");
  }

  if (data.price > 1000000) {
    errors.push("Price cannot exceed $1,000,000");
  }

  if (!data.category || data.category.length < 2) {
    errors.push("Category is required");
  }

  if (isNaN(data.stock) || data.stock < 0) {
    errors.push("Stock must be a non-negative number");
  }

  if (data.stock > 10000) {
    errors.push("Stock cannot exceed 10,000 units");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Validate order data
export function validateOrderData(data: {
  items: Array<{ productId: string; quantity: number }>;
  totalAmount: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.items || data.items.length === 0) {
    errors.push("Order must contain at least one item");
  }

  if (data.items && data.items.length > 50) {
    errors.push("Order cannot contain more than 50 items");
  }

  for (const item of data.items) {
    if (!item.productId || item.productId.length !== 24) {
      errors.push("Invalid product ID");
      break;
    }

    if (isNaN(item.quantity) || item.quantity < 1) {
      errors.push("Item quantity must be at least 1");
      break;
    }

    if (item.quantity > 100) {
      errors.push("Cannot order more than 100 units of a single item");
      break;
    }
  }

  if (isNaN(data.totalAmount) || data.totalAmount <= 0) {
    errors.push("Total amount must be greater than 0");
  }

  if (data.totalAmount > 100000) {
    errors.push("Order total cannot exceed $100,000");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}