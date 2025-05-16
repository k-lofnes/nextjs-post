"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  title: string;
  description?: string;
}

interface NotificationContextType {
  notify: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

let notificationId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Notification | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!open && current) {
      // If the dialog/drawer was open and is now closed,
      // and there was a current notification being displayed.
      timerId = setTimeout(() => {
        setNotifications((prev) => prev.slice(1)); // Original logic to remove oldest
        setCurrent(null);
        // If you wanted to show the next notification in a queue,
        // you would add logic here to check the notifications array
        // and call setCurrent and setOpen(true) for the next one.
      }, 300); // Corresponds to animation duration
    }
    return () => clearTimeout(timerId);
  }, [open, current, setNotifications]);

  const notify = (notification: Omit<Notification, "id">) => {
    notificationId += 1;
    const newNotification = { ...notification, id: notificationId };
    setNotifications((prev) => [...prev, newNotification]);
    setCurrent(newNotification);
    setOpen(true);
  };

  // Renamed from handleClose, this function is for explicit close actions like a button click.
  const triggerClose = () => {
    setOpen(false); // This will trigger the useEffect above to handle cleanup.
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {current && isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{current.title}</DrawerTitle>
              {current.description && (
                <DrawerDescription>{current.description}</DrawerDescription>
              )}
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={triggerClose} className="w-full">
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : current ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader className="text-left sm:text-center">
              {" "}
              {/* Adjusted alignment for dialog */}
              <DialogTitle>{current.title}</DialogTitle>
              {current.description && (
                <DialogDescription>{current.description}</DialogDescription>
              )}
            </DialogHeader>
            {/* Dialogs often rely on Escape key or overlay click for closing.
                An explicit close button can be added in DialogFooter if desired. */}
          </DialogContent>
        </Dialog>
      ) : null}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
