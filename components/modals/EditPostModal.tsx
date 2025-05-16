"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import PostForm from "@/components/post-form";
import type { Post } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function EditPostModal({
  post,
  isOpen,
  onOpenChange,
}: EditPostModalProps) {
  const isMobile = useIsMobile();

  const handleFormSubmitSuccess = () => {
    onOpenChange(false); // Close the modal
  };

  useEffect(() => {
    // Client-side effects can go here
  }, [isOpen]); // Re-run if isOpen changes

  // Return null or a loader while isMobile is undefined to prevent hydration mismatch
  if (isMobile === undefined) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="p-4 pt-8 max-h-[90vh] overflow-y-auto">
          <DrawerTitle className="text-2xl font-bold mb-6 text-center">
            Edit Post
          </DrawerTitle>
          <PostForm post={post} onFormSubmitSuccess={handleFormSubmitSuccess} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="container mx-auto py-8 px-4 max-w-3xl">
        <DialogTitle className="text-3xl font-bold mb-8">Edit Post</DialogTitle>
        <PostForm post={post} onFormSubmitSuccess={handleFormSubmitSuccess} />
      </DialogContent>
    </Dialog>
  );
}
