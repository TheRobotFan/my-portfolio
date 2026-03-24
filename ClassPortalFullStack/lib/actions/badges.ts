"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAllBadges() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("badges").select("*").order("requirement_value", { ascending: true })

  if (error) throw error
  return data
}

export async function getUserBadgesWithDetails(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_badges")
    .select(`
      *,
      badge:badges(*)
    `)
    .eq("user_id", userId)
    .order("earned_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getBadgeProgress(userId: string) {
  const supabase = await createClient()

  // Get total badges
  const { count: totalBadges } = await supabase.from("badges").select("*", { count: "exact", head: true })

  // Get earned badges
  const { count: earnedBadges } = await supabase
    .from("user_badges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  return {
    total: totalBadges || 0,
    earned: earnedBadges || 0,
    percentage: totalBadges ? Math.round(((earnedBadges || 0) / totalBadges) * 100) : 0,
  }
}
