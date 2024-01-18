"use server";

import prismadb from "@/lib/prismadb";

interface Props {
  serverId: string;
  profileId: string;
}

export const getMember = async ({ serverId, profileId }: Props) => {
  try {
    if (!serverId || !profileId) {
      return null;
    }

    const member = await prismadb.member.findFirst({
      where: {
        serverId,
        profileId,
      },
      include: {
        profile: true,
      },
    });

    return member;
  } catch (err) {
    return null;
  }
};
