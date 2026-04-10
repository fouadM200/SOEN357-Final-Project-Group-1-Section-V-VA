import AsyncStorage from "@react-native-async-storage/async-storage";

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

const getMessagesStorageKey = (coachId: string) => `messages_${coachId}`;
const CONVERSATIONS_STORAGE_KEY = "saved_conversations";

export async function getMessages(coachId: string): Promise<ChatMessage[]> {
    try {
        const storedMessages = await AsyncStorage.getItem(
            getMessagesStorageKey(coachId)
        );

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
        await AsyncStorage.setItem(
            getMessagesStorageKey(coachId),
            JSON.stringify(messages)
        );
    } catch (error) {
        console.error("Failed to save messages:", error);
    }
}

export async function saveConversation(
    coachId: string,
    lastMessage: string
): Promise<void> {
    try {
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

        await AsyncStorage.setItem(
            CONVERSATIONS_STORAGE_KEY,
            JSON.stringify(updatedConversations)
        );
    } catch (error) {
        console.error("Failed to save conversation:", error);
    }
}

export async function getAllConversations(): Promise<SavedConversation[]> {
    try {
        const storedConversations = await AsyncStorage.getItem(
            CONVERSATIONS_STORAGE_KEY
        );

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
        await AsyncStorage.removeItem(getMessagesStorageKey(coachId));

        const existingConversations = await getAllConversations();
        const filteredConversations = existingConversations.filter(
            (conversation) => conversation.coachId !== coachId
        );

        await AsyncStorage.setItem(
            CONVERSATIONS_STORAGE_KEY,
            JSON.stringify(filteredConversations)
        );
    } catch (error) {
        console.error("Failed to clear conversation:", error);
    }
}