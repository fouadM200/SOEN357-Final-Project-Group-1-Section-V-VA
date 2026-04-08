import type { Coach } from "@/types/coach";

export interface SubscriptionSuccessModalProps {
    visible: boolean;
    onGoBack: () => void;
    coach: Coach;
}