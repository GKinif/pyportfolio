import create from "zustand";

type User = {
  email: string;
};

type UserState = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser) => set({ currentUser }),
}));

export const selectCurrentUser = (state: UserState) => state.currentUser;
export const selectSetCurrentUser = (state: UserState) => state.setCurrentUser;
