import AsyncStorage from "@react-native-async-storage/async-storage";

const CONVERSATIONS_KEY = "fitfuel_conversations";

export type ConversationEntry = {
    coachId: string;
    lastMessage?: string;
    updatedAt?: string;
};

export async function getConversations(): Promise<ConversationEntry[]> {
    try {
        const value = await AsyncStorage.getItem(CONVERSATIONS_KEY);
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
}

export async function saveConversation(coachId: string, lastMessage?: string) {
    try {
        const existing = await getConversations();
        const filtered = existing.filter((item) => item.coachId !== coachId);

        const updated: ConversationEntry[] = [
            {
                coachId,
                lastMessage: lastMessage ?? "Open your conversation.",
                updatedAt: new Date().toISOString(),
            },
            ...filtered,
        ];

        await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
    } catch {
        // ignore storage errors for now
    }
}