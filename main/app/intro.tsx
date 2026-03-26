import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function IntroPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/fitfuel-logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.loginButton}
                    onPress={() => router.push("/login")}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </Pressable>

                <Pressable
                    style={styles.signupButton}
                    onPress={() => router.push("/signup")}
                >
                    <Text style={styles.signupButtonText}>Sign up</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#26A7F7",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    logo: {
        width: 260,
        height: 260,
        marginBottom: 50,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        gap: 14,
    },
    loginButton: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: "center",
    },
    loginButtonText: {
        color: "#26A7F7",
        fontSize: 16,
        fontWeight: "700",
    },
    signupButton: {
        width: "80%",
        backgroundColor: "#000000",
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: "center",
    },
    signupButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});