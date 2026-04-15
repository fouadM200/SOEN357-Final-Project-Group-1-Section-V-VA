import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ImageSourcePropType } from "react-native";
import coachesData from "../data/coaches.json";
import { getScopedStorageKey } from "@/utils/authStorage";

export type Coach = {
    id: string;
    name: string;
    description: string;
    specialty?: string;
    rating: number;
    price: number;
    languages: string[];
    image?: ImageSourcePropType;
};

export type SubscribedCoachRecord = {
    coachId: string;
    subscribedAt: string;
};

const coachImages: Record<string, ImageSourcePropType> = {
    "1": require("../assets/images/coaches/Andy-Griffiths.png"),
    "2": require("../assets/images/coaches/Jessica-Harb.png"),
    "3": require("../assets/images/coaches/Amadou-Ba.png"),
};

async function getSubscribedCoachStorageKey(): Promise<string | null> {
    return getScopedStorageKey("subscribedCoaches");
}

async function readSubscribedCoaches(): Promise<SubscribedCoachRecord[]> {
    try {
        const storageKey = await getSubscribedCoachStorageKey();

        if (!storageKey) {
            return [];
        }

        const storedValue = await AsyncStorage.getItem(storageKey);

        if (!storedValue) {
            return [];
        }

        const parsedValue = JSON.parse(storedValue) as SubscribedCoachRecord[];

        if (!Array.isArray(parsedValue)) {
            return [];
        }

        return parsedValue.filter(
            (item) =>
                item &&
                typeof item.coachId === "string" &&
                typeof item.subscribedAt === "string"
        );
    } catch (error) {
        console.error("Failed to load subscribed coaches:", error);
        return [];
    }
}

async function writeSubscribedCoaches(
    subscribedCoaches: SubscribedCoachRecord[]
): Promise<void> {
    try {
        const storageKey = await getSubscribedCoachStorageKey();

        if (!storageKey) {
            return;
        }

        await AsyncStorage.setItem(storageKey, JSON.stringify(subscribedCoaches));
    } catch (error) {
        console.error("Failed to save subscribed coaches:", error);
    }
}

export function useCoaches(): Coach[] {
    return useMemo(() => {
        return (coachesData as Omit<Coach, "image">[]).map((coach) => ({
            ...coach,
            image: coachImages[coach.id],
        }));
    }, []);
}

export function useCoach(id?: string): Coach | undefined {
    const coaches = useCoaches();

    return useMemo(() => {
        if (!id) {
            return undefined;
        }

        return coaches.find((coach) => coach.id === id);
    }, [coaches, id]);
}

export function useSubscribedCoachIds(): string[] {
    const [subscribedCoachIds, setSubscribedCoachIds] = useState<string[]>([]);

    useEffect(() => {
        const loadSubscribedCoachIds = async () => {
            const subscribedCoaches = await readSubscribedCoaches();
            setSubscribedCoachIds(subscribedCoaches.map((coach) => coach.coachId));
        };

        loadSubscribedCoachIds();
    }, []);

    return subscribedCoachIds;
}

export function useSubscribedCoaches(): SubscribedCoachRecord[] {
    const [subscribedCoaches, setSubscribedCoaches] = useState<
        SubscribedCoachRecord[]
    >([]);

    useEffect(() => {
        const loadSubscribedCoaches = async () => {
            const storedSubscribedCoaches = await readSubscribedCoaches();
            setSubscribedCoaches(storedSubscribedCoaches);
        };

        loadSubscribedCoaches();
    }, []);

    return subscribedCoaches;
}

export async function subscribeToCoach(coachId: string): Promise<void> {
    const existingSubscribedCoaches = await readSubscribedCoaches();

    if (existingSubscribedCoaches.some((coach) => coach.coachId === coachId)) {
        return;
    }

    const updatedSubscribedCoaches = [
        ...existingSubscribedCoaches,
        {
            coachId,
            subscribedAt: new Date().toISOString(),
        },
    ];

    await writeSubscribedCoaches(updatedSubscribedCoaches);
}

export async function unsubscribeFromCoach(coachId: string): Promise<void> {
    const existingSubscribedCoaches = await readSubscribedCoaches();

    const updatedSubscribedCoaches = existingSubscribedCoaches.filter(
        (coach) => coach.coachId !== coachId
    );

    await writeSubscribedCoaches(updatedSubscribedCoaches);
}