import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCoach, useSubscribedCoachIds } from "@/hooks/useCoach";
import {
    ChatMessage,
    getMessages,
    saveConversation,
    saveMessages,
} from "@/utils/messageStorage";
import MessageBubble from "@/components/MessageBubble";
import MessageDateChip from "@/components/MessageDateChip";
import MessageInputBar from "@/components/MessageInputBar";

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5000";

function formatDateChipLabel(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function isSameCalendarDay(first: string, second: string) {
    const firstDate = new Date(first);
    const secondDate = new Date(second);

    return (
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    );
}

export default function CoachChatPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const coach = useCoach(id);
    const subscribedCoachIds = useSubscribedCoachIds();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const isSubscribed = useMemo(() => {
        if (!id) {
            return false;
        }

        return subscribedCoachIds.includes(id);
    }, [id, subscribedCoachIds]);

    const scrollToBottom = useCallback((animated: boolean) => {
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({ animated });
        });
    }, []);

    const loadStoredMessages = useCallback(async () => {
        if (!id) {
            return;
        }

        const storedMessages = await getMessages(id);
        setMessages(storedMessages);

        setTimeout(() => {
            scrollToBottom(false);
        }, 50);
    }, [id, scrollToBottom]);

    useEffect(() => {
        loadStoredMessages();
    }, [loadStoredMessages]);

    useFocusEffect(
        useCallback(() => {
            loadStoredMessages();
        }, [loadStoredMessages])
    );

    useEffect(() => {
        scrollToBottom(true);
    }, [messages, scrollToBottom]);

    const handleSend = async () => {
        const trimmedInput = input.trim();

        if (!trimmedInput || !id || !coach || isGenerating) {
            return;
        }

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: trimmedInput,
            timestamp: new Date().toISOString(),
        };

        const updatedMessagesAfterUser = [...messages, userMessage];
        setMessages(updatedMessagesAfterUser);
        setInput("");

        await saveMessages(id, updatedMessagesAfterUser);
        await saveConversation(id, trimmedInput);

        if (!isSubscribed) {
            const denyMessage: ChatMessage = {
                id: `coach-deny-${Date.now() + 1}`,
                sender: "coach",
                text: `You're not subscribed again with ${coach.name}. Please re-subscribe in order to communicate with the online coach again.`,
                timestamp: new Date().toISOString(),
            };

            const updatedMessagesAfterDeny = [
                ...updatedMessagesAfterUser,
                denyMessage,
            ];

            setMessages(updatedMessagesAfterDeny);
            await saveMessages(id, updatedMessagesAfterDeny);
            await saveConversation(id, denyMessage.text);
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/mock-coach-reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    coachName: coach.name,
                    coachSpecialty: coach.specialty ?? "",
                    messages: updatedMessagesAfterUser.map((message) => ({
                        sender: message.sender,
                        text: message.text,
                    })),
                }),
            });

            const rawText = await response.text();

            let data: { reply?: string } = {};

            try {
                data = JSON.parse(rawText);
            } catch {
                data = {};
            }

            const replyText =
                typeof data.reply === "string" && data.reply.trim() !== ""
                    ? data.reply.trim()
                    : "Sorry, I could not reply right now.";

            if (!response.ok) {
                console.warn(
                    `Coach reply backend returned ${response.status}: ${rawText}`
                );
            }

            const coachReply: ChatMessage = {
                id: `coach-${Date.now()}`,
                sender: "coach",
                text: replyText,
                timestamp: new Date().toISOString(),
            };

            const updatedMessagesAfterReply = [
                ...updatedMessagesAfterUser,
                coachReply,
            ];

            setMessages(updatedMessagesAfterReply);
            await saveMessages(id, updatedMessagesAfterReply);
            await saveConversation(id, coachReply.text);
        } catch (error) {
            console.error("Failed to fetch coach reply:", error);

            const fallbackReply: ChatMessage = {
                id: `coach-${Date.now()}`,
                sender: "coach",
                text: "Sorry, I could not reply right now.",
                timestamp: new Date().toISOString(),
            };

            const updatedMessagesAfterFallback = [
                ...updatedMessagesAfterUser,
                fallbackReply,
            ];

            setMessages(updatedMessagesAfterFallback);
            await saveMessages(id, updatedMessagesAfterFallback);
            await saveConversation(id, fallbackReply.text);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!coach) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Coach not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#fff"
                            onPress={() => router.back()}
                        />

                        <View style={styles.headerProfile}>
                            {coach.image ? (
                                <Image source={coach.image} style={styles.headerAvatar} />
                            ) : (
                                <View style={styles.headerAvatarFallback}>
                                    <Ionicons name="person" size={18} color="#999" />
                                </View>
                            )}

                            <Text style={styles.headerCoachName}>{coach.name}</Text>
                        </View>
                    </View>

                    <View style={styles.headerIcons}>
                        <Ionicons name="call-outline" size={22} color="#fff" />
                        <Ionicons name="videocam-outline" size={22} color="#fff" />
                    </View>
                </View>

                <ImageBackground
                    source={require("../../assets/images/wallpaper.jpg")}
                    resizeMode="cover"
                    style={styles.chatBackground}
                    imageStyle={styles.chatBackgroundImage}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesScroll}
                        contentContainerStyle={styles.messagesContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {messages.length === 0 ? (
                            <Text style={styles.emptyChatText}>No messages yet.</Text>
                        ) : (
                            messages.map((message, index) => {
                                const previousMessage = messages[index - 1];
                                const shouldShowDateChip =
                                    index === 0 ||
                                    !isSameCalendarDay(
                                        previousMessage.timestamp,
                                        message.timestamp
                                    );

                                return (
                                    <View key={message.id}>
                                        {shouldShowDateChip ? (
                                            <MessageDateChip
                                                label={formatDateChipLabel(message.timestamp)}
                                            />
                                        ) : null}

                                        <MessageBubble
                                            sender={message.sender}
                                            text={message.text}
                                            timestamp={message.timestamp}
                                        />
                                    </View>
                                );
                            })
                        )}

                        {isGenerating ? (
                            <View style={styles.typingBubble}>
                                <Text style={styles.typingText}>Typing...</Text>
                            </View>
                        ) : null}
                    </ScrollView>

                    <MessageInputBar
                        value={input}
                        onChangeText={setInput}
                        onSend={handleSend}
                        placeholder="Type your message here..."
                    />
                </ImageBackground>
            </KeyboardAvoidingView>
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
        backgroundColor: "#fff",
    },
    header: {
        height: 72,
        backgroundColor: "#1DA1F2",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    headerProfile: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
    },
    headerAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        marginRight: 10,
    },
    headerAvatarFallback: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
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
    messagesScroll: {
        flex: 1,
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
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#666",
    },
});