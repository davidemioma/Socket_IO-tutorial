import { redirect } from "next/navigation";
import { getMember } from "@/actions/getMember";
import { redirectToSignIn } from "@clerk/nextjs";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import { getAccountProfile } from "@/actions/getAccountProfile";
import { getOrCreateConversation } from "@/actions/conversation";
import MediaRoom from "@/components/MediaRoom";

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: { id: string; memberId: string };
  searchParams: { video?: boolean };
}) {
  const { video } = searchParams;

  const { id, memberId } = params;

  const profile = await getAccountProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  //This is to check if current user is a member on the server
  const currentMember = await getMember({
    serverId: id,
    profileId: profile.id,
  });

  const conversation = await getOrCreateConversation(
    currentMember?.id!,
    memberId
  );

  if (!currentMember) {
    return redirect("/");
  }

  if (!conversation) {
    return redirect(`/servers/${id}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="h-full bg-white dark:bg-[#313338] flex flex-col">
      <ChatHeader
        name={otherMember.profile.name}
        type="conversation"
        serverId={id}
        imgUrl={otherMember.profile.imgUrl}
      />

      {video ? (
        <MediaRoom chatId={conversation.id} audio video />
      ) : (
        <>
          <div className="flex-1">
            <ChatMessages
              name={otherMember.profile.name}
              type="conversation"
              member={currentMember}
              chatId={conversation.id}
              apiUrl="/api/direct-messages"
              socketUrl="/api/socket/direct-messages"
              socketQuery={{
                conversationId: conversation.id,
              }}
              paramKey="conversationId"
              paramValue={conversation.id}
            />
          </div>

          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
}
