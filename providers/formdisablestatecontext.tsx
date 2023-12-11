import { create } from "zustand";

type Store = {
  isSubmitting: boolean;
  submitTime: string | null;
  setSubmitting: (isSubmitting: boolean, submitTime: string | null) => void;
};

export const useSubmitStore = create<Store>((set) => ({
  isSubmitting:
    typeof window !== "undefined"
      ? localStorage.getItem("isSubmitting") === "true"
      : false,
  submitTime:
    typeof window !== "undefined"
      ? localStorage.getItem("submitTime") || ""
      : null,
  setSubmitting: (isSubmitting, submitTime) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isSubmitting", String(isSubmitting));
      localStorage.setItem("submitTime", submitTime || "");
    }
    set({ isSubmitting, submitTime });
  },
}));
