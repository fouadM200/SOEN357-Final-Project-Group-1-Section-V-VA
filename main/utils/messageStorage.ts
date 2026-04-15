import AsyncStorage from "@react-native-async-storage/async-storage";
import { getScopedStorageKey } from "@/utils/authStorage";

export type ChatMessage = {
    id: string;
    sender: "user" | "coach";
    text: string;
    timestamp: string;
};

export type SavedConversation = {
    coachId: string;
    lastMessage: string;
    updatedAt: string;
};

async function getMessagesStorageKey(coachId: string): Promise<string | null> {
    return getScopedStorageKey(`messages_${coachId}`);
}

async function getConversationsStorageKey(): Promise<string | null> {
    return getScopedStorageKey("saved_conversations");
}

export async function getMessages(coachId: string): Promise<ChatMessage[]> {
    try {
        const storageKey = await getMessagesStorageKey(coachId);

        if (!storageKey) {
            return [];
        }

        const storedMessages = await AsyncStorage.getItem(storageKey);

        if (!storedMessages) {
            return [];
        }

        const parsedMessages = JSON.parse(storedMessages) as ChatMessage[];
        return Array.isArray(parsedMessages) ? parsedMessages : [];
    } catch (error) {
        console.error("Failed to load messages:", error);
        return [];
    }
}

export async function saveMessages(
    coachId: string,
    messages: ChatMessage[]
): Promise<void> {
    try {
        const storageKey = await getMessagesStorageKey(coachId);

        if (!storageKey) {
            return;
        }

        await AsyncStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
        console.error("Failed to save messages:", error);
    }
}

export async function saveConversation(
    coachId: string,
    lastMessage: string
): Promise<void> {
    try {
        const storageKey = await getConversationsStorageKey();

        if (!storageKey) {
            return;
        }

        const existingConversations = await getAllConversations();

        const updatedConversation: SavedConversation = {
            coachId,
            lastMessage,
            updatedAt: new Date().toISOString(),
        };

        const filteredConversations = existingConversations.filter(
            (conversation) => conversation.coachId !== coachId
        );

        const updatedConversations = [
            updatedConversation,
            ...filteredConversations,
        ];

        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedConversations));
    } catch (error) {
        console.error("Failed to save conversation:", error);
    }
}

export async function getAllConversations(): Promise<SavedConversation[]> {
    try {
        const storageKey = await getConversationsStorageKey();

        if (!storageKey) {
            return [];
        }

        const storedConversations = await AsyncStorage.getItem(storageKey);

        if (!storedConversations) {
            return [];
        }

        const parsedConversations = JSON.parse(
            storedConversations
        ) as SavedConversation[];

        if (!Array.isArray(parsedConversations)) {
            return [];
        }

        return parsedConversations.sort(
            (firstConversation, secondConversation) =>
                new Date(secondConversation.updatedAt).getTime() -
                new Date(firstConversation.updatedAt).getTime()
        );
    } catch (error) {
        console.error("Failed to load conversations:", error);
        return [];
    }
}

export async function clearConversation(coachId: string): Promise<void> {
    try {
        const messageKey = await getMessagesStorageKey(coachId);
        const conversationKey = await getConversationsStorageKey();

        if (!messageKey || !conversationKey) {
            return;
        }

        await AsyncStorage.removeItem(messageKey);

        const existingConversations = await getAllConversations();
        const filteredConversations = existingConversations.filter(
            (conversation) => conversation.coachId !== coachId
        );

        await AsyncStorage.setItem(conversationKey, JSON.stringify(filteredConversations));
    } catch (error) {
        console.error("Failed to clear conversation:", error);
    }
}