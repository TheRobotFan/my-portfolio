"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autenticato")

  const { error } = await supabase.from("notifications").delete().eq("id", notificationId).eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/notifiche")
}

export async function deleteAllNotifications(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").delete().eq("user_id", userId)

  if (error) throw error

  revalidatePath("/notifiche")
}
