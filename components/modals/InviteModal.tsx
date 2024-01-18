"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { useOrigin } from "@/hooks/use-origin";
import { Check, Copy, RefreshCw } from "lucide-react";
import useInviteModal from "@/hooks/use-invite-modal";
import { generateInviteLink } from "@/actions/generateInviteLink";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InviteModal = () => {
  const origin = useOrigin();

  const inviteModal = useInviteModal();

  const [copied, setCopied] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${inviteModal.data.server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const generateNewLink = async () => {
    setIsLoading(true);

    try {
      const server = await generateInviteLink({
        serverId: inviteModal.data.server?.id!,
      });

      inviteModal.onOpen({ server });
    } catch (err) {
      toast.error("Could not generate new link. Try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={inviteModal.isOpen} onOpenChange={inviteModal.onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>

          <div className="flex items-center gap-2 mt-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isLoading}
            />

            <Button onClick={onCopy} size="icon" disabled={isLoading}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <Button
            className="text-xs text-zinc-500 mt-4"
            size="sm"
            variant="link"
            onClick={generateNewLink}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
