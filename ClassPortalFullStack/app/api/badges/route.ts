import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  const { data, error } = await supabase.from("user_badges").select("*, badges(*)").eq("user_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
