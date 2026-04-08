import type { Coach } from "@/types/coach";

export interface UnsubscribeModalProps {
    visible: boolean;
    onCancel: () => void;
    onUnsubscribe: () => void;
    coach: Coach;
}