"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types/database"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const getUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (error) {
          console.error("Error fetching user:", error)
        } else {
          setUser(data as User)
        }
      } catch (error) {
        console.error("Error in useUser:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [isClient])

  return { user, loading }
}
