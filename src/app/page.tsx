import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'

export default async function HomePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return <Dashboard />
} 