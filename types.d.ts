import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Channel, Member, Profile, Server } from "@prisma/client";

export type MemberProps = Member & {
  profile: Profile;
};

export type ServerProps = Server & {
  channels: Channel[];
  members: MemberProps[];
};

export type MessageType = Message & {
  member: MemberProps;
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
