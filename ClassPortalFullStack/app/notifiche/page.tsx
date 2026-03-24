import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { NotificationsClient } from "@/components/notifications-client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function NotificationsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function NotifichePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<NotificationsLoading />}>
        <NotificationsClient />
      </Suspense>
    </div>
  )
}
