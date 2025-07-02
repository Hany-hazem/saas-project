import { supabase } from './supabase'

export async function createNotification({
  user_id,
  title,
  message,
  type = 'system',
}: {
  user_id: string
  title: string
  message: string
  type?: 'task_assigned' | 'project_update' | 'deadline_reminder' | 'system'
}) {
  return supabase.from('notifications').insert({
    user_id,
    title,
    message,
    type,
    read: false,
  })
} 