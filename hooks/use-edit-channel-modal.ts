import { create } from "zustand";
import { Channel, Server } from "@prisma/client";

interface ModalData {
  channel?: Channel;
  server?: Server;
}

interface ModalProps {
  isOpen: boolean;
  data: ModalData;
  onOpen: (data?: ModalData) => void;
  onClose: () => void;
}

const useEditChannelModal = create<ModalProps>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: {} }),
}));

export default useEditChannelModal;
