"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { leaveServer } from "@/actions/leaveServer";
import useLeaveServerModal from "@/hooks/use-leave-server-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const LeaveServerModal = () => {
  const router = useRouter();

  const leaveServerModal = useLeaveServerModal();

  const { server } = leaveServerModal.data;

  const [isLoading, setIsLoading] = useState(false);

  const onLeaveServer = async () => {
    setIsLoading(true);

    try {
      await leaveServer({ serverId: server?.id! });

      leaveServerModal.onClose();

      router.refresh();

      router.push("/");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={leaveServerModal.isOpen}
      onOpenChange={leaveServerModal.onClose}
    >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={() => leaveServerModal.onClose()}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={isLoading}
              onClick={onLeaveServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
