"use client";

import React from "react";
import axios from "axios";
import qs from "query-string";
import FileUpload from "../FileUpload";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import useFileMessageModal from "@/hooks/use-file-message-modal";
import { fileChatData, fileChatSchema } from "@/lib/validators/file";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FileMessageModal = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(fileChatSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const fileChatModal = useFileMessageModal();

  const { apiUrl, query } = fileChatModal.data;

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();

    fileChatModal.onClose();
  };

  const onSubmit = async (values: fileChatData) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      form.reset();

      toast.success("Message sent.");

      router.refresh();

      handleClose();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Dialog open={fileChatModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>

          <DialogDescription className="text-sm sm:text-base text-center text-zinc-500">
            Send a file as a message.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="px-6 space-y-8">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          endpoint="messageFile"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FileMessageModal;
