import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, avatar_url, xp_points, level")
    .eq("is_active", true)
    .order("xp_points", { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
