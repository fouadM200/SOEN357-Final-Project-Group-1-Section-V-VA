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
                Alert.alert("Error", "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.replace("/login");
        } catch (error) {
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

                    <View style={styles.divider} />

                    <View style={styles.infoSection}>
                        <InfoRow label="Date of Birth:" value={user.dateOfBirth} />
                        <InfoRow label="Height:" value={user.height} />
                        <InfoRow label="Weight:" value={user.weight} />
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
        alignItems: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: "800",
        color: "#1EA7FF",
    },
    name: {
        fontSize: 26,
        fontWeight: "800",
        color: "#000",
        textAlign: "center",
    },
    divider: {
        width: "100%",
        height: 2,
        backgroundColor: "#CFCFCF",
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