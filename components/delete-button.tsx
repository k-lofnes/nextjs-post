"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { deletePost } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

interface DeleteButtonProps {
  id: string;
  postTitle?: string;
}

export default function DeleteButton({ id, postTitle }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const { notify } = useNotification();
  const isMobile = useIsMobile();

  async function handleDelete() {
    setIsDeleting(true);
    setOpen(false);
    try {
      await deletePost(id);
      router.push("/");
      router.refresh();
      notify({
        title: postTitle
          ? `"${postTitle}" has been deleted successfully.`
          : "Your post has been deleted successfully.",
      });
    } catch {
      notify({
        title: "Error deleting post",
        description: "There was an error deleting your post. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const DeleteButton = (
    <Button
      onClick={async (e) => {
        e.preventDefault();
        await handleDelete();
      }}
      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1"
      disabled={isDeleting}
    >
      {isDeleting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        "Delete"
      )}
    </Button>
  );

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        className="flex items-center"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone. This will permanently delete
                {postTitle ? ` "${postTitle}"` : " your post"}.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex gap-2 pt-2">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              {DeleteButton}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete
                {postTitle ? ` "${postTitle}"` : " your post"}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 pt-4">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              {DeleteButton}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

