import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, isAdmin, isEditor } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { profile } = user
    const { task_id, status } = await req.json()
    if (!task_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // Fetch the task to check permissions
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('id, assignee_id, title, project_id')
      .eq('id', task_id)
      .single()
    if (fetchError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    if (!(isAdmin(profile) || isEditor(profile) || task.assignee_id === profile.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', task_id)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Notify assignee if status was updated by someone else
    if (task.assignee_id && task.assignee_id !== profile.id) {
      await createNotification({
        user_id: task.assignee_id,
        title: 'Task Status Updated',
        message: `The status of your task "${task.title}" was updated to ${status.replace('_', ' ')}`,
        type: 'task_assigned',
      })
    }

    // Notify project client if task is completed
    if (status === 'completed') {
      const { data: project } = await supabase
        .from('projects')
        .select('client_id, title')
        .eq('id', task.project_id)
        .single()
      if (project && project.client_id) {
        await createNotification({
          user_id: project.client_id,
          title: 'Task Completed',
          message: `A task in your project "${project.title}" was marked as completed.`,
          type: 'project_update',
        })
      }
    }

    return NextResponse.json({ task: data })
  } catch (error) {
    console.error('Error updating task status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 