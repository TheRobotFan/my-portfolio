import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { CreateExerciseClient } from "@/components/create-exercise-client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function CreateExerciseLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />
      <Card className="p-6">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </Card>
    </div>
  )
}

export default function CreateExercisePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<CreateExerciseLoading />}>
        <CreateExerciseClient />
      </Suspense>
    </div>
  )
}
