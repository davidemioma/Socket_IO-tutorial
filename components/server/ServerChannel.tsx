"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import { useParams, useRouter } from "next/navigation";
import useEditChannelModal from "@/hooks/use-edit-channel-modal";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { Channel, Role, Server, ChannelType } from "@prisma/client";
import useDeleteChannelModal from "@/hooks/use-delete-channel-modal";

interface Props {
  channel: Channel;
  server: Server;
  role?: Role;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: Props) => {
  const params = useParams();

  const router = useRouter();

  const Icon = iconMap[channel.type];

  const editChannelModal = useEditChannelModal();

  const deleteChannelModal = useDeleteChannelModal();

  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation();

    editChannelModal.onOpen({ channel, server });
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    deleteChannelModal.onOpen({ channel, server });
  };

  const onClickHandler = () => {
    router.push(`/servers/${params?.id}/channels/${channel.id}`);
  };

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={onClickHandler}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />

      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>

      {channel.name !== "general" && role !== Role.GUEST && (
        <div className="ml-auto flex items-center gap-2">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={onEdit}
            />
          </ActionTooltip>

          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={onDelete}
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
