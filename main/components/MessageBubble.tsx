import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MessageBubbleProps } from "@/types/message";

function formatMessageTime(timestamp: string) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date
        .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
        .toLowerCase();
}

export default function MessageBubble({
                                          sender,
                                          text,
                                          timestamp,
                                      }: Readonly<MessageBubbleProps>) {
    const isUserMessage = sender === "user";
    const formattedTime = formatMessageTime(timestamp);

    return (
        <View
            style={[
                styles.messageWrapper,
                isUserMessage ? styles.userWrapper : styles.coachWrapper,
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    isUserMessage ? styles.userBubble : styles.coachBubble,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        isUserMessage ? styles.userText : styles.coachText,
                    ]}
                >
                    {text}
                </Text>

                <Text
                    style={[
                        styles.timeText,
                        isUserMessage ? styles.userTimeText : styles.coachTimeText,
                    ]}
                >
                    {formattedTime}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    messageWrapper: {
        marginBottom: 10,
        maxWidth: "82%",
    },
    userWrapper: {
        alignSelf: "flex-end",
    },
    coachWrapper: {
        alignSelf: "flex-start",
    },
    messageBubble: {
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 8,
    },
    userBubble: {
        backgroundColor: "#1DA1F2",
        borderBottomRightRadius: 4,
    },
    coachBubble: {
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    userText: {
        color: "#fff",
    },
    coachText: {
        color: "#111",
    },
    timeText: {
        fontSize: 11,
        alignSelf: "flex-end",
    },
    userTimeText: {
        color: "#DFF3FF",
    },
    coachTimeText: {
        color: "#777",
    },
});