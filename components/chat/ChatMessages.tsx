"use client";

import React, { Fragment, useRef, ElementRef } from "react";
import { format } from "date-fns";
import ChatItem from "./ChatItem";
import { MessageType } from "@/types";
import { Member } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { DATE_FORMAT } from "@/lib/utils";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface Props {
  name: string;
  type: "channel" | "conversation";
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

const ChatMessages = ({
  name,
  type,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
}: Props) => {
  const queryKey = `chat:${chatId}`;

  const addKey = `chat:${chatId}:messages`;

  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);

  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  useChatSocket({ addKey, updateKey, queryKey });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.messages.length ?? 0,
  });

  if (status === "loading") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col py-4 overflow-y-auto"
      ref={chatRef}
    >
      {!hasNextPage && <div className="flex-1" />}

      {!hasNextPage && <ChatWelcome name={name} type={type} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 my-4 text-zinc-500 animate-spin" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group?.messages.map((message: MessageType) => (
              <ChatItem
                key={message.id}
                message={message}
                currentMember={member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
