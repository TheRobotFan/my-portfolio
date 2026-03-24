"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type UserSettings = {
  notificationsEmail: boolean
  notificationsPush: boolean
  publicProfile: boolean
  newsletter: boolean
  privateMessages: boolean
  showActivity: boolean
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("users").select("preferences").eq("id", userId).single()

  if (error || !data?.preferences) {
    // Return default settings
    return {
      notificationsEmail: true,
      notificationsPush: false,
      publicProfile: true,
      newsletter: true,
      privateMessages: true,
      showActivity: true,
    }
  }

  return data.preferences as UserSettings
}

export async function updateUserSettings(userId: string, settings: UserSettings) {
  const supabase = await createClient()

  const { error } = await supabase.from("users").update({ preferences: settings }).eq("id", userId)

  if (error) throw error

  revalidatePath("/profilo/impostazioni")
  revalidatePath("/profilo")
}
