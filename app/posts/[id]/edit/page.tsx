import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPost } from "@/lib/api"
import PostForm from "@/components/post-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit an existing post",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

async function EditPostForm({ id }: { id: string }) {
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return <PostForm post={post} />
}

function EditPostSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-1/3 mb-6" />
      <Skeleton className="h-12 w-full mb-6" />
      <Skeleton className="h-40 w-full mb-6" />
      <Skeleton className="h-10 w-32" />
    </>
  )
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <Suspense fallback={<EditPostSkeleton />}>
        <EditPostForm id={params.id} />
      </Suspense>
    </main>
  )
}
