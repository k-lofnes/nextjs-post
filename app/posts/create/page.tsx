import type { Metadata } from "next"
import PostForm from "@/components/post-form"

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create a new post",
}

export default function CreatePostPage() {
  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create Post</h1>
      <PostForm />
    </main>
  )
}
