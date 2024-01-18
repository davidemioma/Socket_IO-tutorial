import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/components/MediaRoom";
import { getMember } from "@/actions/getMember";
import { redirectToSignIn } from "@clerk/nextjs";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import { getChannelById } from "@/actions/getChannelById";
import { getAccountProfile } from "@/actions/getAccountProfile";

export default async function ChannelPage({
  params,
}: {
  params: { id: string; channelId: string };
}) {
  const { id, channelId } = params;

  const profile = await getAccountProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await getChannelById(channelId);

  //This is to check if current user is a member on the server
  const currentMember = await getMember({
    serverId: id,
    profileId: profile.id,
  });

  if (!channel || !currentMember) {
    return redirect("/");
  }

  return (
    <div className="h-full bg-white dark:bg-[#313338] flex flex-col">
      <ChatHeader
        name={channel.name}
        type="channel"
        serverId={channel.serverId}
      />

      {channel.type === ChannelType.TEXT && (
        <>
          <div className="flex-1">
            <ChatMessages
              name={channel.name}
              type="channel"
              member={currentMember}
              chatId={channel.id}
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              paramKey="channelId"
              paramValue={channel.id}
            />
          </div>

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: id,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio video={false} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio video />
      )}
    </div>
  );
}
