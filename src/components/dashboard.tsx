"use client"

import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectList } from '@/components/project-list'
import { TaskList } from '@/components/task-list'
import { ClientDashboard } from '@/components/client-dashboard'
import { 
  BookOpen, 
  Users, 
  FileText, 
  Calendar,
  Plus,
  BarChart3
} from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects')
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [projectRefreshKey, setProjectRefreshKey] = useState(0)
  const [taskOpen, setTaskOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskProjectId, setTaskProjectId] = useState('')
  const [taskAssigneeId, setTaskAssigneeId] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskLoading, setTaskLoading] = useState(false)
  const [taskError, setTaskError] = useState('')
  const [tasks, setTasks] = useState<any[]>([])
  const [taskRefreshKey, setTaskRefreshKey] = useState(0)
  const { profile, isLoaded } = useUser()
  const [assignees, setAssignees] = useState<any[]>([])

  const canCreateProject = profile && (profile.role === 'admin' || profile.role === 'client')
  const canCreateTask = profile && ['admin', 'translator', 'editor'].includes(profile.role)

  useEffect(() => {
    if (!canCreateTask) return
    fetch('/api/users/list')
      .then(res => res.json())
      .then(data => {
        if (data.users) setAssignees(data.users)
      })
      .catch(() => setAssignees([]))
  }, [canCreateTask])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, deadline })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create project')
        setLoading(false)
        return
      }
      const data = await res.json()
      setProjects((prev) => [data.project, ...prev])
      setProjectRefreshKey((k) => k + 1)
      setOpen(false)
      setTitle('')
      setDescription('')
      setDeadline('')
    } catch (err) {
      setError('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setTaskLoading(true)
    setTaskError('')
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: taskProjectId,
          title: taskTitle,
          description: taskDescription,
          assignee_id: taskAssigneeId,
          priority: taskPriority,
          deadline: taskDeadline
        })
      })
      if (!res.ok) {
        const data = await res.json()
        setTaskError(data.error || 'Failed to create task')
        setTaskLoading(false)
        return
      }
      const data = await res.json()
      setTasks((prev) => [data.task, ...prev])
      setTaskRefreshKey((k) => k + 1)
      setTaskOpen(false)
      setTaskTitle('')
      setTaskDescription('')
      setTaskProjectId('')
      setTaskAssigneeId('')
      setTaskDeadline('')
      setTaskPriority('medium')
    } catch (err) {
      setTaskError('Failed to create task')
    } finally {
      setTaskLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Quality Translation Services</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            {canCreateProject && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <Input
                      placeholder="Project Title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                    <Input
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      required
                    />
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    <DialogFooter>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Project'}
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            {canCreateTask && (
              <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setTaskOpen(true)} variant="secondary">
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <Input
                      placeholder="Task Title"
                      value={taskTitle}
                      onChange={e => setTaskTitle(e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={taskDescription}
                      onChange={e => setTaskDescription(e.target.value)}
                    />
                    <select
                      className="w-full border rounded-md p-2"
                      value={taskProjectId}
                      onChange={e => setTaskProjectId(e.target.value)}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                    <Input
                      type="date"
                      value={taskDeadline}
                      onChange={e => setTaskDeadline(e.target.value)}
                      required
                    />
                    <select
                      className="w-full border rounded-md p-2"
                      value={taskPriority}
                      onChange={e => setTaskPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <select
                      className="w-full border rounded-md p-2"
                      value={taskAssigneeId}
                      onChange={e => setTaskAssigneeId(e.target.value)}
                    >
                      <option value="">Select Assignee (optional)</option>
                      {assignees.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>
                      ))}
                    </select>
                    {taskError && <div className="text-red-600 text-sm">{taskError}</div>}
                    <DialogFooter>
                      <Button type="submit" disabled={taskLoading}>
                        {taskLoading ? 'Creating...' : 'Create Task'}
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => setTaskOpen(false)}>
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 translators, 5 editors
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Due Today</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                2 urgent, 3 normal priority
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="clients">Client Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-4">
            <ProjectList refreshKey={projectRefreshKey} />
          </TabsContent>
          <TabsContent value="tasks" className="space-y-4">
            <TaskList refreshKey={taskRefreshKey} />
          </TabsContent>
          <TabsContent value="clients" className="space-y-4">
            <ClientDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 