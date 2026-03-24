"use server"

import { createClient } from "@/lib/supabase/server"
import { createNotification } from "./gamification"
import { revalidatePath } from "next/cache"

// ---------------------------------------------------------------------------
// Badge definition cache (module-level, 5-minute TTL)
// ---------------------------------------------------------------------------
interface BadgeDefinition {
    id: string
    name: string
    description: string | null
    icon_url: string | null
    requirement_type: string | null
    requirement_value: number
    rarity?: string | null
}

let badgeCache: BadgeDefinition[] = []
let badgeCacheTimestamp = 0
const BADGE_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getCachedBadges(): Promise<BadgeDefinition[]> {
    const now = Date.now()
    if (badgeCache && now - badgeCacheTimestamp < BADGE_CACHE_TTL) {
        return badgeCache
    }

    const supabase = await createClient()
    const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("requirement_value", { ascending: true })

    if (error) {
        console.error("[BadgeService] Error loading badges:", error)
        return badgeCache ?? [] // fallback to stale cache
    }

    badgeCache = data || []
    badgeCacheTimestamp = now
    return badgeCache
}

// ---------------------------------------------------------------------------
// User stats loader
// ---------------------------------------------------------------------------
interface UserStats {
    xp_points: number
    level: number
    role: string
    total_active_days: number
    consecutive_active_days: number
    total_quizzes: number
    total_comments: number
    total_materials: number
    total_discussions: number
    total_exercises: number
    total_forum_comments: number
    created_at: string
}

async function loadUserStats(userId: string): Promise<UserStats | null> {
    const supabase = await createClient()

    // Fetch user base data
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("xp_points, level, role, total_active_days, consecutive_active_days, created_at")
        .eq("id", userId)
        .single()

    if (userError || !user) {
        console.error("[BadgeService] Error loading user:", userError)
        return null
    }

    // Fetch activity counts in parallel
    const [quizRes, commentRes, materialRes, discussionRes, exerciseRes, forumCommentRes] =
        await Promise.all([
            supabase
                .from("quiz_attempts")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId),
            supabase
                .from("exercise_comments")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId),
            supabase
                .from("materials")
                .select("*", { count: "exact", head: true })
                .eq("uploaded_by", userId),
            supabase
                .from("forum_discussions")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId),
            supabase
                .from("exercises")
                .select("*", { count: "exact", head: true })
                .eq("created_by", userId),
            supabase
                .from("forum_comments")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId),
        ])

    return {
        xp_points: user.xp_points || 0,
        level: user.level || 1,
        role: user.role || "student",
        total_active_days: user.total_active_days || 0,
        consecutive_active_days: user.consecutive_active_days || 0,
        total_quizzes: quizRes.count || 0,
        total_comments: (commentRes.count || 0) + (forumCommentRes.count || 0),
        total_materials: materialRes.count || 0,
        total_discussions: discussionRes.count || 0,
        total_exercises: exerciseRes.count || 0,
        total_forum_comments: forumCommentRes.count || 0,
        created_at: user.created_at,
    }
}

// ---------------------------------------------------------------------------
// Badge condition evaluator
// ---------------------------------------------------------------------------
function evaluateBadgeCondition(badge: BadgeDefinition, stats: UserStats): boolean {
    const reqType = badge.requirement_type
    const reqVal = badge.requirement_value

    switch (reqType) {
        case "xp_earned": {
            // Exact matches for special XP milestones, >= for others
            if ([666, 7777, 9999, 99999].includes(reqVal)) {
                return stats.xp_points >= reqVal
            }
            return stats.xp_points >= reqVal
        }

        case "level_reached":
            return stats.level >= reqVal

        case "quizzes_completed": {
            // Exact matches for palindrome/special counts
            if ([101, 99].includes(reqVal)) {
                return stats.total_quizzes >= reqVal
            }
            return stats.total_quizzes >= reqVal
        }

        case "comments_posted": {
            return stats.total_comments >= reqVal
        }

        case "materials_uploaded":
            return stats.total_materials >= reqVal

        case "discussions_created": {
            return stats.total_discussions >= reqVal
        }

        case "total_active_days":
            return stats.total_active_days >= reqVal

        case "consecutive_days":
            return stats.consecutive_active_days >= reqVal

        case "profile_completed":
            // Always true for basic profile completion badges
            // But filter admin/hacker-only badges below
            return true

        default:
            return false
    }
}

// Admin/hacker-only badge names
const ADMIN_ONLY_BADGES = [
    "Amministratore Supremo",
    "Guardiano del Sistema",
    "Architetto della Comunità",
    "Giudice Supremo",
]

const HACKER_ONLY_BADGES = [
    "Hacker Leggendario",
    "Mago del Codice",
    "Architetto Digitale",
    "Guardiano del Codice",
]

const SPECIAL_ROLE_BADGES = [...ADMIN_ONLY_BADGES, ...HACKER_ONLY_BADGES]

