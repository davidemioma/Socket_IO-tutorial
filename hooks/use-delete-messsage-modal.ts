import { create } from "zustand";

interface ModalData {
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalProps {
  isOpen: boolean;
  data: ModalData;
  onOpen: (data?: ModalData) => void;
  onClose: () => void;
}

const useDeleteMessageModal = create<ModalProps>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: {} }),
}));

export default useDeleteMessageModal;
