export interface Role {
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface SessionUser { role?: string }
export interface Session { user?: SessionUser }

const ROLES: Record<string, Role> = {
  super_admin: {
    name: 'super_admin',
    permissions: ['*']
  },
  admin: {
    name: 'admin',
    permissions: [
      'read:*',
      'write:appointments',
      'write:contacts',
      'write:leads',
      'write:quotes',
      'write:clients',
      'write:staff',
      'write:availability',
      'write:capacity',
      'write:documents',
      'write:templates',
      'write:newsletter',
      'write:settings'
    ]
  },
  manager: {
    name: 'manager',
    permissions: [
      'read:appointments',
      'write:appointments',
      'read:contacts',
      'write:contacts',
      'read:leads',
      'write:leads',
      'read:quotes',
      'write:quotes',
      'read:clients',
      'write:clients',
      'read:staff',
      'write:staff',
      'read:availability',
      'write:availability',
      'read:capacity',
      'write:capacity',
      'read:documents',
      'write:documents',
      'read:analytics',
      'read:templates',
      'write:templates',
      'read:newsletter',
      'write:newsletter',
      'read:activity',
      'read:settings',
      'write:settings'
    ]
  },
  consultant: {
    name: 'consultant',
    permissions: [
      'read:appointments',
      'write:appointments',
      'read:contacts',
      'write:contacts',
      'read:leads',
      'write:leads',
      'read:clients',
      'write:clients',
      'read:availability',
      'write:availability',
      'read:documents',
      'write:documents',
      'read:analytics',
      'read:templates',
      'read:activity'
    ]
  },
  support: {
    name: 'support',
    permissions: [
      'read:appointments',
      'read:contacts',
      'read:leads',
      'read:clients',
      'read:documents',
      'read:activity'
    ]
  }
};

export function hasPermission(userRole: string, permission: string): boolean {
  const role = ROLES[userRole];
  if (!role) return false;
  
  // Admin has all permissions
  if (role.permissions.includes('*')) return true;
  
  // Check for specific permission
  return role.permissions.includes(permission);
}

export function hasAnyPermission(userRole: string, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: string, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function getUserRole(session: Session | null | undefined): string {
  if (!session || !session.user) return 'support';
  return session.user.role || 'support';
}

export function requirePermission(session: Session | null | undefined, permission: string): boolean {
  const userRole = getUserRole(session);
  return hasPermission(userRole, permission);
}

export function requireAnyPermission(session: Session | null | undefined, permissions: string[]): boolean {
  const userRole = getUserRole(session);
  return hasAnyPermission(userRole, permissions);
}

export function requireAllPermissions(session: Session | null | undefined, permissions: string[]): boolean {
  const userRole = getUserRole(session);
  return hasAllPermissions(userRole, permissions);
}

export async function requireRole(request: Request, secret: string, allowedRoles: string[]): Promise<boolean> {
  try {
    const { verifySession } = await import('./auth');
    const cookie = request.headers.get('cookie') || '';
    const m = /admin_session=([^;]+)/.exec(cookie);
    if (!m) return false;
    const token = decodeURIComponent(m[1]);
    const session = await verifySession(token, secret);
    if (!session || !session.user) return false;
    const userRole = session.user.role || 'support';
    return allowedRoles.includes(userRole);
  } catch {
    return false;
  }
}
