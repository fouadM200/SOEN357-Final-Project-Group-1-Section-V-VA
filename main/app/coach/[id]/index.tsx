import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCoach } from "@/hooks/useCoach";
import CustomBottomNavigation from "@/components/CustomBottomNavigation";

export default function CoachProfile() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const coach = useCoach(id || "");

    if (!coach) {
        return (
            <>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.notFoundContainer}>
                        <Text style={styles.notFoundText}>Coach not found.</Text>
                    </View>
                </SafeAreaView>
                <CustomBottomNavigation />
            </>
        );
    }

    return (
        <>
            <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
                <View style={styles.screen}>
                    <View style={styles.heroSection}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.push("/(tabs)/coach")}
                        >
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>

                        {coach.image ? (
                            <Image source={coach.image} style={styles.heroImage} />
                        ) : (
                            <View style={styles.heroImagePlaceholder}>
                                <Ionicons name="person" size={90} color="#999" />
                            </View>
                        )}

                        <View style={styles.overlayBottom}>
                            <Text style={styles.name}>{coach.name}</Text>

                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={16} color="#777" />
                                <Text style={styles.ratingText}>{coach.rating}</Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView
                        style={styles.scrollArea}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.content}>
                            <Text style={styles.sectionTitle}>Biography</Text>
                            <Text style={styles.bodyText}>{coach.biography}</Text>

                            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
                                Written & Spoken{"\n"}Languages
                            </Text>

                            <View style={styles.languagesRow}>
                                <View style={styles.languageList}>
                                    {coach.languages.map((language) => (
                                        <Text key={language} style={styles.languageItem}>
                                            • {language}
                                        </Text>
                                    ))}
                                </View>
                            </View>

                            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
                                Subscription cost
                            </Text>
                            <Text style={styles.priceText}>${coach.price}/month</Text>

                            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
                                Testimonials
                            </Text>

                            {coach.testimonials.map((testimonial) => (
                                <View
                                    key={`${testimonial.name}-${testimonial.text}`}
                                    style={styles.testimonialCard}
                                >
                                    <Text style={styles.testimonialName}>
                                        {testimonial.name}
                                    </Text>
                                    <Text style={styles.testimonialText}>
                                        “{testimonial.text}”
                                    </Text>
                                </View>
                            ))}

                            <TouchableOpacity
                                style={styles.subscribeButton}
                                onPress={() => router.push(`/coach/${coach.id}/subscribe`)}
                            >
                                <Text style={styles.subscribeButtonText}>Subscribe</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>

            <CustomBottomNavigation />
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    screen: {
        flex: 1,
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
    heroSection: {
        position: "relative",
        height: 400,
        backgroundColor: "#D9D9D9",
        flexShrink: 0,
    },
    backButton: {
        position: "absolute",
        top: 18,
        left: 18,
        zIndex: 2,
        paddingTop: 40,
    },
    heroImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    heroImagePlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D9D9D9",
    },
    overlayBottom: {
        position: "absolute",
        bottom: 14,
        left: 20,
        right: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    name: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        flex: 1,
        marginRight: 10,
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAEAEA",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 6,
    },
    ratingText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#666",
    },
    scrollArea: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    scrollContent: {
        paddingBottom: 30,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 20,
        paddingBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111",
        marginBottom: 10,
    },
    sectionSpacing: {
        marginTop: 20,
    },
    bodyText: {
        fontSize: 15,
        lineHeight: 29,
        color: "#666",
        fontWeight: "500",
    },
    languagesRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        minHeight: 50,
    },
    languageList: {
        paddingRight: 30,
    },
    languageItem: {
        fontSize: 15,
        color: "#666",
        fontWeight: "600",
        marginBottom: 6,
    },
    priceText: {
        fontSize: 18,
        color: "#777",
        fontWeight: "700",
    },
    testimonialCard: {
        backgroundColor: "#ECECEC",
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
    },
    testimonialName: {
        fontSize: 15,
        fontWeight: "800",
        color: "#111",
        marginBottom: 8,
    },
    testimonialText: {
        fontSize: 15,
        color: "#555",
        lineHeight: 24,
        fontStyle: "italic",
    },
    subscribeButton: {
        marginTop: 14,
        backgroundColor: "#1DA1F2",
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
    },
    subscribeButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
    },
});