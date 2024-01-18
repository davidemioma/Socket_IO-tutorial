import prismadb from "@/lib/prismadb";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAccountProfile } from "@/actions/getAccountProfile";

const MESSAGE_BATCH = 10;

export async function GET(request: Request) {
  try {
    const profile = await getAccountProfile();

    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get("cursor");

    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID required", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await prismadb.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await prismadb.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGE_BATCH,
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({ messages, nextCursor });
  } catch (err) {
    console.log("GET_CHANNEL_MESSAGES", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
