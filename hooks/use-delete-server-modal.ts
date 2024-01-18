import { create } from "zustand";
import { ServerProps } from "@/types";

interface ModalData {
  server?: ServerProps;
}

interface ModalProps {
  isOpen: boolean;
  data: ModalData;
  onOpen: (data?: ModalData) => void;
  onClose: () => void;
}

const useDeleteServerModal = create<ModalProps>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: {} }),
}));

export default useDeleteServerModal;
