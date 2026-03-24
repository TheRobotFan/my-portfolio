import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const subject = searchParams.get("subject")
  const difficulty = searchParams.get("difficulty")
  const search = searchParams.get("search")

  let query = supabase.from("exercises").select("*, subjects(name)")

  if (subject) query = query.eq("subject_id", subject)
  if (difficulty) query = query.eq("difficulty", difficulty)
  if (search) query = query.ilike("title", `%${search}%`)

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { data, error } = await supabase
    .from("exercises")
    .insert({
      ...body,
      created_by: session.user.id,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 201 })
}
