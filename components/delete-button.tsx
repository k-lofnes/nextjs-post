"use client";

import { useState } from "react"; // Removed useTransition
// Removed useRouter
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash } from "lucide-react";
import { deletePost } from "@/lib/api";
import { toast } from "sonner";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Import DropdownMenuItem

interface DeleteButtonProps {
  id: string;
  postTitle?: string;
  isMenuItem?: boolean; // Add isMenuItem prop
  onDeleteSuccess?: () => void; // Add onDeleteSuccess prop for callback
}

export default function DeleteButton({
  id,
  postTitle,
  isMenuItem,
  onDeleteSuccess,
}: DeleteButtonProps) {
  // const router = useRouter(); // Removed unused router
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  // const [isPending, startTransition] = useTransition(); // Removed unused useTransition

  async function handleDelete() {
    setIsDeleting(true);
    setOpen(false); // Close modal before operation
    try {
      await deletePost(id);
      toast.success(
        postTitle
          ? `"${postTitle}" has been deleted successfully.`
          : "Your post has been deleted successfully."
      );
      if (onDeleteSuccess) {
        onDeleteSuccess(); // Call the callback
      }
    } catch {
      toast.error("There was an error deleting your post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  const TriggerButton = isMenuItem ? (
    <DropdownMenuItem
      onSelect={(e: Event) => e.preventDefault()} // Prevent default closing dropdown, added Event type
      onClick={() => setOpen(true)}
      className="flex items-center text-destructive focus:text-destructive focus:bg-destructive/10"
    >
      <Trash className="h-4 w-4 text-destructive" />
      Delete
    </DropdownMenuItem>
  ) : (
    <Button
      variant="destructive"
      onClick={() => setOpen(true)}
      className="flex items-center"
      disabled={isDeleting} // Disable if already processing from a previous click (though modal should prevent this)
    >
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </Button>
  );

  const ConfirmDeleteButton = (
    <Button
      onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
        // Added event type
        e.preventDefault();
        await handleDelete();
      }}
      className="bg-destructive text-white rounded-full hover:bg-destructive/90 flex-1"
      disabled={isDeleting}
    >
      {isDeleting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        "Delete message"
      )}
    </Button>
  );

  return (
    <>
      {TriggerButton}

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-4">
            <DrawerHeader className="text-left">
              <AlertTriangle className="mb-2 !size-10 text-destructive bg-destructive/10 p-2 rounded-full" />
              <DrawerTitle>Delete message?</DrawerTitle>
              <DrawerDescription className="text-black">
                Are you sure you want to delete the message? Once the message is
                deleted, it can not be restored or accessed again
                {postTitle ? ` "${postTitle}"` : " your post"}.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex-col gap-4 pt-4">
              {ConfirmDeleteButton}
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1 rounded-full"
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <AlertTriangle className="mb-2 !size-10 text-destructive bg-destructive/10 p-2 rounded-full" />
              <DialogTitle>Delete message?</DialogTitle>
              <DialogDescription className="text-black">
                Are you sure you want to delete the message? Once the message is
                deleted, it can not be restored or accessed again
                {postTitle ? ` "${postTitle}"` : " your post"}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col gap-4 pt-4">
              {ConfirmDeleteButton}
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1 rounded-full"
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

