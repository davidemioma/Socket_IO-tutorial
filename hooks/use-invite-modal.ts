import { create } from "zustand";
import { Server } from "@prisma/client";

interface ModalData {
  server?: Server;
}

interface ModalProps {
  isOpen: boolean;
  data: ModalData;
  onOpen: (data?: ModalData) => void;
  onClose: () => void;
}

const useInviteModal = create<ModalProps>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: {} }),
}));

export default useInviteModal;
