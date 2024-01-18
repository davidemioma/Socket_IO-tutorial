import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { getAccountProfile } from "@/actions/getAccountProfile";

export default async function InvitePage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;

  if (!code) {
    return redirect("/");
  }

  const profile = await getAccountProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  //This means the currentUser has already joined this server.
  const serverExists = await prismadb.server.findFirst({
    where: {
      inviteCode: code,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (serverExists) {
    return redirect(`/servers/${serverExists.id}`);
  }

  const server = await prismadb.server.update({
    where: {
      inviteCode: `${code}`,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}
