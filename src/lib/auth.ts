import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'translator' | 'editor' | 'client';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  // Get user profile from Supabase
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return {
    clerk: user,
    profile: profile as UserProfile
  };
}

export async function createUserProfile(clerkUser: any) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      role: 'client', // Default role
      avatar_url: clerkUser.imageUrl
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data as UserProfile;
}

export async function updateUserRole(userId: string, role: UserProfile['role']) {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user role:', error);
    throw error;
  }

  return data as UserProfile;
}

export function hasRole(user: UserProfile | null, requiredRole: UserProfile['role'] | UserProfile['role'][]) {
  if (!user) return false;
  
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

export function isAdmin(user: UserProfile | null) {
  return hasRole(user, 'admin');
}

export function isTranslator(user: UserProfile | null) {
  return hasRole(user, ['admin', 'translator']);
}

export function isEditor(user: UserProfile | null) {
  return hasRole(user, ['admin', 'editor']);
}

export function isClient(user: UserProfile | null) {
  return hasRole(user, ['admin', 'client']);
} 