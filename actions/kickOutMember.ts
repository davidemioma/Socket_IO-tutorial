"use server";

import prismadb from "@/lib/prismadb";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  serverId: string;
  memberId: string;
}

export const kickOutMember = async ({ serverId, memberId }: Props) => {
  try {
    const profile = await getAccountProfile();

    if (!serverId) {
      throw new Error("Server Id required");
    }

    if (!memberId) {
      throw new Error("Member Id required");
    }

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const serverExists = await prismadb.server.findUnique({
      where: {
        id: serverId,
        profileId: profile?.id,
      },
    });

    if (!serverExists) {
      throw new Error("Server does not exists!");
    }

    const server = await prismadb.server.update({
      where: {
        id: serverId,
        profileId: profile?.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return server;
  } catch (err: any) {
    throw new Error(`Failed to kick out member: ${err.message}`);
  }
};
