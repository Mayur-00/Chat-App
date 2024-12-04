import { create } from "zustand";

export const useThemeStore = create ((set) => ({
    setTheme: (theme) => {
        localStorage.getItem("chat-theme", theme);
        set({theme});
    },
}));