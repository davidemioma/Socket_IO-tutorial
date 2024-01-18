import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { getServerById } from "@/actions/getServerById";
import ServerSidebar from "@/components/server/ServerSidebar";
import { getAccountProfile } from "@/actions/getAccountProfile";

export default async function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const profile = await getAccountProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = getServerById({
    serverId: id,
    profileId: profile.id,
  });

  if (!server) {
    redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex flex-col fixed inset-y-0 h-full w-60 border-r dark:border-0">
        {/* @ts-ignore */}
        <ServerSidebar serverId={id} />
      </div>

      <main className="md:pl-60 h-full">{children}</main>
    </div>
  );
}
