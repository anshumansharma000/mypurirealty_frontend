import { create } from "zustand";

type UIState = {
  interestOpen: boolean;
  activeListingId?: string;
  openInterest: (id: string) => void;
  closeInterest: () => void;
};

export const useUI = create<UIState>((set) => ({
  interestOpen: false,
  activeListingId: undefined,
  openInterest: (id) => set({ interestOpen: true, activeListingId: id }),
  closeInterest: () => set({ interestOpen: false, activeListingId: undefined }),
}));
