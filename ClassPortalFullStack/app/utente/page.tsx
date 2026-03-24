import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/user"

export default async function UtenteRedirectPage() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Redirect to the user's own profile
  redirect(`/utente/${user.id}`)
}
