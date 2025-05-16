"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import PostForm from "@/components/post-form";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function CreatePostModal({
  isOpen,
  onOpenChange,
}: CreatePostModalProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Client-side effects for focus management, etc.
  }, [isOpen]); // Re-run if isOpen changes, e.g., for focus trapping

  const handleSuccess = () => {
    onOpenChange(false); // Close the modal
    // The parent (app/page.tsx) will handle data refresh via onOpenChange
  };

  // Prevent hydration mismatch
  if (isMobile === undefined) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="p-4 pt-8 max-h-[90vh] overflow-y-auto">
          <DrawerTitle className="text-2xl font-bold mb-6 text-center">
            Create Post
          </DrawerTitle>
          <PostForm onFormSubmitSuccess={handleSuccess} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="container mx-auto py-8 px-4 max-w-3xl">
        <DialogTitle className="text-3xl font-bold mb-8">
          Create Post
        </DialogTitle>
        <PostForm onFormSubmitSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
