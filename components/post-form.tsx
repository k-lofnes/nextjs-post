"use client";

import { useState, useTransition } from "react"; // Kept useTransition
import { useRouter } from "next/navigation";
// Removed Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
// Removed Card from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // Removed FormLabel from "@/components/ui/form"
  FormMessage,
} from "@/components/ui/form";
// Removed Input from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Kept Loader2, removed ArrowLeft
import { createPost, updatePost } from "@/lib/api";
import CustomInputField from "./custom-input-field";

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
  onFormSubmitSuccess?: () => void; // Add callback prop
}

export default function PostForm({ post, onFormSubmitSuccess }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, startTransition] = useTransition(); // Removed isPending

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      author: post?.author || "",
    },
    mode: "onChange", // Validate on change to update isValid status promptly
  });

  async function onSubmit(values: PostFormValues) {
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        if (post) {
          await updatePost(post.id.toString(), values);
          toast.success("Post updated successfully!");
          if (onFormSubmitSuccess) {
            onFormSubmitSuccess();
          } else {
            router.push("/");
            router.refresh();
          }
        } else {
          await createPost(values);
          toast.success("Post created successfully!");
          if (onFormSubmitSuccess) {
            onFormSubmitSuccess();
          } else {
            router.push("/");
            router.refresh();
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsSubmitting(false); // Ensure isSubmitting is reset
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomInputField
                  autoFocus
                  title="Title"
                  placeholder="Enter post title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author" // Added author field
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomInputField
                  title="Author"
                  placeholder="Enter author's name"
                  {...field}
                />
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

        <div className="flex">
          <Button
            className="rounded-full w-full"
            type="submit"
            disabled={
              isSubmitting ||
              !form.formState.isValid || // Use form's overall validity
              (post && !form.formState.isDirty) // Keep this for update mode
            }
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {post ? "Update" : "Create"} Post
          </Button>
        </div>
      </form>
    </Form>
  );
}
