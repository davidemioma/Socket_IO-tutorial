"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteServer } from "@/actions/deleteServer";
import useDeleteServerModal from "@/hooks/use-delete-server-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DeleteServerModal = () => {
  const router = useRouter();

  const deleteServerModal = useDeleteServerModal();

  const { server } = deleteServerModal.data;

  const [isLoading, setIsLoading] = useState(false);

  const onDeleteServer = async () => {
    setIsLoading(true);

    try {
      await deleteServer({ serverId: server?.id! });

      deleteServerModal.onClose();

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
      open={deleteServerModal.isOpen}
      onOpenChange={deleteServerModal.onClose}
    >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="text-indigo-500 font-semibold">
              {server?.name}
            </span>{" "}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={() => deleteServerModal.onClose()}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={isLoading}
              onClick={onDeleteServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
