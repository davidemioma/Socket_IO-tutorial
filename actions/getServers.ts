"use server";

import prismadb from "@/lib/prismadb";

export const getServers = async (profileId: string) => {
  try {
    if (!profileId) {
      return [];
    }

    const servers = await prismadb.server.findMany({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });

    return servers;
  } catch (err) {
    return [];
  }
};
