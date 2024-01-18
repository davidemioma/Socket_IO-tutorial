"use server";

import prismadb from "@/lib/prismadb";

interface Props {
  serverId: string;
  profileId: string;
}

export const getServerById = async ({ serverId, profileId }: Props) => {
  try {
    if (!serverId && !profileId) {
      return null;
    }

    const server = await prismadb.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
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
  } catch (err) {
    return null;
  }
};
