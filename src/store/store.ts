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
    }),
    {
      name: "store-storage",
      getStorage: () => sessionStorage,
    }
  ) as any
);

export default useStore;
