import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import FitFuelLogoBlue from "../components/FitFuelLogoBlue";

export default function SignupPage() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FitFuelLogoBlue width={300} height={300} />

            <Text style={styles.title}>Sign up</Text>

            <TextInput style={styles.input} placeholder="First Name" />
            <TextInput style={styles.input} placeholder="Last Name" />
            <TextInput style={styles.input} placeholder="Email" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry />

            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Create a new account</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.push("/intro")}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 25,
    },
    input: {
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#F7F7F7",
        marginBottom: 12,
    },
    createButton: {
        backgroundColor: "#1EA7FF",
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 14,
        alignItems: "center",
    },
    createButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
    cancelButton: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
});