import { redirect } from "next/navigation";
import { getFirstServer } from "@/actions/getFirstServer";
import InitialModal from "@/components/modals/InitialModal";
import { getCurrentUserProfile } from "@/actions/getCurrentUserProfile";

export default async function SetupPage() {
  const profile = await getCurrentUserProfile();

  const server = await getFirstServer(profile?.id);

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
