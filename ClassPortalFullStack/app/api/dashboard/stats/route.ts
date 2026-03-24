import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await getUser(supabase, session.user.id)
  if (!user || !["admin", "staff"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: usersData } = await supabase.from("users").select("id")
  const { data: exercisesData } = await supabase.from("exercises").select("id")
  const { data: discussionsData } = await supabase.from("forum_discussions").select("id")
  const { data: quizzesData } = await supabase.from("quiz_attempts").select("id")

  return NextResponse.json({
    totalUsers: usersData?.length || 0,
    totalExercises: exercisesData?.length || 0,
    totalDiscussions: discussionsData?.length || 0,
    totalQuizAttempts: quizzesData?.length || 0,
  })
}

async function getUser(supabase: any, userId: string) {
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data
}
