"use server";

import prismadb from "@/lib/prismadb";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

export const getCurrentUserProfile = async () => {
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

    if (profile) {
      return profile;
    }

    const newProfile = await prismadb.profile.create({
      data: {
        clerkId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        imgUrl: user.imageUrl,
      },
    });

    return newProfile;
  } catch (err) {
    return null;
  }
};
