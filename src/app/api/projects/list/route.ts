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
      .from('projects')
      .select(`*,
        client:users!projects_client_id_fkey(full_name),
        translator:users!projects_translator_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false })

    if (!isAdmin(profile)) {
      query = query.or(
        `client_id.eq.${profile.id},translator_id.eq.${profile.id},editor_id.eq.${profile.id}`
      )
    }

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map to a friendlier format
    const projects = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      progress: p.progress,
      deadline: p.deadline,
      client_id: p.client_id,
      client_name: p.client?.full_name,
      translator_id: p.translator_id,
      translator_name: p.translator?.full_name,
      chapters: p.chapters,
      completed_chapters: p.completed_chapters,
      created_at: p.created_at
    }))

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 