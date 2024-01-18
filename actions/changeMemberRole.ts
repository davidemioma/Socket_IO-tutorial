"use server";

import { Role } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { getAccountProfile } from "./getAccountProfile";

interface Props {
  serverId: string;
  memberId: string;
  role: Role;
}

export const changeMemberRole = async ({ serverId, memberId, role }: Props) => {
  try {
    const profile = await getAccountProfile();

    if (!serverId) {
      throw new Error("Server Id required");
    }

    if (!memberId) {
      throw new Error("Member Id required");
    }

    if (!role) {
      throw new Error("Role is required");
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
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
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
    throw new Error(`Failed to change role: ${err.message}`);
  }
};
