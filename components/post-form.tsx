"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createPost, updatePost } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author name is too long"),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    content: string;
    author: string;
  };
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      author: post?.author || "",
    },
  });

  async function onSubmit(values: PostFormValues) {
    setLoading(true);
    try {
      if (post) {
        await updatePost(post.id, values);
        toast.success("Post updated", {
          description: "Your post has been updated.",
        });
      } else {
        await createPost(values);
        toast.success("Post created", {
          description: "Your post has been created.",
        });
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "There was an error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your post..."
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {post ? "Updating..." : "Creating..."}
                </>
              ) : post ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </Button>
            <Link href="/">
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}
