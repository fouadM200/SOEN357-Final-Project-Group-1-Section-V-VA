import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import PageHeaderBanner from "@/components/PageHeaderBanner";
import { getCurrentUser, logoutUser, User } from "@/utils/authStorage";
import type { InfoRowProps } from "@/types/profile";

function convertLbToKg(lb: number) {
    return lb * 0.45359237;
}

function convertKgToLb(kg: number) {
    return kg * 2.20462262;
}

function convertCmToFt(cm: number) {
    return cm / 30.48;
}

function convertFtToCm(ft: number) {
    return ft * 30.48;
}

function formatWeightWithConversion(weight: string) {
    const parts = weight.trim().split(" ");
    const value = Number.parseFloat(parts[0]);
    const unit = parts[1]?.toLowerCase();

    if (Number.isNaN(value) || !unit) return weight;

    if (unit === "kg") {
        const lb = convertKgToLb(value);
        return `${value} kg / ${lb.toFixed(2)} lb`;
    }

    if (unit === "lb") {
        const kg = convertLbToKg(value);
        return `${value} lb / ${kg.toFixed(2)} kg`;
    }

    return weight;
}

function formatHeightWithConversion(height: string) {
    const parts = height.trim().split(" ");
    const value = Number.parseFloat(parts[0]);
    const unit = parts[1]?.toLowerCase();

    if (Number.isNaN(value) || !unit) return height;

    if (unit === "cm") {
        const ft = convertCmToFt(value);
        return `${value} cm / ${ft.toFixed(2)} ft`;
    }

    if (unit === "ft") {
        const cm = convertFtToCm(value);
        return `${value} ft / ${cm.toFixed(0)} cm`;
    }

    return height;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();

                if (!currentUser) {
                    router.replace("/login");
                    return;
                }

                setUser(currentUser);
            } catch (error) {
                console.error("Failed to load profile:", error);
                Alert.alert("Error", "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.replace("/login");
        } catch (error) {
            console.error("Failed to log out:", error);
            Alert.alert("Error", "Failed to log out.");
        }
    };

    const getInitials = () => {
        if (!user) return "";
        return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" />
                </View>
            </SafeAreaView>
        );
    }

    if (!user) return null;

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <PageHeaderBanner
                    title="Your Profile"
                    logo={
                        <Image
                            source={require("../../assets/images/fitfuel-logo.png")}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                    }
                />

                <View style={styles.content}>
                    <View style={styles.profileRow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </View>

                        <Text style={styles.name}>
                            {user.firstName} {user.lastName}
                        </Text>
                    </View>

                    <View style={styles.blueDivider} />

                    <View style={styles.infoSection}>
                        <InfoRow label="Date of Birth:" value={user.dateOfBirth} />
                        <InfoRow
                            label="Height:"
                            value={formatHeightWithConversion(user.height)}
                        />
                        <InfoRow
                            label="Weight:"
                            value={formatWeightWithConversion(user.weight)}
                        />
                        <InfoRow label="Phone Number:" value={user.phoneNumber} />
                        <InfoRow label="Email:" value={user.email} />
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color="#fff" />
                        <Text style={styles.logoutText}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#1EA7FF",
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerLogo: {
        width: 120,
        height: 120,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        alignItems: "center",
    },
    profileRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 20,
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    name: {
        fontSize: 26,
        fontWeight: "800",
        color: "#000",
        flexShrink: 1,
    },
    blueDivider: {
        width: "100%",
        height: 4,
        backgroundColor: "#1EA7FF",
        marginBottom: 22,
    },
    infoSection: {
        width: "100%",
        marginBottom: 34,
    },
    infoRow: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "800",
        color: "#111",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    logoutButton: {
        width: "100%",
        height: 50,
        borderRadius: 25,
        backgroundColor: "#1E1E1E",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    logoutText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});