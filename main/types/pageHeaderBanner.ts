import type { ReactNode } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export type HeaderButton = {
    label: string;
    onPress?: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    active?: boolean;
};

export type PageHeaderBannerProps = {
    title: string;
    description?: string;
    buttons?: HeaderButton[];
    logo?: ReactNode;
    leftAccessory?: ReactNode;
};