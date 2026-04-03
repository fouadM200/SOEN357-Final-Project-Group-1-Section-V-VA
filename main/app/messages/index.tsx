import { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import { useCoaches, useSubscribedCoachIds } from "../../hooks/useCoach";
import { ConversationEntry, getConversations } from "../../utils/messageStorage";

export default function MessagesPage() {
    const router = useRouter();
    const coaches = useCoaches();
    const subscribedCoachIds = useSubscribedCoachIds();

    const [savedConversations, setSavedConversations] = useState<ConversationEntry[]>([]);

    useFocusEffect(
        useCallback(() => {
            const loadConversations = async () => {
                const data = await getConversations();
                setSavedConversations(data);
            };

            loadConversations();
        }, [])
    );

    const conversationCoachIds = savedConversations.map((item) => item.coachId);

    const visibleCoachIds = Array.from(
        new Set([...subscribedCoachIds, ...conversationCoachIds])
    );

    const visibleCoaches = visibleCoachIds
        .map((id) => coaches.find((coach) => coach.id === id))
        .filter(Boolean);

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <PageHeaderBanner
                    title="Messages"
                    leftAccessory={
                        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
                            <Ionicons name="arrow-back" size={26} color="#fff" />
                        </TouchableOpacity>
                    }
                    logo={
                        <Image
                            source={require("../../assets/images/fitfuel-logo.png")}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                    }
                />

                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color="#999" />
                    <Text style={styles.searchPlaceholder}>Search</Text>
                </View>

                {visibleCoaches.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No conversations yet.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={visibleCoaches}
                        keyExtractor={(item) => item!.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            if (!item) return null;

                            const isSubscribed = subscribedCoachIds.includes(item.id);
                            const savedConversation = savedConversations.find(
                                (conversation) => conversation.coachId === item.id
                            );

                            return (
                                <TouchableOpacity
                                    style={styles.messageCard}
                                    onPress={() => router.push(`/messages/${item.id}`)}
                                >
                                    <View style={styles.avatarWrapper}>
                                        {item.image ? (
                                            <Image source={item.image} style={styles.avatar} />
                                        ) : (
                                            <View style={styles.avatarFallback}>
                                                <Ionicons name="person" size={26} color="#999" />
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.cardText}>
                                        <View style={styles.nameRow}>
                                            <Text style={styles.name}>{item.name}</Text>

                                            {!isSubscribed && (
                                                <View style={styles.unsubscribedBadge}>
                                                    <Text style={styles.unsubscribedBadgeText}>
                                                        Unsubscribed
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={styles.preview} numberOfLines={1}>
                                            {savedConversation?.lastMessage ??
                                                `Open your conversation with ${item.name}.`}
                                        </Text>
                                    </View>

                                    <Text style={styles.timeText}>
                                        {savedConversation?.updatedAt
                                            ? new Date(savedConversation.updatedAt).toLocaleDateString()
                                            : "09:41"}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                        ListFooterComponent={
                            <Text style={styles.endText}>End of messages</Text>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#2EA7F2",
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    headerLogo: {
        width: 120,
        height: 120,
    },
    searchBar: {
        marginHorizontal: 16,
        marginTop: 12,
        backgroundColor: "#ECECEC",
        borderRadius: 14,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        gap: 8,
    },
    searchPlaceholder: {
        color: "#999",
        fontSize: 14,
    },
    listContent: {
        padding: 16,
        paddingBottom: 30,
    },
    messageCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    avatarWrapper: {
        marginRight: 12,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    avatarFallback: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#DDD",
        alignItems: "center",
        justifyContent: "center",
    },
    cardText: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    unsubscribedBadge: {
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    unsubscribedBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#666",
    },
    preview: {
        fontSize: 13,
        color: "#777",
    },
    timeText: {
        fontSize: 12,
        color: "#999",
        marginLeft: 8,
    },
    endText: {
        textAlign: "center",
        color: "#666",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
        textAlign: "center",
    },
});