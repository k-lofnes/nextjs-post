import { Suspense } from "react"
import Link from "next/link"
import { getPosts } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function PostsList() {
  const posts = await getPosts()

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No posts found</h2>
        <p className="mb-4">Get started by creating your first post</p>
        <Link href="/posts/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1">{post.title}</CardTitle>
            <CardDescription>
              By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="line-clamp-3">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/posts/${post.id}`}>
              <Button variant="outline">View</Button>
            </Link>
            <Link href={`/posts/${post.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function PostsListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-24 mt-2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/posts/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>
      <Suspense fallback={<PostsListSkeleton />}>
        <PostsList />
      </Suspense>
    </main>
  )
}
