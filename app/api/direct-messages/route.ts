import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";
import { getAccountProfile } from "@/actions/getAccountProfile";

const MESSAGE_BATCH = 10;

export async function GET(request: Request) {
  try {
    const profile = await getAccountProfile();

    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get("cursor");

    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Conversation ID required", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await prismadb.directMessage.findMany({
        where: {
          conversationId,
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
      messages = await prismadb.directMessage.findMany({
        where: {
          conversationId,
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
    console.log("GET_CONVERSATION_MESSAGES", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
