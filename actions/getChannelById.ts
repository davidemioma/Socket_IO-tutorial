"use server";

import prismadb from "@/lib/prismadb";

export const getChannelById = async (channelId: string) => {
  try {
    if (!channelId) return null;

    const channel = await prismadb.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    return channel;
  } catch (err) {
    return null;
  }
};
