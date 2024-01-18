"use server";

import { v4 as uuidv4 } from "uuid";
import prismadb from "@/lib/prismadb";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  serverId: string;
}

export const generateInviteLink = async ({ serverId }: Props) => {
  try {
    const profile = await getAccountProfile();

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const server = await prismadb.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return server;
  } catch (err: any) {
    throw new Error(`Failed to generate link: ${err.message}`);
  }
};
