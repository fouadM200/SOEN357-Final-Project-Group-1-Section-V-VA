import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { resetPassword } from "@/utils/authStorage";
import SuccessCard from "../components/SuccessCard";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showSuccessCard, setShowSuccessCard] = useState(false);

    const handleResetPassword = async () => {
        if (!email || !newPassword || !confirmPassword) {
            Alert.alert("Missing fields", "Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Password mismatch", "Passwords do not match.");
            return;
        }

        const result = await resetPassword(email, newPassword);

        if (!result.success) {
            Alert.alert("Reset failed", result.message ?? "Unknown error");
            return;
        }

        setShowSuccessCard(true);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/fitfuel-logo-blue.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Forgot Password</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
            >
                <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.replace("/login")}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <SuccessCard
                visible={showSuccessCard}
                title={"Password reset done\nsuccessfully!"}
                loginRoute="/login"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 30,
        paddingTop: 90,
    },
    logo: {
        width: 250,
        height: 250,
        alignSelf: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 18,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        paddingHorizontal: 16,
        backgroundColor: "#F5F5F5",
    },
    resetButton: {
        backgroundColor: "#2D9CDB",
        height: 55,
        borderRadius: 30,
        marginTop: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    resetButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    backText: {
        textAlign: "center",
        marginTop: 18,
        color: "#2D9CDB",
        fontWeight: "600",
    },
    cancelButton: {
        backgroundColor: "#000",
        height: 55,
        borderRadius: 30,
        marginTop: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
});