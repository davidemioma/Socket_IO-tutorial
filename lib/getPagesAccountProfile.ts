import { NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";
import { getAuth } from "@clerk/nextjs/server";

export const getPagesAccountProfile = async (req: NextApiRequest) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return null;
    }

    const profile = await prismadb.profile.findUnique({
      where: {
        clerkId: userId,
      },
    });

    return profile;
  } catch (err) {
    return null;
  }
};
