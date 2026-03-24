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

  const userId = session.user.id

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", userId).single()

  // Get quiz attempts
  const { data: quizData } = await supabase.from("quiz_attempts").select("score, percentage").eq("user_id", userId)

  // Get badges
  const { data: badgeData } = await supabase.from("user_badges").select("badges(name, icon_url)").eq("user_id", userId)

  // Get exercises contributed
  const { data: exerciseData } = await supabase.from("exercises").select("id").eq("created_by", userId)

  // Get forum posts
  const { data: forumData } = await supabase.from("forum_discussions").select("id").eq("user_id", userId)

  return NextResponse.json({
    user: userData,
    quizzes: quizData?.length || 0,
    avgScore: quizData?.length ? quizData.reduce((a, b) => a + b.percentage, 0) / quizData.length : 0,
    badges: badgeData?.length || 0,
    exercisesContributed: exerciseData?.length || 0,
    forumPosts: forumData?.length || 0,
  })
}
