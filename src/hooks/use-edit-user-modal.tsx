import { create } from "zustand";

interface EditUserModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useEditUserModal = create<EditUserModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useEditUserModal;
