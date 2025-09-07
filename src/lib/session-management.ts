import { supabase } from './supabase';

// Secure session management with database storage

// Function to generate secure session ID
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const extraRandom = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}-${extraRandom}`;
}

// Function to create session in database
export async function createSession(username: string, sessionId: string): Promise<boolean> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const { error } = await supabase
      .from('admin_sessions')
      .insert({
        session_id: sessionId,
        username: username,
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      console.error('Error creating session:', error);
      return false;
    }

    console.log(`Session created for user: ${username}`);
    return true;
  } catch (error) {
    console.error('Error in createSession:', error);
    return false;
  }
}

// Function to validate session
export async function validateSession(sessionId: string): Promise<{ valid: boolean; username?: string }> {
  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('username, expires_at')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      console.log('Session not found or invalid');
      return { valid: false };
    }

    // Check if session is expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();

    if (now > expiresAt) {
      console.log('Session expired');
      // Clean up expired session
      await deleteSession(sessionId);
      return { valid: false };
    }

    console.log(`Valid session for user: ${data.username}`);
    return { valid: true, username: data.username };
  } catch (error) {
    console.error('Error in validateSession:', error);
    return { valid: false };
  }
}

// Function to delete session
export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error deleting session:', error);
      return false;
    }

    console.log('Session deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteSession:', error);
    return false;
  }
}

// Function to clean up expired sessions
export async function cleanupExpiredSessions(): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .lt('expires_at', now);

    if (error) {
      console.error('Error cleaning up expired sessions:', error);
      return false;
    }

    console.log('Expired sessions cleaned up');
    return true;
  } catch (error) {
    console.error('Error in cleanupExpiredSessions:', error);
    return false;
  }
}

// Function to get username from session
export async function getUsernameFromSession(sessionId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('username')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.username;
  } catch (error) {
    console.error('Error in getUsernameFromSession:', error);
    return null;
  }
}
