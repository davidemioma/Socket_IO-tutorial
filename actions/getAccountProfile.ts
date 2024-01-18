"use server";

import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";

export const getAccountProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const profile = await prismadb.profile.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    return profile;
  } catch (err) {
    return null;
  }
};
