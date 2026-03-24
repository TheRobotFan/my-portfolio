"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import {
  getFeaturedContributors,
  addFeaturedContributor,
  updateFeaturedContributor,
  removeFeaturedContributor,
} from "@/lib/actions/featured"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FeaturedContributorsManager() {
  const [contributors, setContributors] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const featured = await getFeaturedContributors()
    setContributors(featured)

    // Load all users for selection
    const { data: users } = await supabase.from("users").select("id, full_name, email, avatar_url").order("full_name")

    setAllUsers(users || [])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await addFeaturedContributor(
        formData.get("user_id") as string,
        Number.parseInt(formData.get("contributions") as string),
        Number.parseInt(formData.get("stars") as string),
        contributors.length,
      )

      toast({ title: "Contributore aggiunto!" })
      setAddDialogOpen(false)
      loadData()
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile aggiungere il contributore", variant: "destructive" })
    }
  }

  async function handleUpdate(id: string, contributions: number, stars: number, displayOrder: number) {
    try {
      await updateFeaturedContributor(id, contributions, stars, displayOrder)
      toast({ title: "Aggiornato!" })
      loadData()
    } catch (error) {
      toast({ title: "Errore", variant: "destructive" })
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeFeaturedContributor(id)
      toast({ title: "Rimosso!" })
      loadData()
    } catch (error) {
      toast({ title: "Errore", variant: "destructive" })
    }
  }

  if (loading) return <div>Caricamento...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/60">{contributors.length} contributori in evidenza</p>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Aggiungi Contributore
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiungi Contributore in Evidenza</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Utente</label>
                <Select name="user_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona utente" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Contributi</label>
                <Input name="contributions" type="number" required defaultValue="0" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Stelle</label>
                <Input name="stars" type="number" required defaultValue="0" />
              </div>
              <Button type="submit" className="w-full">
                Aggiungi
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributors.map((contributor) => (
          <Card key={contributor.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">{contributor.avatar_url || "👤"}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(contributor.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <h3 className="font-bold mb-4">{contributor.full_name || "Utente"}</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Contributi</label>
                <Input
                  type="number"
                  defaultValue={contributor.contributions}
                  onBlur={(e) =>
                    handleUpdate(
                      contributor.id,
                      Number.parseInt(e.target.value),
                      contributor.stars,
                      contributor.display_order,
                    )
                  }
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Stelle</label>
                <Input
                  type="number"
                  defaultValue={contributor.stars}
                  onBlur={(e) =>
                    handleUpdate(
                      contributor.id,
                      contributor.contributions,
                      Number.parseInt(e.target.value),
                      contributor.display_order,
                    )
                  }
                  className="h-8"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
