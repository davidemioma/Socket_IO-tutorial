"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "query-string";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MessageType } from "@/types";
import UserAvatar from "../UserAvatar";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import ActionTooltip from "../ActionTooltip";
import { Member, Role } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { chatData, chatSchema } from "@/lib/validators/chat";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import useDeleteMessageModal from "@/hooks/use-delete-messsage-modal";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";

interface Props {
  message: MessageType;
  currentMember: Member;
  timestamp: string;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const ChatItem = ({
  message,
  currentMember,
  timestamp,
  isUpdated,
  socketUrl,
  socketQuery,
}: Props) => {
  const params = useParams();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      content: message.content,
    },
  });

  useEffect(() => {
    form.reset({
      content: message.content,
    });
  }, [message.content]);

  const isLoading = form.formState.isSubmitting;

  const [isEditing, setIsEditing] = useState(false);

  const isOwner = currentMember.id === message.member.id;

  const isAdmin = currentMember.role === Role.ADMIN;

  const isModerator = currentMember.role === Role.MODERATOR;

  const fileType = message.fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && message.fileUrl;

  const isImage = !isPDF && message.fileUrl;

  const canEdit = !message.deleted && isOwner && !message.fileUrl;

  const canDelete = !message.deleted && (isAdmin || isModerator || isOwner);

  const show = canDelete || canEdit;

  const deleteMessageModal = useDeleteMessageModal();

  const onMemberClick = () => {
    if (message.member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.id}/conversations/${message.member.id}`);
  };

  const onSubmit = async (values: chatData) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${message.id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      toast.success("Message Updated");

      form.reset();

      setIsEditing(false);
    } catch (err) {
      toast.error("Something went wrong! Try again.");
    }
  };

  return (
    <div className="relative group w-full flex items-center p-4 hover:bg-black/5 transition">
      <div className="group w-full flex items-start gap-2">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={onMemberClick}
        >
          <UserAvatar src={message.member.profile.imgUrl} />
        </div>

        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={onMemberClick}
              >
                {message.member.profile.name}
              </p>

              <ActionTooltip label={message.member.role}>
                {/* @ts-ignore */}
                {roleIconMap[message.member.role]}
              </ActionTooltip>
            </div>

            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>

          {isImage && (
            <a
              className="relative aspect-square bg-secondary flex items-center h-48 w-48 mt-2 rounded-md overflow-hidden border"
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="object-cover"
                src={message.fileUrl}
                fill
                alt=""
              />
            </a>
          )}

          {isPDF && (
            <div className="relative bg-background/10 flex items-center p-2 mt-2 rounded-md">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

              <a
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                PDF File
              </a>
            </div>
          )}

          {!message.fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                message.deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {message.content}

              {isUpdated && !message.deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}

          {!message.fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex items-center gap-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>

      {show && (
        <div className="hidden group-hover:flex items-center gap-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEdit && (
            <ActionTooltip label={isEditing ? "Cancel" : "Edit"}>
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing((prev) => !prev)}
              />
            </ActionTooltip>
          )}

          {canDelete && (
            <ActionTooltip label="Delete">
              <Trash
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() =>
                  deleteMessageModal.onOpen({
                    apiUrl: `${socketUrl}/${message.id}`,
                    query: socketQuery,
                  })
                }
              />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
