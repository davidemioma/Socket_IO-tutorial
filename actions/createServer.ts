"use server";

import { v4 as uuidv4 } from "uuid";
import { Role } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

interface Props {
  name: string;
  imgUrl: string;
}

export const createServer = async ({ name, imgUrl }: Props) => {
  try {
    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const profile = await prismadb.profile.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!profile) {
      throw new Error("Unauthorized");
    }

    await prismadb.server.create({
      data: {
        profileId: profile.id,
        name,
        imgUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              profileId: profile.id,
              name: "general",
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: Role.ADMIN,
            },
          ],
        },
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to create server: ${err.message}`);
  }
};
