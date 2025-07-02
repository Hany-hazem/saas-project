import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, isAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { profile } = user
    let query = supabase
      .from('tasks')
      .select(`*,
        assignee:users!tasks_assignee_id_fkey(full_name),
        project:projects(title)
      `)
      .order('created_at', { ascending: false })

    if (!isAdmin(profile)) {
      query = query.or(
        `assignee_id.eq.${profile.id},project_id.in.(select id from projects where client_id.eq.${profile.id} or translator_id.eq.${profile.id} or editor_id.eq.${profile.id})`
      )
    }

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map to a friendlier format
    const tasks = (data || []).map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      deadline: t.deadline,
      progress: t.progress,
      assignee_id: t.assignee_id,
      assignee_name: t.assignee?.full_name,
      project_id: t.project_id,
      project_title: t.project?.title,
      chapter_number: t.chapter_number,
      created_at: t.created_at
    }))

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 