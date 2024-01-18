"use client";

import React from "react";
import axios from "axios";
import qs from "query-string";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "react-hot-toast";
import EmojiPicker from "../EmojiPicker";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatData, chatSchema } from "@/lib/validators/chat";
import useFileMessageModal from "@/hooks/use-file-message-modal";
import { Form, FormItem, FormControl, FormField } from "../ui/form";

interface Props {
  name: string;
  type: "channel" | "conversation";
  apiUrl: string;
  query: Record<string, any>;
}

const ChatInput = ({ name, type, apiUrl, query }: Props) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const fileChatModal = useFileMessageModal();

  const onSubmit = async (values: chatData) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();

      toast.success("Message sent.");

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong! Try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    className="absolute top-7 left-8 h-[24px] w-[24px] flex items-center justify-center p-1 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full"
                    type="button"
                    onClick={() => fileChatModal.onOpen({ apiUrl, query })}
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>

                  <Input
                    className="bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200 px-14 py-6 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                    disabled={isLoading}
                  />

                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
