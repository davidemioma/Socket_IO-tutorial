import React from "react";
import ServerSearch from "./ServerSearch";
import ServerHeader from "./ServerHeader";
import { redirect } from "next/navigation";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";
import { ScrollArea } from "../ui/scroll-area";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, Role } from "@prisma/client";
import { getServerById } from "@/actions/getServerById";
import { getAccountProfile } from "@/actions/getAccountProfile";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface Props {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: Props) => {
  const profile = await getAccountProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await getServerById({
    serverId,
    profileId: profile.id,
  });

  if (!server) {
    redirect("/");
  }

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const currentUserRole = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  };

  const roleIconMap = {
    [Role.GUEST]: null,
    [Role.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [Role.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f3f5] dark:bg-[#2b2d31] text-primary">
      {/* @ts-ignore */}
      <ServerHeader server={server} role={currentUserRole} />

      <ScrollArea className="flex-1 px-3">
        <div className="mt-3">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                info: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                info: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                info: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                info: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className="my-2 bg-zinc-200 dark:bg-zinc-700 rounded-md" />

        {textChannels.length > 0 && (
          <div className="mb-2">
            <ServerSection
              label="Text Channels"
              sectionType="channels"
              role={currentUserRole!}
              channelType={ChannelType.TEXT}
              server={server}
            />

            <div className="space-y-2">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={currentUserRole}
                />
              ))}
            </div>
          </div>
        )}

        {audioChannels.length > 0 && (
          <div className="mb-2">
            <ServerSection
              label="Voice Channels"
              sectionType="channels"
              role={currentUserRole!}
              channelType={ChannelType.AUDIO}
              server={server}
            />

            <div className="space-y-2">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={currentUserRole}
                />
              ))}
            </div>
          </div>
        )}

        {videoChannels.length > 0 && (
          <div className="mb-2">
            <ServerSection
              label="Video Channels"
              sectionType="channels"
              role={currentUserRole!}
              channelType={ChannelType.VIDEO}
              server={server}
            />

            <div className="space-y-2">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={currentUserRole}
                />
              ))}
            </div>
          </div>
        )}

        {members.length > 0 && (
          <div className="mb-2">
            <ServerSection
              label="Members"
              sectionType="members"
              role={currentUserRole!}
              server={server}
            />

            <div className="space-y-2">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
