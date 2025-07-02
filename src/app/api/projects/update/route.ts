import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, isAdmin } from '@/lib/auth'

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { profile } = user
    const { project_id, title, description, deadline } = await req.json()
    if (!project_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // Fetch the project to check permissions
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, client_id')
      .eq('id', project_id)
      .single()
    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (!(isAdmin(profile) || project.client_id === profile.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const updateFields: any = {}
    if (title !== undefined) updateFields.title = title
    if (description !== undefined) updateFields.description = description
    if (deadline !== undefined) updateFields.deadline = deadline
    const { data, error } = await supabase
      .from('projects')
      .update(updateFields)
      .eq('id', project_id)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ project: data })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 