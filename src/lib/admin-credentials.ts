// Shared admin credentials module
// In production, this should be replaced with Supabase integration

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // This will be hashed in production
};

// Function to update password
export function updateAdminPassword(newPassword: string): void {
  ADMIN_CREDENTIALS.password = newPassword;
  console.log('Admin password updated successfully');
}

// Function to verify credentials
export function verifyAdminCredentials(username: string, password: string): boolean {
  const isValid = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
  console.log(`Login attempt for user: ${username}, success: ${isValid}`);
  return isValid;
}

// Function to verify current password
export function verifyCurrentPassword(currentPassword: string): boolean {
  const isValid = currentPassword === ADMIN_CREDENTIALS.password;
  console.log(`Current password verification: ${isValid ? 'valid' : 'invalid'}`);
  return isValid;
}

// Function to get current password (for debugging purposes only)
export function getCurrentPassword(): string {
  return ADMIN_CREDENTIALS.password;
}
