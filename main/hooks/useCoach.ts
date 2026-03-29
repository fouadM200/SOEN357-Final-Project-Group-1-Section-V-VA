import { useState, useMemo } from 'react';
import coachesData from '../data/coaches.json';
import { Coach } from '../types/coach';
import { ImageSourcePropType } from 'react-native';

const coachImages: Record<string, ImageSourcePropType> = {
    "1": require("../assets/images/coaches/Andy-Griffiths.png"),
    "2": require("../assets/images/coaches/Jessica-Harb.png"),
    "3": require("../assets/images/coaches/Amadou-Ba.png"),
};

// Simple global state mock (In a real app, use Context or a state library)
let subscribedCoachIds: string[] = [];
let listeners: Array<(ids: string[]) => void> = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener([...subscribedCoachIds]));
};

export function useSubscribedCoachIds() {
    const [ids, setIds] = useState<string[]>(subscribedCoachIds);

    useMemo(() => {
        const listener = (newIds: string[]) => setIds(newIds);
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    return ids;
}

export function subscribeToCoach(id: string) {
    if (!subscribedCoachIds.includes(id)) {
        subscribedCoachIds.push(id);
        notifyListeners();
    }
}

export function unsubscribeFromCoach(id: string) {
    subscribedCoachIds = subscribedCoachIds.filter(cid => cid !== id);
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

export function useCoach(id: string) {
    const coaches = useCoaches();
    return useMemo(() => coaches.find((c) => c.id === id), [coaches, id]);
}
