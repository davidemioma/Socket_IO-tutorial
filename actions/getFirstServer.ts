"use server";

import prismadb from "@/lib/prismadb";

export const getFirstServer = async (profileId: string) => {
  try {
    const server = await prismadb.server.findFirst({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });

    return server;
  } catch (err) {
    return null;
  }
};
