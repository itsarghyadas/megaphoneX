import { create } from "zustand";

type CreditsState = {
  credits: number;
  setCredits: (credits: number) => void;
};

export const useCreditsStore = create<CreditsState>((set) => {
  const initialCredits =
    typeof window !== "undefined" && localStorage.getItem("credits")
      ? parseInt(localStorage.getItem("credits")!)
      : 0;

  return {
    credits: initialCredits,
    setCredits: (credits) => {
      set({ credits });
      if (typeof window !== "undefined") {
        localStorage.setItem("credits", credits.toString());
      }
    },
  };
});
