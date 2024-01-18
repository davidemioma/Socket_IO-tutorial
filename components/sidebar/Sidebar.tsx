import React from "react";
import SidebarItem from "./SidebarItem";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SidebarAction from "./SidebarAction";
import { Separator } from "../ui/separator";
import { ModeToggle } from "../ModeToggle";
import { ScrollArea } from "../ui/scroll-area";
import { getServers } from "@/actions/getServers";
import { getAccountProfile } from "@/actions/getAccountProfile";

const Sidebar = async () => {
  const profile = await getAccountProfile();

  if (!profile) {
    redirect("/");
  }

  const servers = await getServers(profile.id);

  return (
    <div className="w-full h-full flex flex-col gap-4 py-3 bg-[#e3e5e8] dark:bg-[#1e1f22] text-primary">
      <SidebarAction />

      <Separator className="h-[2px] w-10 mx-auto bg-zinc-300 dark:bg-zinc-700 rounded-md" />

      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <SidebarItem
            key={server.id}
            id={server.id}
            name={server.name}
            imgUrl={server.imgUrl}
          />
        ))}
      </ScrollArea>

      <div className="flex flex-col items-center gap-4 pb-3">
        <ModeToggle />

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[40px] w-[40px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
