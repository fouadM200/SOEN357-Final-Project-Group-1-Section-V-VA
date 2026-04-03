import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCoach } from "../../hooks/useCoach";
import {
    ChatMessage,
    getMessages,
    saveConversation,
    saveMessages,
} from "../../utils/messageStorage";

export default function CoachChatPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const coach = useCoach(id || "");

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);

    useEffect(() => {
        const loadStoredMessages = async () => {
            if (!coach) return;

            setIsLoadingMessages(true);

            const storedMessages = await getMessages(coach.id);
            setMessages(storedMessages);

            if (storedMessages.length > 0) {
                const lastMessage = storedMessages[storedMessages.length - 1];
                await saveConversation(coach.id, lastMessage.text);
            }

            setIsLoadingMessages(false);
        };

        loadStoredMessages();
    }, [coach]);

    if (!coach) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundText}>Conversation not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const handleSend = async () => {
        const trimmed = input.trim();

        if (!trimmed || isGenerating) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: "user",
            text: trimmed,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setIsGenerating(true);

        await saveMessages(coach.id, updatedMessages);
        await saveConversation(coach.id, userMessage.text);

        try {
            const apiBaseUrl =
                process.env.EXPO_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

            const url = `${apiBaseUrl}/api/mock-coach-reply`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    coachName: coach.name,
                    coachSpecialty: coach.specialty ?? "",
                    messages: updatedMessages.slice(-8),
                }),
            });

            const data = await response.json();

            const randomDelay = 1200 + Math.floor(Math.random() * 1800);
            await wait(randomDelay);

            const coachReply: ChatMessage = {
                id: `${Date.now()}-coach`,
                sender: "coach",
                text: data.reply || "Sorry, I could not reply right now.",
                timestamp: new Date().toISOString(),
            };

            const finalMessages = [...updatedMessages, coachReply];

            setMessages(finalMessages);
            await saveMessages(coach.id, finalMessages);
            await saveConversation(coach.id, coachReply.text);
        } catch (error) {
            console.log("Frontend fetch error:", error);

            await wait(1500);

            const fallbackReply: ChatMessage = {
                id: `${Date.now()}-coach-fallback`,
                sender: "coach",
                text: "Sorry, I could not reply right now.",
                timestamp: new Date().toISOString(),
            };

            const finalMessages = [...updatedMessages, fallbackReply];

            setMessages(finalMessages);
            await saveMessages(coach.id, finalMessages);
            await saveConversation(coach.id, fallbackReply.text);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerCoachInfo}>
                        {coach.image ? (
                            <Image source={coach.image} style={styles.headerAvatar} />
                        ) : (
                            <View style={styles.headerAvatarFallback}>
                                <Ionicons name="person" size={20} color="#999" />
                            </View>
                        )}
                        <Text style={styles.headerCoachName}>{coach.name}</Text>
                    </View>

                    <View style={styles.headerIcons}>
                        <Ionicons name="call-outline" size={20} color="#fff" />
                        <Ionicons name="videocam-outline" size={20} color="#fff" />
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.messagesContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.dateChip}>
                        <Text style={styles.dateChipText}>Conversation</Text>
                    </View>

                    {isLoadingMessages ? (
                        <Text style={styles.emptyChatText}>Loading messages...</Text>
                    ) : messages.length === 0 ? (
                        <Text style={styles.emptyChatText}>
                            No messages yet. Start the conversation.
                        </Text>
                    ) : (
                        messages.map((message) => (
                            <View
                                key={message.id}
                                style={[
                                    styles.messageBubble,
                                    message.sender === "coach"
                                        ? styles.coachBubble
                                        : styles.userBubble,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        message.sender === "user" && styles.userMessageText,
                                    ]}
                                >
                                    {message.text}
                                </Text>
                            </View>
                        ))
                    )}

                    {isGenerating && (
                        <View style={[styles.messageBubble, styles.coachBubble]}>
                            <Text style={styles.messageText}>Typing...</Text>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputBar}>
                    <TouchableOpacity>
                        <Ionicons name="add" size={22} color="#999" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Type your message here..."
                        placeholderTextColor="#999"
                        value={input}
                        onChangeText={setInput}
                    />

                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#1DA1F2",
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
    },
    header: {
        backgroundColor: "#1DA1F2",
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerCoachInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    headerAvatarFallback: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#DDD",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    headerCoachName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 14,
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    dateChip: {
        alignSelf: "center",
        backgroundColor: "#E7E7E7",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    dateChipText: {
        color: "#666",
        fontSize: 12,
        fontWeight: "600",
    },
    emptyChatText: {
        textAlign: "center",
        color: "#777",
        fontSize: 14,
        marginTop: 20,
    },
    messageBubble: {
        maxWidth: "78%",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        marginBottom: 10,
    },
    coachBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#1DA1F2",
    },
    messageText: {
        fontSize: 14,
        color: "#111",
        lineHeight: 20,
    },
    userMessageText: {
        color: "#fff",
    },
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#E5E5E5",
        backgroundColor: "#fff",
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: "#F1F1F1",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: "#111",
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#1DA1F2",
        alignItems: "center",
        justifyContent: "center",
    },
});