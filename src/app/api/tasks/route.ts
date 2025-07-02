import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, isAdmin, isTranslator, isEditor } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !(isAdmin(user.profile) || isTranslator(user.profile) || isEditor(user.profile))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { project_id, title, description, assignee_id, status, priority, deadline, progress, chapter_number } = body

    if (!project_id || !title || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id,
        title,
        description: description || null,
        assignee_id: assignee_id || null,
        status: status || 'not_started',
        priority: priority || 'medium',
        deadline,
        progress: progress || 0,
        chapter_number: chapter_number || null
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create notification for assignee
    if (data.assignee_id) {
      await createNotification({
        user_id: data.assignee_id,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: ${data.title}`,
        type: 'task_assigned',
      })
    }

    return NextResponse.json({ task: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 