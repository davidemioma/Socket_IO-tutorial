"use server";

import prismadb from "@/lib/prismadb";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  serverId: string;
  name: string;
  imgUrl: string;
}

export const updateServer = async ({ serverId, name, imgUrl }: Props) => {
  try {
    if (!serverId) {
      throw new Error("Server ID required");
    }

    const profile = await getAccountProfile();

    if (!profile) {
      throw new Error("Unauthorized");
    }

    await prismadb.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imgUrl,
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to update server: ${err.message}`);
  }
};