function isRoleRestricted(badgeName: string, userRole: string): boolean {
    if (ADMIN_ONLY_BADGES.includes(badgeName)) {
        return userRole !== "admin"
    }
    if (HACKER_ONLY_BADGES.includes(badgeName)) {
        return userRole !== "hacker" && userRole !== "admin"
    }
    return false
}

// Date-based badge check
function checkDateBadges(badgeName: string): boolean {
    const now = new Date()
    const day = now.getDate()
    const month = now.getMonth() + 1 // 1-indexed
    const dayOfWeek = now.getDay() // 0 = Sunday, 5 = Friday
    const year = now.getFullYear()

    switch (badgeName) {
        case "29 Febbraio":
            return month === 2 && day === 29
        case "Venerdì 17":
            return dayOfWeek === 5 && day === 17
        case "13 del Mese":
            return day === 13 && dayOfWeek === 5
        case "Viaggiatore Temporale":
            // Significant dates (e.g., Pi day, New Year, etc.)
            return (month === 3 && day === 14) || (month === 1 && day === 1)
        default:
            return false
    }
}

const DATE_BASED_BADGES = ["29 Febbraio", "Venerdì 17", "13 del Mese", "Viaggiatore Temporale"]

// Badges that require manual/special assignment and should be skipped by auto-check
const MANUAL_ONLY_BADGES = [
    "Fondatore",
    "Beta Tester",
    "Sviluppatore",
    "Community Leader",
    "Leggenda Vivente",
    "Collezionista Divino",
    "Leggenda Urbana",
    "Mistico",
    "Oracolo",
]

// ---------------------------------------------------------------------------
// assignBadge — insert with duplicate prevention + notification
// ---------------------------------------------------------------------------
export async function assignBadge(
    userId: string,
    badgeId: string,
    badgeName: string
): Promise<boolean> {
    const supabase = await createClient()

    // Insert with ON CONFLICT DO NOTHING (the UNIQUE constraint on user_id, badge_id handles this)
    const { error } = await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badgeId,
    })

    if (error) {
        // Duplicate key error (code 23505) means badge already assigned — not an error
        if (error.code === "23505") {
            return false
        }
        console.error(`[BadgeService] Error assigning badge "${badgeName}":`, error)
        return false
    }

    // Badge was newly assigned — send notification
    try {
        await createNotification(
            userId,
            "badge_earned",
            `Hai sbloccato il badge: ${badgeName}! 🎖️`,
            badgeId
        )
    } catch (notifError) {
        console.error("[BadgeService] Error creating badge notification:", notifError)
    }

    return true
}

// ---------------------------------------------------------------------------
// checkUserBadges — main evaluation function
// ---------------------------------------------------------------------------
export async function checkUserBadges(userId: string): Promise<string[]> {
    try {
        // 1. Load user stats
        const stats = await loadUserStats(userId)
        if (!stats) return []

        // 2. Load all badge definitions (cached)
        const allBadges = await getCachedBadges()

        // 3. Load badges already assigned to this user
        const supabase = await createClient()
        const { data: earnedBadges, error: earnedError } = await supabase
            .from("user_badges")
            .select("badge_id")
            .eq("user_id", userId)

        if (earnedError) {
            console.error("[BadgeService] Error loading earned badges:", earnedError)
            return []
        }

        const earnedBadgeIds = new Set((earnedBadges || []).map((eb: { badge_id: string }) => eb.badge_id))

        // 4. Evaluate each badge
        const newlyAssigned: string[] = []

        for (const badge of allBadges) {
            // Skip if already earned
            if (earnedBadgeIds.has(badge.id)) continue

            // Skip manual-only badges
            if (MANUAL_ONLY_BADGES.includes(badge.name)) continue

            // Check role restrictions
            if (isRoleRestricted(badge.name, stats.role)) continue

            // Check date-based badges
            if (DATE_BASED_BADGES.includes(badge.name)) {
                if (checkDateBadges(badge.name)) {
                    const assigned = await assignBadge(userId, badge.id, badge.name)
                    if (assigned) newlyAssigned.push(badge.name)
                }
                continue
            }

            // Evaluate standard condition
            if (evaluateBadgeCondition(badge, stats)) {
                // Special role badges (admin/hacker exclusive with profile_completed type)
                // are already filtered by isRoleRestricted, so this is safe
                const assigned = await assignBadge(userId, badge.id, badge.name)
                if (assigned) newlyAssigned.push(badge.name)
            }
        }

        if (newlyAssigned.length > 0) {
            console.log(
                `[BadgeService] Assigned ${newlyAssigned.length} new badge(s) to user ${userId}:`,
                newlyAssigned
            )
            revalidatePath("/utente")
            revalidatePath("/badges")
        }

        return newlyAssigned
    } catch (err) {
        console.error("[BadgeService] Unexpected error in checkUserBadges:", err)
        return []
    }
}
