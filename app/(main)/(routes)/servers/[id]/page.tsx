import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { getAccountProfile } from "@/actions/getAccountProfile";

export default async function ServerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const profile = await getAccountProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await prismadb.server.findUnique({
    where: {
      id,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${id}/channels/${initialChannel.id}`);
}
