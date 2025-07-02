"use client"

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Calendar, User } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function ProjectList({ refreshKey }: { refreshKey?: number }) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { profile, isLoaded } = useUser()
  const [editOpen, setEditOpen] = useState(false)
  const [editProject, setEditProject] = useState<any>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDeadline, setEditDeadline] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [editRefreshKey, setEditRefreshKey] = useState(0)

  useEffect(() => {
    if (!isLoaded || !profile) return
    setLoading(true)
    setError('')
    fetch('/api/projects/list')
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setProjects(data.projects)
      })
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [isLoaded, profile, refreshKey, editRefreshKey])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'Not Started':
      case 'not_started':
        return 'bg-gray-100 text-gray-800'
      case 'review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canEditProject = useCallback((project: any) => {
    if (!profile) return false
    return profile.role === 'admin' || project.client_id === profile.id
  }, [profile])

  const openEditModal = (project: any) => {
    setEditProject(project)
    setEditTitle(project.title)
    setEditDescription(project.description || '')
    setEditDeadline(project.deadline)
    setEditOpen(true)
  }

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError('')
    try {
      const res = await fetch('/api/projects/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: editProject.id,
          title: editTitle,
          description: editDescription,
          deadline: editDeadline
        })
      })
      if (!res.ok) {
        const data = await res.json()
        setEditError(data.error || 'Failed to update project')
        setEditLoading(false)
        return
      }
      setEditOpen(false)
      setEditRefreshKey((k) => k + 1)
    } catch (err) {
      setEditError('Failed to update project')
    } finally {
      setEditLoading(false)
    }
  }

  if (loading) return <div>Loading projects...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!projects.length) return <div>No projects found.</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Translation Projects</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BookOpen className="h-5 w-5 text-primary" />
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
                {canEditProject(project) && (
                  <Button size="sm" variant="outline" onClick={() => openEditModal(project)}>
                    Edit
                  </Button>
                )}
              </div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription>Client: {project.client_name || project.client_id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{project.translator_name || project.translator_id || 'Unassigned'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due: {project.deadline}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Chapters: {project.completed_chapters ?? '-'} / {project.chapters ?? '-'} completed
              </div>
            </CardContent>
          </Card>
        ))}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProject} className="space-y-4">
              <Input
                placeholder="Project Title"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description (optional)"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
              />
              <Input
                type="date"
                value={editDeadline}
                onChange={e => setEditDeadline(e.target.value)}
                required
              />
              {editError && <div className="text-red-600 text-sm">{editError}</div>}
              <DialogFooter>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 