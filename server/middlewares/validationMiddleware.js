import { body, validationResult } from "express-validator";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array()
    });
  }
  next();
};

// Product validation rules
export const validateProduct = [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('brand').optional().trim().isLength({ min: 1 }).withMessage('Brand must not be empty if provided'),
  body('size').optional().trim().isLength({ min: 1 }).withMessage('Size must not be empty if provided'),
  body('width').optional().isFloat({ min: 0 }).withMessage('Width must be a positive number'),
  body('aspectRatio').optional().isFloat({ min: 0 }).withMessage('Aspect ratio must be a positive number'),
  body('rimDiameter').optional().isFloat({ min: 0 }).withMessage('Rim diameter must be a positive number'),
  body('rimWidth').optional().isFloat({ min: 0 }).withMessage('Rim width must be a positive number'),
  body('offset').optional().isFloat().withMessage('Offset must be a number'),
  body('boltPattern').optional().trim().isLength({ min: 1 }).withMessage('Bolt pattern must not be empty if provided'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidationErrors
];

// User registration validation
export const validateUserRegistration = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'manager', 'cashier', 'user']).withMessage('Invalid role'),
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
  handleValidationErrors
];

// Sale validation
export const validateSale = [
  body('products').isArray({ min: 1 }).withMessage('At least one product is required'),
  body('products.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('products.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('paymentMethod').isIn(['cash', 'card', 'mobile', 'check']).withMessage('Invalid payment method'),
  handleValidationErrors
];

// Supplier validation
export const validateSupplier = [
  body('name').trim().isLength({ min: 1 }).withMessage('Supplier name is required'),
  body('email').optional().isEmail().withMessage('Valid email format required'),
  handleValidationErrors
];
