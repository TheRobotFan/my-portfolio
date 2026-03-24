"use server"

import { createClient } from "@/lib/supabase/server"

export async function getSubjects() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("subjects").select("*").order("name", { ascending: true })

  if (error) throw error
  return data
}

export async function getSubjectById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("subjects").select("*").eq("id", id).single()

  if (error) throw error
  return data
}
