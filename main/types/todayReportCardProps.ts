import type { ReactNode } from "react";

export type TodayReportCardProps = {
    title: string;
    number: string | number;
    unit: string;
    icon: ReactNode;
    progress: number;
};