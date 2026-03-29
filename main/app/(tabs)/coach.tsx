import { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCoaches, useSubscribedCoachIds, unsubscribeFromCoach } from "../../hooks/useCoach";
import { Coach } from "../../types/coach";
import FitFuelLogo from "../../components/FitFuelLogo";
import { UnsubscribeModal } from "../../components/modals/UnsubscribeModal";
import { UnsubscribeSuccessModal } from "../../components/modals/UnsubscribeSuccessModal";

export default function CoachPage() {
    const [searchText, setSearchText] = useState("");
    const [selectedRate, setSelectedRate] = useState<string>("All");
    const [selectedPrice, setSelectedPrice] = useState<string>("All");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
    const [viewMode, setViewMode] = useState<"All" | "Subscriptions">("All");
    const [isUnsubscribeModalVisible, setIsUnsubscribeModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [selectedCoachToUnsubscribe, setSelectedCoachToUnsubscribe] = useState<Coach | null>(null);

    const coaches = useCoaches();
    const subscribedCoachIds = useSubscribedCoachIds();

    const subscribedCoaches = useMemo(() => {
        return coaches.filter(coach => subscribedCoachIds.includes(coach.id));
    }, [coaches, subscribedCoachIds]);

    const filteredCoaches = useMemo(() => {
        return coaches.filter((coach) => {
            const matchesSearch =
                coach.name.toLowerCase().includes(searchText.toLowerCase()) ||
                coach.description.toLowerCase().includes(searchText.toLowerCase());

            const matchesRate =
                selectedRate === "All" ||
                coach.rating >= Number(selectedRate);

            const matchesPrice =
                selectedPrice === "All" ||
                (selectedPrice === "0-40" && coach.price <= 40) ||
                (selectedPrice === "41-60" && coach.price >= 41 && coach.price <= 60) ||
                (selectedPrice === "61+" && coach.price >= 61);

            const matchesLanguage =
                selectedLanguage === "All" ||
                coach.languages.includes(selectedLanguage);

            return (
                matchesSearch &&
                matchesRate &&
                matchesPrice &&
                matchesLanguage
            );
        });
    }, [coaches, searchText, selectedRate, selectedPrice, selectedLanguage]);

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.headerTitle}>Online Coaching</Text>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity style={styles.headerButton}>
                                    <Ionicons name="mail-outline" size={18} color="#1DA1F2" />
                                    <Text style={styles.headerButtonText}>Messages</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.headerButton, viewMode === "Subscriptions" && styles.activeHeaderButton]}
                                    onPress={() => setViewMode(viewMode === "Subscriptions" ? "All" : "Subscriptions")}
                                >
                                    <Text style={[styles.headerButtonText, viewMode === "Subscriptions" && styles.activeHeaderButtonText]}>Subscriptions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <FitFuelLogo width={150} height={150} opacity={1} />
                    </View>
                </View>

                {viewMode === "All" ? (
                    <>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#999" />
                            <TextInput
                                placeholder="Search for an online fitness coach"
                                placeholderTextColor="#999"
                                style={styles.searchInput}
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>

                        <View style={styles.filtersRow}>
                            <FilterButton
                                label={`Rate: ${selectedRate}`}
                                onPress={() =>
                                    cycleValue(selectedRate, ["All", "4", "4.5"], setSelectedRate)
                                }
                            />
                            <FilterButton
                                label={`Price: ${selectedPrice}`}
                                onPress={() =>
                                    cycleValue(
                                        selectedPrice,
                                        ["All", "0-40", "41-60", "61+"],
                                        setSelectedPrice
                                    )
                                }
                            />
                            <FilterButton
                                label={`Language: ${selectedLanguage}`}
                                onPress={() =>
                                    cycleValue(
                                        selectedLanguage,
                                        ["All", "English", "French", "Arabic"],
                                        setSelectedLanguage
                                    )
                                }
                            />
                        </View>

                        <FlatList
                            data={filteredCoaches}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => <CoachCard coach={item} />}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                ) : (
                    <>
                        {subscribedCoaches.length > 0 ? (
                            <FlatList
                                data={subscribedCoaches}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => (
                                    <SubscriptionCard 
                                        coach={item} 
                                        onUnsubscribe={() => {
                                            setSelectedCoachToUnsubscribe(item);
                                            setIsUnsubscribeModalVisible(true);
                                        }} 
                                    />
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Not subscribed to online coaching yet.</Text>
                            </View>
                        )}
                    </>
                )}
            </View>

            <UnsubscribeModal 
                visible={isUnsubscribeModalVisible}
                coachName={selectedCoachToUnsubscribe?.name}
                onCancel={() => {
                    setIsUnsubscribeModalVisible(false);
                }}
                onUnsubscribe={() => {
                    if (selectedCoachToUnsubscribe) {
                        unsubscribeFromCoach(selectedCoachToUnsubscribe.id);
                    }
                    setIsUnsubscribeModalVisible(false);
                    setIsSuccessModalVisible(true);
                }}
            />

            <UnsubscribeSuccessModal 
                visible={isSuccessModalVisible}
                coachName={selectedCoachToUnsubscribe?.name}
                onGoBack={() => {
                    setIsSuccessModalVisible(false);
                    setSelectedCoachToUnsubscribe(null);
                }}
            />
        </SafeAreaView>
    );
}

