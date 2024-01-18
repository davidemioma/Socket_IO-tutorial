"use client";

import React from "react";
import { Plus } from "lucide-react";
import ActionTooltip from "../ActionTooltip";
import useServerModal from "@/hooks/use-server-modal";

const SidebarAction = () => {
  const serverModal = useServerModal();

  return (
    <ActionTooltip label="Add a server" side="right" align="center">
      <button
        className="group flex items-center"
        onClick={() => serverModal.onOpen()}
      >
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
          <Plus
            className="group-hover:text-white transition text-emerald-500"
            size={25}
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default SidebarAction;
