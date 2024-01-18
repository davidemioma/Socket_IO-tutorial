"use client";

import React, { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import useDeleteMessageModal from "@/hooks/use-delete-messsage-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DeleteMessageModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteMessageModal = useDeleteMessageModal();

  const { apiUrl, query } = deleteMessageModal.data;

  const onDeleteMessage = async () => {
    setIsLoading(true);

    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);

      deleteMessageModal.onClose();
    } catch (err: any) {
      toast.error("Something went wrong. try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={deleteMessageModal.isOpen}
      onOpenChange={deleteMessageModal.onClose}
    >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={() => deleteMessageModal.onClose()}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={isLoading}
              onClick={onDeleteMessage}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
