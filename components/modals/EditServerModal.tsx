"use client";

import React, { useEffect } from "react";
import FileUpload from "../FileUpload";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateServer } from "@/actions/updateServer";
import { zodResolver } from "@hookform/resolvers/zod";
import useEditServerModal from "@/hooks/use-edit-server-modal";
import { serverData, serverSchema } from "@/lib/validators/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const EditServerModal = () => {
  const router = useRouter();

  const editServerModal = useEditServerModal();

  const { server } = editServerModal.data;

  const form = useForm({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imgUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();

    editServerModal.onClose();
  };

  const onSubmit = async (values: serverData) => {
    try {
      await updateServer({
        serverId: server?.id!,
        name: values.name,
        imgUrl: values.imageUrl,
      });

      form.reset();

      toast.success("Server Updated.");

      router.refresh();

      editServerModal.onClose();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Dialog open={editServerModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Customise your server
          </DialogTitle>

          <DialogDescription className="text-sm sm:text-base text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="px-6 space-y-8">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          endpoint="serverImage"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
