"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import { useParams, useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  imgUrl: string;
}

const SidebarItem = ({ id, name, imgUrl }: Props) => {
  const params = useParams();

  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <div className="mb-4">
      <ActionTooltip label={name} side="right" align="center">
        <button className="group relative flex items-center" onClick={onClick}>
          <div
            className={cn(
              "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
              params?.id !== id && "group-hover:h-[20px]",
              params?.id === id ? "h-[36px]" : "h-[8px]"
            )}
          />

          <div
            className={cn(
              "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
              params?.id === id && "bg-primary/10 text-primary rounded-[16px]"
            )}
          >
            <Image className="object-cover" src={imgUrl} fill alt="" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default SidebarItem;
