import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Message, Member, Profile } from "@prisma/client";
import { useSocket } from "@/components/providers/socket-proviser";

type Props = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageProps = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({ addKey, updateKey, queryKey }: Props) => {
  const { socket } = useSocket();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageProps) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            messages: page.messages.map((msg: MessageProps) => {
              if (msg.id === message.id) {
                return message;
              }

              return msg;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageProps) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                messages: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          messages: [message, ...newData[0].messages],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, queryClient, queryKey, updateKey, addKey]);
};
