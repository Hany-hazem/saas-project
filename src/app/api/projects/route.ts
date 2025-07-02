import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, isAdmin, isClient } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !(isAdmin(user.profile) || isClient(user.profile))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, deadline } = body

    if (!title || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        description: description || null,
        client_id: user.profile.id,
        status: 'not_started',
        progress: 0,
        deadline
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 