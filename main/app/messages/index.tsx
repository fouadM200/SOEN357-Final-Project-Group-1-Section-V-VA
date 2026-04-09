import { useEffect, useMemo, useState } from "react";
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
import { router, Stack } from "expo-router";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import SearchBar from "../../components/SearchBar";
import { useCoaches } from "../../hooks/useCoach";
import {
    getAllConversations,
    type SavedConversation,
} from "../../utils/messageStorage";

type ConversationListItem = {
    coachId: string;
    coachName: string;
    coachImage?: any;
    lastMessage: string;
    updatedAt: string;
};

function formatConversationDate(dateInput: string) {
    const date = new Date(dateInput);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function MessagesPage() {
    const coaches = useCoaches();
    const [searchQuery, setSearchQuery] = useState("");
    const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);

    useEffect(() => {
        const loadConversations = async () => {
            const conversations = await getAllConversations();
            setSavedConversations(conversations);
        };

        const unsubscribe = router.addListener?.("focus", loadConversations);

        loadConversations();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const conversationItems = useMemo(() => {
        const mappedItems: ConversationListItem[] = savedConversations
            .map((conversation) => {
                const coach = coaches.find((item) => item.id === conversation.coachId);

                if (!coach) {
                    return null;
                }

                return {
                    coachId: coach.id,
                    coachName: coach.name,
                    coachImage: coach.image,
                    lastMessage: conversation.lastMessage,
                    updatedAt: conversation.updatedAt,
                };
            })
            .filter((item): item is ConversationListItem => item !== null)
            .sort(
                (firstItem, secondItem) =>
                    new Date(secondItem.updatedAt).getTime() -
                    new Date(firstItem.updatedAt).getTime()
            );

        const trimmedQuery = searchQuery.trim().toLowerCase();

        if (!trimmedQuery) {
            return mappedItems;
        }

        return mappedItems.filter((item) =>
            item.coachName.toLowerCase().includes(trimmedQuery)
        );
    }, [savedConversations, coaches, searchQuery]);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

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

                    <View style={styles.searchContainer}>
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search"
                        />
                    </View>

                    {conversationItems.length > 0 ? (
                        <FlatList
                            data={conversationItems}
                            keyExtractor={(item) => item.coachId}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.conversationCard}
                                    activeOpacity={0.85}
                                    onPress={() => router.push(`/messages/${item.coachId}`)}
                                >
                                    <View style={styles.leftSection}>
                                        {item.coachImage ? (
                                            <Image source={item.coachImage} style={styles.avatar} />
                                        ) : (
                                            <View style={styles.avatarFallback}>
                                                <Ionicons name="person" size={20} color="#999" />
                                            </View>
                                        )}

                                        <View style={styles.textSection}>
                                            <Text style={styles.coachName}>
                                                {item.coachName}
                                            </Text>
                                            <Text style={styles.lastMessage} numberOfLines={1}>
                                                {item.lastMessage}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.dateText}>
                                        {formatConversationDate(item.updatedAt)}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListFooterComponent={
                                <Text style={styles.footerText}>End of messages</Text>
                            }
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchQuery.trim()
                                    ? "No coach found for this search."
                                    : "No messages yet."}
                            </Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
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
    searchContainer: {
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 14,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    conversationCard: {
        backgroundColor: "#F8F8F8",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 10,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
    },
    avatarFallback: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#DDD",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    textSection: {
        flex: 1,
    },
    coachName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 4,
    },
    lastMessage: {
        fontSize: 13,
        color: "#8A8A8A",
    },
    dateText: {
        fontSize: 12,
        color: "#9A9A9A",
        marginLeft: 8,
    },
    footerText: {
        textAlign: "center",
        fontSize: 13,
        color: "#777",
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#666",
        textAlign: "center",
    },
});