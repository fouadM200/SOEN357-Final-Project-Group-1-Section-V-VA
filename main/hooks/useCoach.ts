import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { ImageSourcePropType } from "react-native";
import coachesData from "../data/coaches.json";
import { Coach } from "../types/coach";

const coachImages: Record<string, ImageSourcePropType> = {
    "1": require("../assets/images/coaches/Andy-Griffiths.png"),
    "2": require("../assets/images/coaches/Jessica-Harb.png"),
    "3": require("../assets/images/coaches/Amadou-Ba.png"),
};

const SUBSCRIBED_COACHES_STORAGE_KEY = "subscribedCoachIds";

let subscribedCoachIds: string[] = [];
let listeners: Array<(ids: string[]) => void> = [];
let hasHydratedSubscriptions = false;
let hydrationPromise: Promise<void> | null = null;

const notifyListeners = () => {
    listeners.forEach((listener) => listener([...subscribedCoachIds]));
};

async function hydrateSubscribedCoachIds() {
    if (hasHydratedSubscriptions) {
        return;
    }

    if (hydrationPromise) {
        await hydrationPromise;
        return;
    }

    hydrationPromise = (async () => {
        try {
            const storedIds = await AsyncStorage.getItem(
                SUBSCRIBED_COACHES_STORAGE_KEY
            );

            if (storedIds) {
                const parsedIds = JSON.parse(storedIds) as string[];

                if (Array.isArray(parsedIds)) {
                    subscribedCoachIds = parsedIds;
                }
            }
        } catch (error) {
            console.error("Failed to load subscribed coaches:", error);
        } finally {
            hasHydratedSubscriptions = true;
            hydrationPromise = null;
            notifyListeners();
        }
    })();

    await hydrationPromise;
}

async function persistSubscribedCoachIds() {
    try {
        await AsyncStorage.setItem(
            SUBSCRIBED_COACHES_STORAGE_KEY,
            JSON.stringify(subscribedCoachIds)
        );
    } catch (error) {
        console.error("Failed to save subscribed coaches:", error);
    }
}

export function useSubscribedCoachIds() {
    const [ids, setIds] = useState<string[]>(subscribedCoachIds);

    useEffect(() => {
        const listener = (newIds: string[]) => {
            setIds(newIds);
        };

        listeners.push(listener);

        hydrateSubscribedCoachIds().catch((error) => {
            console.error("Failed to hydrate subscriptions:", error);
        });

        return () => {
            listeners = listeners.filter((currentListener) => currentListener !== listener);
        };
    }, []);

    return ids;
}

export async function subscribeToCoach(id: string) {
    await hydrateSubscribedCoachIds();

    if (!subscribedCoachIds.includes(id)) {
        subscribedCoachIds = [...subscribedCoachIds, id];
        await persistSubscribedCoachIds();
        notifyListeners();
    }
}

export async function unsubscribeFromCoach(id: string) {
    await hydrateSubscribedCoachIds();

    subscribedCoachIds = subscribedCoachIds.filter(
        (coachId) => coachId !== id
    );

    await persistSubscribedCoachIds();
    notifyListeners();
}

export function useCoaches() {
    return useMemo(() => {
        return (coachesData as Coach[]).map((coach) => ({
            ...coach,
            image: coachImages[coach.id],
        }));
    }, []);
}

export function useCoach(id?: string) {
    const coaches = useCoaches();

    return useMemo(() => {
        if (!id) {
            return undefined;
        }

        return coaches.find((coach) => coach.id === id);
    }, [coaches, id]);
}