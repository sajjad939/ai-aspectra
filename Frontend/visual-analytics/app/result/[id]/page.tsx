import ResultPage from "@/components/result-page"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResultDetail({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ResultPage jobId={params.id} />
      </Suspense>
    </main>
  )
}
