"use client"

import { useUser as useClerkUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { UserProfile } from "@/lib/auth"

export function useUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn || !clerkUser) {
      setProfile(null)
      setLoading(false)
      return
    }

    // Fetch user profile from Supabase
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data.profile)
        } else {
          console.error('Failed to fetch user profile')
          setProfile(null)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [clerkUser, isLoaded, isSignedIn])

  return {
    user: clerkUser,
    profile,
    isLoaded: isLoaded && !loading,
    isSignedIn
  }
} 