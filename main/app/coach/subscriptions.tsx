import { useMemo, useState } from "react";
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
import {
    useCoaches,
    useSubscriptions,
    unsubscribeFromCoach,
} from "../../hooks/useCoach";
import { Coach } from "../../types/coach";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import CustomBottomNavigation from "../../components/CustomBottomNavigation";
import UnsubscribeModal from "@/components/modals/UnsubscribeModal";
import UnsubscribeSuccessModal from "@/components/modals/UnsubscribeSuccessModal";

function getNextRenewalDate(subscriptionDateString: string) {
    const subscriptionDate = new Date(subscriptionDateString);

    if (Number.isNaN(subscriptionDate.getTime())) {
        return "Renewal date unavailable";
    }

    const nextRenewalDate = new Date(subscriptionDate);
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

    return nextRenewalDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function SubscriptionsPage() {
    const [isUnsubscribeModalVisible, setIsUnsubscribeModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [selectedCoachToUnsubscribe, setSelectedCoachToUnsubscribe] =
        useState<Coach | null>(null);

    const coaches = useCoaches();
    const subscriptions = useSubscriptions();

    const subscribedCoaches = useMemo(() => {
        return subscriptions
            .map((subscription) => {
                const coach = coaches.find(
                    (currentCoach) => currentCoach.id === subscription.coachId
                );

                if (!coach) {
                    return null;
                }

                return {
                    coach,
                    subscribedAt: subscription.subscribedAt,
                };
            })
            .filter(
                (
                    item
                ): item is {
                    coach: Coach;
                    subscribedAt: string;
                } => item !== null
            );
    }, [coaches, subscriptions]);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.container}>
                    <PageHeaderBanner
                        title="My Subscriptions"
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

                    {subscribedCoaches.length > 0 ? (
                        <FlatList
                            data={subscribedCoaches}
                            keyExtractor={(item) => item.coach.id}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => (
                                <SubscriptionCard
                                    coach={item.coach}
                                    subscribedAt={item.subscribedAt}
                                    onUnsubscribe={() => {
                                        setSelectedCoachToUnsubscribe(item.coach);
                                        setIsUnsubscribeModalVisible(true);
                                    }}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Not subscribed to online coaching yet.
                            </Text>
                        </View>
                    )}
                </View>

                {selectedCoachToUnsubscribe ? (
                    <UnsubscribeModal
                        visible={isUnsubscribeModalVisible}
                        coach={selectedCoachToUnsubscribe}
                        onCancel={() => {
                            setIsUnsubscribeModalVisible(false);
                        }}
                        onUnsubscribe={async () => {
                            if (selectedCoachToUnsubscribe) {
                                await unsubscribeFromCoach(selectedCoachToUnsubscribe.id);
                            }
                            setIsUnsubscribeModalVisible(false);
                            setIsSuccessModalVisible(true);
                        }}
                    />
                ) : null}

                <UnsubscribeSuccessModal
                    visible={isSuccessModalVisible}
                    coachName={selectedCoachToUnsubscribe?.name}
                    onGoBack={() => {
                        setIsSuccessModalVisible(false);
                        setSelectedCoachToUnsubscribe(null);
                    }}
                />
            </SafeAreaView>
            <CustomBottomNavigation />
        </>
    );
}

function SubscriptionCard({
                              coach,
                              subscribedAt,
                              onUnsubscribe,
                          }: Readonly<{
    coach: Coach;
    subscribedAt: string;
    onUnsubscribe: () => void;
}>) {
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

                    <Text style={styles.renewalText}>
                        Next renewal: {getNextRenewalDate(subscribedAt)}
                    </Text>

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
    coachName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 6,
    },
    renewalText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        marginBottom: 10,
    },
    unsubscribeButton: {
        backgroundColor: "#FF0000",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: "flex-start",
        marginTop: 2,
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