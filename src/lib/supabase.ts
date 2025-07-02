import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          client_id: string
          translator_id: string | null
          editor_id: string | null
          status: 'not_started' | 'in_progress' | 'review' | 'completed'
          progress: number
          deadline: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          client_id: string
          translator_id?: string | null
          editor_id?: string | null
          status?: 'not_started' | 'in_progress' | 'review' | 'completed'
          progress?: number
          deadline: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          client_id?: string
          translator_id?: string | null
          editor_id?: string | null
          status?: 'not_started' | 'in_progress' | 'review' | 'completed'
          progress?: number
          deadline?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          assignee_id: string | null
          status: 'not_started' | 'in_progress' | 'needs_review' | 'completed'
          priority: 'low' | 'medium' | 'high'
          deadline: string
          progress: number
          chapter_number: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          assignee_id?: string | null
          status?: 'not_started' | 'in_progress' | 'needs_review' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          deadline: string
          progress?: number
          chapter_number?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          assignee_id?: string | null
          status?: 'not_started' | 'in_progress' | 'needs_review' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          deadline?: string
          progress?: number
          chapter_number?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          full_name: string
          role: 'admin' | 'translator' | 'editor' | 'client'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          full_name: string
          role: 'admin' | 'translator' | 'editor' | 'client'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'translator' | 'editor' | 'client'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          project_id: string
          title: string
          chapter_number: number
          word_count: number
          status: 'not_started' | 'in_progress' | 'completed'
          translator_id: string | null
          editor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          chapter_number: number
          word_count: number
          status?: 'not_started' | 'in_progress' | 'completed'
          translator_id?: string | null
          editor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          chapter_number?: number
          word_count?: number
          status?: 'not_started' | 'in_progress' | 'completed'
          translator_id?: string | null
          editor_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'task_assigned' | 'project_update' | 'deadline_reminder' | 'system'
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'task_assigned' | 'project_update' | 'deadline_reminder' | 'system'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'task_assigned' | 'project_update' | 'deadline_reminder' | 'system'
          read?: boolean
          created_at?: string
        }
      }
    }
  }
} 