function cycleValue(
    current: string,
    values: string[],
    setter: (value: string) => void
) {
    const currentIndex = values.indexOf(current);
    const nextIndex = (currentIndex + 1) % values.length;
    setter(values[nextIndex]);
}

function FilterButton({
                          label,
                          onPress,
                      }: {
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.filterButton} onPress={onPress}>
            <Text style={styles.filterText}>{label}</Text>
            <Ionicons name="chevron-down" size={14} color="#999" />
        </TouchableOpacity>
    );
}

function CoachCard({ coach }: { coach: Coach }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardTopRow}>
                <View style={styles.imagePlaceholder}>
                    {coach.image ? (
                        <Image source={coach.image} style={styles.coachImage} />
                    ) : (
                        <Ionicons name="person" size={32} color="#999" />
                    )}
                </View>

                <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.coachName}>{coach.name}</Text>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={12} color="#666" />
                            <Text style={styles.ratingText}>{coach.rating}</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>{coach.description}</Text>
                    <Text style={styles.meta}>Cost: ${coach.price}/month</Text>
                    <Text style={styles.meta}>
                        Languages: {coach.languages.join(", ")}
                    </Text>

                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => router.push(`/coach/${coach.id}`)}
                    >
                        <Text style={styles.profileButtonText}>Check profile page</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function SubscriptionCard({ coach, onUnsubscribe }: { coach: Coach, onUnsubscribe: () => void }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardTopRow}>
                <View style={styles.imagePlaceholder}>
                    {coach.image ? (
                        <Image source={coach.image} style={styles.coachImage} />
                    ) : (
                        <Ionicons name="person" size={32} color="#999" />
                    )}
                </View>

                <View style={styles.cardInfo}>
                    <Text style={styles.coachName}>{coach.name}</Text>
                    <TouchableOpacity
                        style={styles.unsubscribeButton}
                        onPress={onUnsubscribe}
                    >
                        <Text style={styles.unsubscribeButtonText}>Unsubscribe</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
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
    header: {
        backgroundColor: "#1DA1F2",
        paddingBottom: 20,
    },
    headerContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 25,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 15,
    },
    headerButtons: {
        flexDirection: "column",
        gap: 10,
    },
    headerButton: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 5,
    },
    activeHeaderButton: {
        backgroundColor: "#fff", // Active state also white but could be different
    },
    headerButtonText: {
        color: "#1DA1F2",
        fontSize: 14,
        fontWeight: "700",
    },
    activeHeaderButtonText: {
        color: "#1DA1F2",
    },
    searchContainer: {
        marginTop: 14,
        marginHorizontal: 16,
        backgroundColor: "#ECECEC",
        borderRadius: 18,
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: "#111",
    },
    filtersRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 10,
        gap: 8,
    },
    filterButton: {
        flex: 1,
        height: 36,
        backgroundColor: "#ECECEC",
        borderRadius: 14,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    filterText: {
        color: "#666",
        fontSize: 12,
        fontWeight: "600",
    },
    listContent: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: "#F8F8F8",
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },
    cardTopRow: {
        flexDirection: "row",
    },
    imagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#DDD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        overflow: "hidden",
    },
    coachImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    cardInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 6,
    },
    coachName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAEAEA",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
    },
    description: {
        fontSize: 12,
        color: "#666",
        lineHeight: 18,
        marginBottom: 6,
    },
    meta: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    profileButton: {
        marginTop: 8,
        backgroundColor: "#1DA1F2",
        borderRadius: 16,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    profileButtonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },
    unsubscribeButton: {
        backgroundColor: "#FF0000",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: "flex-start",
        marginTop: 10,
    },
    unsubscribeButtonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "800",
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
        fontWeight: "800",
        color: "#000",
        textAlign: "center",
    },
});