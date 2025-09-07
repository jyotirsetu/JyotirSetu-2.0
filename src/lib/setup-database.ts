import { supabase } from './supabase';
import { initializeAdminCredentials } from './admin-credentials';

// Database setup script to create tables and initialize admin user

export async function setupDatabase(): Promise<boolean> {
  try {
    console.log('Setting up database...');
    
    // Create admin_credentials table
    const { error: credentialsError } = await supabase.rpc('create_admin_credentials_table');
    if (credentialsError) {
      console.log('Admin credentials table might already exist or error occurred:', credentialsError.message);
    }
    
    // Create admin_sessions table
    const { error: sessionsError } = await supabase.rpc('create_admin_sessions_table');
    if (sessionsError) {
      console.log('Admin sessions table might already exist or error occurred:', sessionsError.message);
    }
    
    // Initialize admin credentials
    const adminInitialized = await initializeAdminCredentials();
    if (!adminInitialized) {
      console.error('Failed to initialize admin credentials');
      return false;
    }
    
    console.log('Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

// Function to run setup (can be called from API endpoint)
export async function runDatabaseSetup(): Promise<{ success: boolean; message: string }> {
  try {
    const success = await setupDatabase();
    return {
      success,
      message: success ? 'Database setup completed successfully' : 'Database setup failed'
    };
  } catch (error) {
    console.error('Error in runDatabaseSetup:', error);
    return {
      success: false,
      message: 'Database setup failed with error'
    };
  }
}
