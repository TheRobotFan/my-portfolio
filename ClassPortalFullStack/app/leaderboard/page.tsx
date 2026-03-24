import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getLeaderboard } from "@/lib/actions/user"
import { LeaderboardClient } from "@/components/leaderboard-client"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const topUsers = await getLeaderboard(50)

  return <LeaderboardClient users={topUsers} currentUserId={user.id} />
}
