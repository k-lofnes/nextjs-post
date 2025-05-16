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
        <CardTitle className="text-2xl leading-6 font-semibold">
          {post.title}
        </CardTitle>
        <CardDescription className="text-[16px] leading-4">
          <span className="text-[#6B7280]">
            {" "}
            {new Date(post.createdAt).toLocaleDateString("no-NB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}{" "}
            (
            {new Date(post.createdAt).toLocaleTimeString("no-NB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            ){" "}
          </span>
          <span className="text-[#4F46E5]">
            Edited:{" "}
            {new Date(post.updatedAt).toLocaleDateString("no-NB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}{" "}
            (
            {new Date(post.updatedAt).toLocaleTimeString("no-NB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            )
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-none">
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

