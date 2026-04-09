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

const SUBSCRIPTIONS_STORAGE_KEY = "coachSubscriptions";

export type CoachSubscription = {
    coachId: string;
    subscribedAt: string;
};

let subscriptions: CoachSubscription[] = [];
let listeners: Array<(items: CoachSubscription[]) => void> = [];
let hasHydratedSubscriptions = false;
let hydrationPromise: Promise<void> | null = null;

const notifyListeners = () => {
    listeners.forEach((listener) => listener([...subscriptions]));
};

async function hydrateSubscriptions() {
    if (hasHydratedSubscriptions) {
        return;
    }

    if (hydrationPromise) {
        await hydrationPromise;
        return;
    }

    hydrationPromise = (async () => {
        try {
            const storedSubscriptions = await AsyncStorage.getItem(
                SUBSCRIPTIONS_STORAGE_KEY
            );

            if (storedSubscriptions) {
                const parsedSubscriptions = JSON.parse(
                    storedSubscriptions
                ) as CoachSubscription[];

                if (Array.isArray(parsedSubscriptions)) {
                    subscriptions = parsedSubscriptions;
                }
            }
        } catch (error) {
            console.error("Failed to load subscriptions:", error);
        } finally {
            hasHydratedSubscriptions = true;
            hydrationPromise = null;
            notifyListeners();
        }
    })();

    await hydrationPromise;
}

async function persistSubscriptions() {
    try {
        await AsyncStorage.setItem(
            SUBSCRIPTIONS_STORAGE_KEY,
            JSON.stringify(subscriptions)
        );
    } catch (error) {
        console.error("Failed to save subscriptions:", error);
    }
}

export function useSubscriptions() {
    const [items, setItems] = useState<CoachSubscription[]>(subscriptions);

    useEffect(() => {
        const listener = (newItems: CoachSubscription[]) => {
            setItems(newItems);
        };

        listeners.push(listener);

        hydrateSubscriptions().catch((error) => {
            console.error("Failed to hydrate subscriptions:", error);
        });

        return () => {
            listeners = listeners.filter((currentListener) => currentListener !== listener);
        };
    }, []);

    return items;
}

export function useSubscribedCoachIds() {
    const items = useSubscriptions();

    return useMemo(() => {
        return items.map((item) => item.coachId);
    }, [items]);
}

export async function subscribeToCoach(id: string) {
    await hydrateSubscriptions();

    const alreadySubscribed = subscriptions.some(
        (subscription) => subscription.coachId === id
    );

    if (!alreadySubscribed) {
        subscriptions = [
            ...subscriptions,
            {
                coachId: id,
                subscribedAt: new Date().toISOString(),
            },
        ];

        await persistSubscriptions();
        notifyListeners();
    }
}

export async function unsubscribeFromCoach(id: string) {
    await hydrateSubscriptions();

    subscriptions = subscriptions.filter(
        (subscription) => subscription.coachId !== id
    );

    await persistSubscriptions();
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