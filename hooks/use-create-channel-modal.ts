import { create } from "zustand";
import { ServerProps } from "@/types";
import { ChannelType } from "@prisma/client";

interface ModalData {
  server?: ServerProps;
}

interface ModalProps {
  isOpen: boolean;
  data: ModalData;
  channelType?: ChannelType;
  onOpen: (data?: ModalData, channelType?: ChannelType) => void;
  onClose: () => void;
}

const useCreateChannelModal = create<ModalProps>((set) => ({
  isOpen: false,
  data: {},
  channelType: "TEXT",
  onOpen: (data = {}, channelType = "TEXT") =>
    set({ isOpen: true, data, channelType }),
  onClose: () => set({ isOpen: false, data: {} }),
}));

export default useCreateChannelModal;
