import { create } from "zustand";
import { User } from "../api/types/types";
import { persist } from "zustand/middleware";

type Store = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (data: User | null) => void;
  botMessage: string;
  setBotMessage: (text: string) => void;
  matchupString: string;
  setMatchupString: (text: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
};

const useStore = create<Store>(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
      user: undefined,
      setUser: (data: User | null) => set({ user: data }),
      botMessage: "",
      setBotMessage: (text: string) => set({ botMessage: text }),
      matchupString: "",
      setMatchupString: (text: string) => set({ matchupString: text }),
      rememberMe: false,
      setRememberMe: (value: boolean) => set({ rememberMe: value }),
    }),
    {
      name: "store-storage",
      getStorage: () => localStorage,
    }
  ) as any
);

export default useStore;
