import { useEffect, useMemo, useRef, useState } from "react";
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
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
import MessageBubble from "@/components/MessageBubble";
import MessageDateChip from "@/components/MessageDateChip";
import MessageInputBar from "@/components/MessageInputBar";

function formatConversationDate(dateInput: string | Date) {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${weekday}, ${month} ${day}, ${year}`;
}

function formatMessageTime(dateInput: string | Date) {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date
        .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
        .toLowerCase();
}

function isSameCalendarDay(firstDateInput: string | Date, secondDateInput: string | Date) {
    const firstDate =
        typeof firstDateInput === "string" ? new Date(firstDateInput) : firstDateInput;
    const secondDate =
        typeof secondDateInput === "string" ? new Date(secondDateInput) : secondDateInput;

    if (Number.isNaN(firstDate.getTime()) || Number.isNaN(secondDate.getTime())) {
        return false;
    }

    return (
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    );
}

export default function CoachChatPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const coach = useCoach(id || "");

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);

    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = (animated = true) => {
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({ animated });
        });
    };

    useEffect(() => {
        const loadStoredMessages = async () => {
            if (!coach) {
                setIsLoadingMessages(false);
                return;
            }

            setIsLoadingMessages(true);

            const storedMessages = await getMessages(coach.id);
            setMessages(storedMessages);

            if (storedMessages.length > 0) {
                const lastMessage = storedMessages[storedMessages.length - 1];
                await saveConversation(coach.id, lastMessage.text);
            }

            setIsLoadingMessages(false);

            setTimeout(() => {
                scrollToBottom(false);
            }, 50);
        };

        loadStoredMessages();
    }, [coach]);

    useEffect(() => {
        if (!isLoadingMessages) {
            scrollToBottom(true);
        }
    }, [messages, isLoadingMessages]);

    const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const handleSend = async () => {
        const trimmed = input.trim();

        if (!trimmed || isGenerating || !coach) {
            return;
        }

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

        scrollToBottom(true);

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

            scrollToBottom(true);
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

            scrollToBottom(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const renderedMessages = useMemo(() => {
        return messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const shouldShowDateTag =
                !previousMessage ||
                !isSameCalendarDay(previousMessage.timestamp, message.timestamp);

            return (
                <View key={message.id}>
                    {shouldShowDateTag ? (
                        <MessageDateChip
                            label={formatConversationDate(message.timestamp)}
                        />
                    ) : null}

                    <MessageBubble
                        message={message}
                        formattedTime={formatMessageTime(message.timestamp)}
                    />
                </View>
            );
        });
    }, [messages]);

    let messagesContent: React.ReactNode;

    if (isLoadingMessages) {
        messagesContent = (
            <Text style={styles.emptyChatText}>Loading messages...</Text>
        );
    } else if (messages.length === 0) {
        messagesContent = (
            <Text style={styles.emptyChatText}>
                No messages yet. Start the conversation.
            </Text>
        );
    } else {
        messagesContent = renderedMessages;
    }

    if (!coach) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundText}>Conversation not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

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

                <ImageBackground
                    source={require("../../assets/images/wallpaper.jpg")}
                    style={styles.chatBackground}
                    imageStyle={styles.chatBackgroundImage}
                    resizeMode="cover"
                >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.messagesContainer}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollToBottom(true)}
                    >
                        {messagesContent}

                        {isGenerating ? (
                            <View style={styles.typingBubble}>
                                <Text style={styles.typingText}>Typing...</Text>
                            </View>
                        ) : null}
                    </ScrollView>
                </ImageBackground>

                <MessageInputBar
                    value={input}
                    onChangeText={setInput}
                    onSend={handleSend}
                />
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
    chatBackground: {
        flex: 1,
    },
    chatBackgroundImage: {
        opacity: 0.8,
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 24,
        flexGrow: 1,
    },
    emptyChatText: {
        textAlign: "center",
        color: "#555",
        fontSize: 14,
        marginTop: 20,
    },
    typingBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        maxWidth: "78%",
    },
    typingText: {
        fontSize: 14,
        color: "#111",
        lineHeight: 20,
    },
});