"use server";

import prismadb from "@/lib/prismadb";
import { Role } from "@prisma/client";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  channelId: string;
  serverId: string;
}

export const deleteChannnel = async ({ channelId, serverId }: Props) => {
  try {
    const profile = await getAccountProfile();

    if (!channelId) {
      throw new Error("Channel Id required");
    }

    if (!serverId) {
      throw new Error("Server Id required");
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
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to delete channel: ${err.message}`);
  }
};
