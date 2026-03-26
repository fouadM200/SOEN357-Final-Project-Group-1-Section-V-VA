import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import FitFuelLogoBlue from "../components/FitFuelLogoBlue";
import { signupUser } from "@/utils/authStorage";
import SuccessCard from "../components/SuccessCard";

export default function SignupPage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showSuccessCard, setShowSuccessCard] = useState(false);

    const handleSignup = async () => {
        if (
            !firstName ||
            !lastName ||
            !dateOfBirth ||
            !height ||
            !weight ||
            !phoneNumber ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            Alert.alert("Missing fields", "Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password mismatch", "Passwords do not match.");
            return;
        }

        const result = await signupUser({
            firstName,
            lastName,
            dateOfBirth,
            height,
            weight,
            phoneNumber,
            email,
            password,
        });

        if (!result.success) {
            Alert.alert("Sign up failed", result.message ?? "Unknown error");
            return;
        }

        setShowSuccessCard(true);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <FitFuelLogoBlue width={300} height={300} />

                <Text style={styles.title}>Sign up</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your first name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Height</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your height (ft/cm)"
                        value={height}
                        onChangeText={setHeight}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your weight (lb/kg)"
                        value={weight}
                        onChangeText={setWeight}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+000 (000) 000-0000"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Confirm your Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
                    <Text style={styles.createButtonText}>Create a new account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.push("/intro")}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>

            <SuccessCard
                visible={showSuccessCard}
                title={"New account created\nsuccessfully!"}
                loginRoute="/login"
            />
        </View>
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
        height: 52,
        backgroundColor: "#F5F5F5",
        borderRadius: 6,
        paddingHorizontal: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
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
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
        color: "#000",
    },
});