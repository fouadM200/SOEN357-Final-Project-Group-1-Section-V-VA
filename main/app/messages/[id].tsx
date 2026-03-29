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
import { saveConversation } from "../../utils/messageStorage";

type ChatMessage = {
    sender: "user" | "coach";
    text: string;
};

export default function CoachChatPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const coach = useCoach(id || "");

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (coach) {
            const initialMessages = getMockMessages(coach.name);
            setMessages(initialMessages);

            saveConversation(
                coach.id,
                initialMessages[initialMessages.length - 1]?.text || `Conversation with ${coach.name}`
            );
        }
    }, [coach]);

    if (!coach) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundText}>Conversation not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isGenerating) return;

        const updatedMessages: ChatMessage[] = [
            ...messages,
            { sender: "user", text: trimmed },
        ];

        setMessages(updatedMessages);
        setInput("");
        setIsGenerating(true);

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/mock-coach-reply`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        coachName: coach.name,
                        coachSpecialty: coach.specialty ?? "",
                        messages: updatedMessages.slice(-6),
                    }),
                }
            );

            const data = await response.json();

            const randomDelay = 1200 + Math.floor(Math.random() * 1800);
            await wait(randomDelay);

            const coachReply: ChatMessage = {
                sender: "coach",
                text: data.reply || "Sorry, I could not reply right now.",
            };

            const finalMessages = [...updatedMessages, coachReply];
            setMessages(finalMessages);

            await saveConversation(coach.id, coachReply.text);
        } catch {
            await wait(1500);

            const fallbackReply: ChatMessage = {
                sender: "coach",
                text: "Sorry, I could not reply right now.",
            };

            const finalMessages = [...updatedMessages, fallbackReply];
            setMessages(finalMessages);

            await saveConversation(coach.id, fallbackReply.text);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
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
                        <Text style={styles.dateChipText}>March 29, 2026</Text>
                    </View>

                    {messages.map((message, index) => (
                        <View
                            key={index}
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
                    ))}

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

                    <TouchableOpacity
                        style={styles.micButton}
                        onPress={handleSend}
                    >
                        <Ionicons name="send" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

function getMockMessages(coachName: string): ChatMessage[] {
    return [
        {
            sender: "coach",
            text: `Hi! I’m ${coachName}. I reviewed your profile and I can help you build a realistic fitness plan.`,
        },
        {
            sender: "user",
            text: "That sounds great. My main goal is fat loss and improving consistency.",
        },
        {
            sender: "coach",
            text: "Perfect. We can start with 3 to 4 workouts per week and a simple calorie target.",
        },
    ];
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
    },
    header: {
        backgroundColor: "#1DA1F2",
        paddingHorizontal: 16,
        paddingVertical: 14,
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
        backgroundColor: "#EEE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    headerCoachName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        flexShrink: 1,
    },
    headerIcons: {
        flexDirection: "row",
        gap: 12,
        marginLeft: 10,
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    dateChip: {
        alignSelf: "center",
        backgroundColor: "#EAEAEA",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 16,
    },
    dateChipText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
    },
    messageBubble: {
        maxWidth: "80%",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
    },
    coachBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF",
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#111111",
    },
    messageText: {
        fontSize: 14,
        color: "#222",
        lineHeight: 20,
    },
    userMessageText: {
        color: "#fff",
    },
    inputBar: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 12,
        backgroundColor: "#fff",
        borderRadius: 22,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#111",
    },
    micButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#1DA1F2",
        justifyContent: "center",
        alignItems: "center",
    },
});