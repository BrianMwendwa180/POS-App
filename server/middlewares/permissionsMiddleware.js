// Permission-based middleware for granular access control

// Define permission constants
export const PERMISSIONS = {
  VIEW: 'view',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  CREATE: 'create',
  MANAGE: 'manage'
};

// Middleware to check if user has required permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user.permissions || !req.user.permissions[permission]) {
      return res.status(403).json({
        error: `Insufficient permissions. Required: ${permission}`
      });
    }

    next();
  };
};

// Middleware to check if user has any of the required permissions
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const hasPermission = permissions.some(permission =>
      req.user.permissions && req.user.permissions[permission]
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: `Insufficient permissions. Required one of: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// Combined middleware for common permission patterns
export const requireView = [requirePermission(PERMISSIONS.VIEW)];
export const requireRead = [requirePermission(PERMISSIONS.READ)];
export const requireUpdate = [requirePermission(PERMISSIONS.UPDATE)];
export const requireDelete = [requirePermission(PERMISSIONS.DELETE)];
export const requireCreate = [requirePermission(PERMISSIONS.CREATE)];
export const requireManage = [requirePermission(PERMISSIONS.MANAGE)];

// Manager level permissions (all permissions)
export const requireManagerLevel = [requirePermission(PERMISSIONS.MANAGE)];

// Cashier level permissions (view, read, update)
export const requireCashierLevel = [
  requireAnyPermission(PERMISSIONS.VIEW, PERMISSIONS.READ, PERMISSIONS.UPDATE)
];
