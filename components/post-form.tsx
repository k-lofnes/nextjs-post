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
import { useNotification } from "@/components/ui/notification-provider";
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
    id: number;
    title: string;
    content: string;
    author: string;
  };
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notify } = useNotification();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      author: post?.author || "",
    },
  });

  async function onSubmit(values: PostFormValues) {
    setIsSubmitting(true);
    try {
      if (post) {
        await updatePost(post.id.toString(), values);
        notify({
          title: "Post updated",
          description: "Your post has been updated.",
        });
      } else {
        await createPost(values);
        notify({
          title: "Post created",
          description: "Your post has been created.",
        });
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      notify({
        title: "Error",
        description: "There was an error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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
                  <Input placeholder="Enter post title" {...field} />
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
                    placeholder="Enter post content"
                    className="min-h-[200px]"
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
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Link href={post ? `/posts/${post.id}` : "/"}>
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {post ? "Update" : "Create"} Post
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
