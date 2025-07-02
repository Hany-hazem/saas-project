"use client"

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Calendar, User } from 'lucide-react'
import { useUser } from '@/hooks/use-user'

export function TaskList({ refreshKey }: { refreshKey?: number }) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { profile, isLoaded } = useUser()
  const [statusUpdateKey, setStatusUpdateKey] = useState(0)

  useEffect(() => {
    if (!isLoaded || !profile) return
    setLoading(true)
    setError('')
    fetch('/api/tasks/list')
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setTasks(data.tasks)
      })
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [isLoaded, profile, refreshKey, statusUpdateKey])

  const handleStatusChange = useCallback(async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/tasks/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, status: newStatus })
      })
      if (res.ok) {
        setStatusUpdateKey((k) => k + 1)
      }
    } catch (err) {
      // Optionally show error
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'Needs Review':
      case 'needs_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Not Started':
      case 'not_started':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'Medium':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <div>Loading tasks...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!tasks.length) return <div>No tasks found.</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Translation Tasks</h3>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={task.status === 'completed'} readOnly />
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex space-x-2 items-center">
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={task.status}
                    onChange={e => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <CardDescription>Project: {task.project_title || task.project_id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{task.assignee_name || task.assignee_id || 'Unassigned'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {task.deadline}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{task.progress}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 