import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost } from "@/lib/api";
import PostForm from "@/components/post-form";

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit an existing post",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm post={post} />
    </main>
  );
}

