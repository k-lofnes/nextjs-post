import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit } from "lucide-react";
import DeleteButton from "@/components/delete-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function PostContent({ id }: { id: string }) {
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
        <CardDescription>
          By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none dark:prose-invert">
          <p className="whitespace-pre-line">{post.content}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/posts/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteButton id={id} />
        </div>
      </CardFooter>
    </Card>
  );
}

function PostSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-40 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <Suspense fallback={<PostSkeleton />}>
        <PostContent id={id} />
      </Suspense>
    </main>
  );
}

