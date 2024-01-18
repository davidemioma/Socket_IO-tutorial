"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteChannnel } from "@/actions/deleteChannel";
import useDeleteChannelModal from "@/hooks/use-delete-channel-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DeleteChannelModal = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const deleteChannelModal = useDeleteChannelModal();

  const { channel, server } = deleteChannelModal.data;

  const onDeleteChannel = async () => {
    setIsLoading(true);

    try {
      await deleteChannnel({
        channelId: channel?.id!,
        serverId: server?.id!,
      });

      deleteChannelModal.onClose();

      router.refresh();

      router.push(`/servers/${server?.id}`);
    } catch (err: any) {
      toast.error("Something went wrong. try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={deleteChannelModal.isOpen}
      onOpenChange={deleteChannelModal.onClose}
    >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="text-indigo-500 font-semibold">
              #{channel?.name}
            </span>{" "}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={() => deleteChannelModal.onClose()}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={isLoading}
              onClick={onDeleteChannel}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
