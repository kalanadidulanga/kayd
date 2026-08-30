import { create } from "zustand";

import type { IconType } from "@/components/icons";

interface ModalDataProps {
    title: string;
    description: string;
    icon: IconType | null;
    // link?: {
    //     label: string;
    //     link: string;
    // }
}

interface ModalStoreProps {
    isOpen: boolean;
    title: string;
    description: string;
    icon: IconType | null;
    onOpen: (data: ModalDataProps) => void;
    onClose: () => void;
}

export const useModalStore = create<ModalStoreProps>((set) => ({
    isOpen: false,
    title: "",
    description: "",
    icon: null,
    onOpen: (data: ModalDataProps) =>
        set({
            isOpen: true,
            title: data.title,
            description: data.description,
            icon: data.icon,
        }),
    onClose: () => set({ isOpen: false }),
}));
