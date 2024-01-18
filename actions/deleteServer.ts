"use server";

import prismadb from "@/lib/prismadb";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  serverId: string;
}

export const deleteServer = async ({ serverId }: Props) => {
  try {
    const profile = await getAccountProfile();

    if (!serverId) {
      throw new Error("Server Id required");
    }

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const serverExists = await prismadb.server.findUnique({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!serverExists) {
      throw new Error("Server does not exists!");
    }

    await prismadb.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to delete server: ${err.message}`);
  }
};
