import React from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import Sidebar from "./sidebar/Sidebar";
import ServerSidebar from "./server/ServerSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  serverId: string;
}

const MobileToggle = ({ serverId }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex gap-0 p-0" side="left">
        <div className="w-[72px]">
          {/* @ts-ignore */}
          <Sidebar />
        </div>

        {/* @ts-ignore */}
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
