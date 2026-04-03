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

type InfoRowProps = {
    label: string;
    value: string;
};

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
        backgroundColor: "#F5F5F5",
    },
    headerLogo: {
        width: 120,
        height: 120,
    },
    content: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: 28,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
    },
    name: {
        fontSize: 24,
        fontWeight: "800",
        color: "#000",
        flexShrink: 1,
    },
    divider: {
        height: 3,
        backgroundColor: "#1DA1F2",
        marginHorizontal: 20,
        marginTop: 22,
        marginBottom: 18,
        borderRadius: 4,
    },
    infoSection: {
        paddingHorizontal: 24,
        gap: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    label: {
        width: 120,
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: "#555",
        fontWeight: "500",
    },
    logoutButton: {
        marginTop: 40,
        marginHorizontal: 32,
        backgroundColor: "#111",
        height: 52,
        borderRadius: 26,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    logoutText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});