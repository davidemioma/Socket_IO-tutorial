"use client";

import React, { useState } from "react";
import { Role } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { kickOutMember } from "@/actions/kickOutMember";
import useMembersModal from "@/hooks/use-members-modal";
import { changeMemberRole } from "@/actions/changeMemberRole";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

const MembersModal = () => {
  const router = useRouter();

  const membersModal = useMembersModal();

  const { server } = membersModal.data;

  const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  };

  const [loadingId, setLoadingId] = useState("");

  const kickOutHandler = async (memberId: string) => {
    setLoadingId(memberId);

    try {
      const response = await kickOutMember({ serverId: server?.id!, memberId });

      router.refresh();

      membersModal.onOpen({ server: response });
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoadingId("");
    }
  };

  const roleChangeHandler = async (memberId: string, role: Role) => {
    setLoadingId(memberId);

    try {
      const response = await changeMemberRole({
        serverId: server?.id!,
        memberId,
        role,
      });

      router.refresh();

      membersModal.onOpen({ server: response });
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={membersModal.isOpen} onOpenChange={membersModal.onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[420px] mt-8 pr-6">
          {server?.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 mb-6">
              <UserAvatar src={member.profile.imgUrl} />

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <span>{member.profile.name}</span>

                  <span>{roleIconMap[member.role]}</span>
                </div>

                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>

              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />

                            <span>Role</span>
                          </DropdownMenuSubTrigger>

                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  roleChangeHandler(member.id, "GUEST")
                                }
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  roleChangeHandler(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => kickOutHandler(member.id)}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

              {loadingId === member.id && (
                <Loader2 className="w-4 h-4 ml-auto text-zinc-500 animate-spin" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
