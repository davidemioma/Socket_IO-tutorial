import prismadb from "@/lib/prismadb";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { getPagesAccountProfile } from "@/lib/getPagesAccountProfile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await getPagesAccountProfile(req);

    const { conversationId } = req.query;

    const { content, fileUrl } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content required" });
    }

    const conversationExists = await prismadb.conversation.findUnique({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
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

    if (!conversationExists) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversationExists.memberOne.profileId === profile.id
        ? conversationExists.memberOne
        : conversationExists.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await prismadb.directMessage.create({
      data: {
        conversationId: conversationId as string,
        memberId: member.id,
        content,
        fileUrl,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[DIRECT_MESSAGES_POST]", err);

    return res.status(500).json({ message: "Internal Error" });
  }
}
