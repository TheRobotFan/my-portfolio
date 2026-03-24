import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { checkUserBadges } from "@/lib/actions/badge-service"

/**
 * Periodic badge verification endpoint.
 * Runs badge checks for ALL active users.
 *
 * Protected by Authorization header using SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage:
 *   curl -H "Authorization: Bearer <SERVICE_ROLE_KEY>" https://your-app.com/api/cron/badge-check
 *
 * Recommended: Set up as a daily cron job (e.g., Vercel Cron, GitHub Actions).
 */
export async function GET(request: Request) {
    // Authenticate the request
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!expectedToken || !authHeader || authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const supabase = await createAdminClient()

        // Fetch all active user IDs
        const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id")
            .eq("is_active", true)

        if (usersError) {
            return NextResponse.json({ error: usersError.message }, { status: 500 })
        }

        if (!users || users.length === 0) {
            return NextResponse.json({ message: "No active users found", assigned: [] })
        }

        // Process users in batches of 10 to avoid overwhelming the DB
        const BATCH_SIZE = 10
        const allAssigned: { userId: string; badges: string[] }[] = []

        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE)
            const results = await Promise.allSettled(
                batch.map(async (user: { id: string }) => {
                    const badges = await checkUserBadges(user.id)
                    return { userId: user.id, badges }
                })
            )

            for (const result of results) {
                if (result.status === "fulfilled" && result.value.badges.length > 0) {
                    allAssigned.push(result.value)
                }
            }
        }

        return NextResponse.json({
            message: `Badge check completed for ${users.length} users`,
            totalUsers: users.length,
            usersWithNewBadges: allAssigned.length,
            assigned: allAssigned,
        })
    } catch (err) {
        console.error("[CronBadgeCheck] Error:", err)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
