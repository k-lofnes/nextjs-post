"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "./dialog";

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

  const notify = (notification: Omit<Notification, "id">) => {
    notificationId += 1;
    const newNotification = { ...notification, id: notificationId };
    setNotifications((prev) => [...prev, newNotification]);
    setCurrent(newNotification);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
      setCurrent(null);
    }, 300);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {current && isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <div className="p-4">
            <div className="font-bold text-lg mb-2">{current.title}</div>
            {current.description && <div>{current.description}</div>}
            <button
              className="mt-4 w-full btn btn-primary"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </Drawer>
      ) : current ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <div className="font-bold text-lg mb-2">{current.title}</div>
            {current.description && <div>{current.description}</div>}
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
