"use server";

import prismadb from "@/lib/prismadb";

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    if (!memberOneId || !memberTwoId) {
      return null;
    }

    const conversation = await prismadb.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  } catch (err) {
    return null;
  }
};

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    if (!memberOneId) {
      throw new Error("Member one required");
    }

    if (!memberTwoId) {
      throw new Error("Member two required");
    }

    const conversationExists =
      (await findConversation(memberOneId, memberTwoId)) ||
      (await findConversation(memberTwoId, memberOneId));

    if (conversationExists) {
      return conversationExists;
    }

    const newConversation = await prismadb.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return newConversation;
  } catch (err: any) {
    throw new Error(`Failed to create conversation: ${err.message}`);
  }
};
