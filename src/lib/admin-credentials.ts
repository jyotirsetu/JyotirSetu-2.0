import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

// Production-ready admin credentials module with Supabase integration

// Function to hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Function to verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Function to get admin credentials from database
export async function getAdminCredentials(username: string) {
  try {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching admin credentials:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAdminCredentials:', error);
    return null;
  }
}

// Function to update password in database
export async function updateAdminPassword(username: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword);
    
    const { error } = await supabase
      .from('admin_credentials')
      .update({ 
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('username', username);

    if (error) {
      console.error('Error updating admin password:', error);
      return false;
    }

    console.log('Admin password updated successfully in database');
    return true;
  } catch (error) {
    console.error('Error in updateAdminPassword:', error);
    return false;
  }
}

// Function to verify credentials against database
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const adminData = await getAdminCredentials(username);
    
    if (!adminData) {
      console.log(`Login attempt for user: ${username}, user not found`);
      return false;
    }

    const isValid = await verifyPassword(password, adminData.password_hash);
    console.log(`Login attempt for user: ${username}, success: ${isValid}`);
    return isValid;
  } catch (error) {
    console.error('Error in verifyAdminCredentials:', error);
    return false;
  }
}

// Function to verify current password
export async function verifyCurrentPassword(username: string, currentPassword: string): Promise<boolean> {
  try {
    const adminData = await getAdminCredentials(username);
    
    if (!adminData) {
      console.log(`Current password verification for user: ${username}, user not found`);
      return false;
    }

    const isValid = await verifyPassword(currentPassword, adminData.password_hash);
    console.log(`Current password verification for user: ${username}, ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  } catch (error) {
    console.error('Error in verifyCurrentPassword:', error);
    return false;
  }
}

// Function to initialize admin credentials (run once to set up)
export async function initializeAdminCredentials(): Promise<boolean> {
  try {
    // Check if admin user already exists
    const existingAdmin = await getAdminCredentials('admin');
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return true;
    }

    // Create default admin user
    const defaultPassword = 'admin123';
    const hashedPassword = await hashPassword(defaultPassword);
    
    const { error } = await supabase
      .from('admin_credentials')
      .insert({
        username: 'admin',
        password_hash: hashedPassword
      });

    if (error) {
      console.error('Error creating admin user:', error);
      return false;
    }

    console.log('Admin user created successfully with default password: admin123');
    return true;
  } catch (error) {
    console.error('Error in initializeAdminCredentials:', error);
    return false;
  }
}
