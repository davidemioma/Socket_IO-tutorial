"use server";

import prismadb from "@/lib/prismadb";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  serverId: string;
}

export const leaveServer = async ({ serverId }: Props) => {
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
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
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
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to leave server: ${err.message}`);
  }
};
