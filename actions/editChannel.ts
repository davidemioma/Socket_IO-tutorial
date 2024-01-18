"use server";

import prismadb from "@/lib/prismadb";
import { ChannelType, Role } from "@prisma/client";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  serverId: string;
  channelId: string;
  name: string;
  type: ChannelType;
}

export const editChannel = async ({
  channelId,
  serverId,
  name,
  type,
}: Props) => {
  try {
    const profile = await getAccountProfile();

    if (!channelId) {
      throw new Error("Channel Id required");
    }

    if (!serverId) {
      throw new Error("Server Id required");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    if (name === "general") {
      throw new Error("Name cannot be general");
    }

    if (!type) {
      throw new Error("Type is required");
    }

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const serverExists = await prismadb.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [Role.ADMIN, Role.MODERATOR],
            },
          },
        },
      },
    });

    if (!serverExists) {
      throw new Error("Server does not exists!");
    }

    await prismadb.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [Role.ADMIN, Role.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              name: {
                not: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to edit channel: ${err.message}`);
  }
};
