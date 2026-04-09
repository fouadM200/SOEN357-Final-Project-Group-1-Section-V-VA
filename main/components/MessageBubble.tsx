import { StyleSheet, Text, View } from "react-native";
import type { ChatMessage } from "@/utils/messageStorage";

type MessageBubbleProps = {
    message: ChatMessage;
    formattedTime: string;
};

export default function MessageBubble({
                                          message,
                                          formattedTime,
                                      }: Readonly<MessageBubbleProps>) {
    const isUserMessage = message.sender === "user";

    return (
        <View
            style={[
                styles.messageBubble,
                isUserMessage ? styles.userBubble : styles.coachBubble,
            ]}
        >
            <Text
                style={[
                    styles.messageText,
                    isUserMessage && styles.userMessageText,
                ]}
            >
                {message.text}
            </Text>

            <Text
                style={[
                    styles.messageTime,
                    isUserMessage
                        ? styles.userMessageTime
                        : styles.coachMessageTime,
                ]}
            >
                {formattedTime}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    messageBubble: {
        maxWidth: "78%",
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 8,
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
    messageTime: {
        fontSize: 11,
        marginTop: 6,
        alignSelf: "flex-end",
    },
    coachMessageTime: {
        color: "#8A8A8A",
    },
    userMessageTime: {
        color: "#DDF0FF",
    },
});