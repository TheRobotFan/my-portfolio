import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { AppuntiClient } from "@/components/appunti-client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function AppuntiLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <Skeleton className="h-6 w-20 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppuntiPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<AppuntiLoading />}>
        <AppuntiClient />
      </Suspense>
    </div>
  )
}
