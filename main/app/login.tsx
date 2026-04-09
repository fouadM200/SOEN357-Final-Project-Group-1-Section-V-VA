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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "@/utils/authStorage";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const result = await loginUser(email, password);

        if (!result.success) {
            Alert.alert("Login failed", result.message ?? "Unknown error");
            return;
        }

        if (result.user?.firstName) {
            await AsyncStorage.setItem("firstName", result.user.firstName);
        }

        router.push("/(tabs)/home");
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/images/fitfuel-logo-blue.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.helperText}>Don’t have an account?</Text>

            <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push("/signup")}
            >
                <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 30,
        paddingTop: 80,
    },
    logoContainer: {
        alignItems: "center",
    },
    logo: {
        width: 300,
        height: 300,
    },
    title: {
        fontSize: 36,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 40,
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
    forgotPasswordText: {
        marginTop: 10,
        textAlign: "right",
        color: "#000000",
        fontWeight: "600",
        textDecorationLine: "underline",
    },
    loginButton: {
        backgroundColor: "#2D9CDB",
        height: 55,
        borderRadius: 30,
        marginTop: 35,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    loginButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    helperText: {
        textAlign: "center",
        marginTop: 28,
        marginBottom: 18,
        color: "#444",
    },
    signupButton: {
        backgroundColor: "#000",
        height: 55,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    signupButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});