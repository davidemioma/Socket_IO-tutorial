"use client";

import React from "react";
import { ServerProps } from "@/types";
import { Plus, Settings } from "lucide-react";
import { ChannelType, Role } from "@prisma/client";
import useInviteModal from "@/hooks/use-invite-modal";
import useCreateChannelModal from "@/hooks/use-create-channel-modal";
import ActionTooltip from "../ActionTooltip";

interface Props {
  label: string;
  role: Role;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server: ServerProps;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: Props) => {
  const inviteModal = useInviteModal();

  const createChannelModal = useCreateChannelModal();

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      {role !== Role.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => createChannelModal.onOpen({ server }, channelType)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}

      {role === Role.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => inviteModal.onOpen({ server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
