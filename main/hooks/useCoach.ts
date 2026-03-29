import { useMemo, useState, useEffect } from "react";
import { ImageSourcePropType } from "react-native";
import coachesData from "../data/coaches.json";
import { Coach } from "../types/coach";

const coachImages: Record<string, ImageSourcePropType> = {
    "1": require("../assets/images/coaches/Andy-Griffiths.png"),
    "2": require("../assets/images/coaches/Jessica-Harb.png"),
    "3": require("../assets/images/coaches/Amadou-Ba.png"),
};

// Simple global-like state for subscriptions
let subscribedCoachIds: string[] = ["1"]; // Default with one for initial demo/testing as per current state
const subscribers: Set<(ids: string[]) => void> = new Set();

const notifySubscribers = () => {
    subscribers.forEach(sub => sub([...subscribedCoachIds]));
};

export const getSubscribedCoachIds = () => [...subscribedCoachIds];

export const subscribeToCoach = (id: string) => {
    if (!subscribedCoachIds.includes(id)) {
        subscribedCoachIds.push(id);
        notifySubscribers();
    }
};

export const unsubscribeFromCoach = (id: string) => {
    subscribedCoachIds = subscribedCoachIds.filter(cid => cid !== id);
    notifySubscribers();
};

export const useSubscribedCoachIds = () => {
    const [ids, setIds] = useState(subscribedCoachIds);

    useEffect(() => {
        subscribers.add(setIds);
        return () => {
            subscribers.delete(setIds);
        };
    }, []);

    return ids;
};

export const getCoach = (id: string | string[] | undefined): Coach | undefined => {
    if (!id || Array.isArray(id)) return undefined;
    const coaches = (coachesData as Coach[]).map((c) => ({
        ...c,
        image: coachImages[c.id],
    }));
    return coaches.find((c) => c.id === id);
};

export const useCoach = (id: string | string[] | undefined) => {
    return useMemo(() => getCoach(id), [id]);
};

export const useCoaches = () => {
    return useMemo(() => {
        return (coachesData as Coach[]).map((coach) => ({
            ...coach,
            image: coachImages[coach.id],
        }));
    }, []);
};
