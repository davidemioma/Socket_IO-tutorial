import prismadb from "@/lib/prismadb";
import { Role } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { getPagesAccountProfile } from "@/lib/getPagesAccountProfile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await getPagesAccountProfile(req);

    const { id, serverId, channelId } = req.query;

    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Message ID required" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID required" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID required" });
    }

    const serverExists = await prismadb.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!serverExists) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await prismadb.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = serverExists.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    let message = await prismadb.message.findFirst({
      where: {
        id: id as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;

    const isAdmin = member.role === Role.ADMIN;

    const isModerator = member.role === Role.MODERATOR;

    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await prismadb.message.update({
        where: {
          id: id as string,
        },
        data: {
          content: "This message has been deleted.",
          fileUrl: null,
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await prismadb.message.update({
        where: {
          id: id as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[MESSAGES_PATCH_AND_DELETE]", err);

    return res.status(500).json({ message: "Internal Error" });
  }
}
