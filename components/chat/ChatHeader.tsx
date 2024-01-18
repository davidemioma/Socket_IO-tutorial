import React from "react";
import { Hash } from "lucide-react";
import UserAvatar from "../UserAvatar";
import MobileToggle from "../MobileToggle";
import SocketIndicator from "../SocketIndicator";
import ChatVideoButton from "./ChatVideoButton";

interface Props {
  name: string;
  type: "channel" | "conversation";
  serverId: string;
  imgUrl?: string;
}

const ChatHeader = ({ name, type, serverId, imgUrl }: Props) => {
  return (
    <div className="h-12 flex-shrink-0 flex items-center px-3 font-semibold border-b border-neutral-200 dark:border-neutral-800">
      <MobileToggle serverId={serverId} />

      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}

      {type === "conversation" && (
        <UserAvatar src={imgUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}

      <p className="font-semibold text-md text-black dark:text-white">{name}</p>

      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}

        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
