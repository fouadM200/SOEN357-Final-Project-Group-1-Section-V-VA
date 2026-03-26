import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import FitFuelLogoBlue from "../components/FitFuelLogoBlue";

export default function LoginPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>

            <View style={styles.logoContainer}>
                <FitFuelLogoBlue width={300} height={300} opacity={0.25} />
            </View>

            <Text style={styles.title}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton}>
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
        marginBottom: 20,
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
        marginTop: 18,
        marginBottom: 8,
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