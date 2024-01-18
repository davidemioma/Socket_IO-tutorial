"use client";

import React from "react";
import qs from "query-string";
import ActionTooltip from "../ActionTooltip";
import { Video, VideoOff } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const ChatVideoButton = () => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const Icon = isVideo ? VideoOff : Video;

  const label = isVideo ? "End video call" : "Start video call";

  const onClickHandler = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <ActionTooltip label={label} side="bottom">
      <button
        className="mr-4 hover:opacity-75 transition"
        onClick={onClickHandler}
      >
        <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
