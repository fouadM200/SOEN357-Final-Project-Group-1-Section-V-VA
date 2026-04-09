import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
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
    const [heightUnit, setHeightUnit] = useState("ft");
    const [weightUnit, setWeightUnit] = useState("lb");
    const [showHeightDropdown, setShowHeightDropdown] = useState(false);
    const [showWeightDropdown, setShowWeightDropdown] = useState(false);

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
            height: `${height} ${heightUnit}`,
            weight: `${weight} ${weightUnit}`,
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
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={require("../assets/images/fitfuel-logo-blue.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Sign up</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your first name"
                        placeholderTextColor="#9A9A9A"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        placeholderTextColor="#9A9A9A"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9A9A9A"
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                    />
                </View>

                <View style={[styles.fieldContainer, { zIndex: 20, elevation: 20 }]}>
                    <Text style={styles.label}>Height</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.inputWithDropdown}
                            placeholder="Enter your height"
                            placeholderTextColor="#9A9A9A"
                            value={height}
                            onChangeText={setHeight}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => {
                                setShowHeightDropdown(!showHeightDropdown);
                                setShowWeightDropdown(false);
                            }}
                        >
                            <Text style={styles.dropdownButtonText}>{heightUnit}</Text>
                            <Text style={styles.dropdownArrow}>⌄</Text>
                        </TouchableOpacity>
                    </View>

                    {showHeightDropdown && (
                        <View style={styles.inlineDropdownMenu}>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setHeightUnit("ft");
                                    setShowHeightDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>ft</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setHeightUnit("cm");
                                    setShowHeightDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>cm</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={[styles.fieldContainer, { zIndex: 10, elevation: 10 }]}>
                    <Text style={styles.label}>Weight</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.inputWithDropdown}
                            placeholder="Enter your weight"
                            placeholderTextColor="#9A9A9A"
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => {
                                setShowWeightDropdown(!showWeightDropdown);
                                setShowHeightDropdown(false);
                            }}
                        >
                            <Text style={styles.dropdownButtonText}>{weightUnit}</Text>
                            <Text style={styles.dropdownArrow}>⌄</Text>
                        </TouchableOpacity>
                    </View>

                    {showWeightDropdown && (
                        <View style={styles.inlineDropdownMenu}>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setWeightUnit("lb");
                                    setShowWeightDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>lb</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setWeightUnit("kg");
                                    setShowWeightDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>kg</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+000 (000) 000-0000"
                        placeholderTextColor="#9A9A9A"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#9A9A9A"
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
                        placeholderTextColor="#9A9A9A"
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
                        placeholderTextColor="#9A9A9A"
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
                    onPress={() => router.push("/login")}
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
    logo: {
        width: 300,
        height: 300,
        alignSelf: "center",
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
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputWithDropdown: {
        flex: 1,
        height: 52,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        paddingHorizontal: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    dropdownButton: {
        width: 85,
        height: 52,
        backgroundColor: "#F5F5F5",
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderLeftWidth: 1,
        borderLeftColor: "#D9D9D9",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    dropdownButtonText: {
        color: "#7A7A7A",
        fontWeight: "600",
        fontSize: 16,
    },
    dropdownArrow: {
        color: "#7A7A7A",
        fontSize: 16,
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
        position: "relative",
    },
    label: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
        color: "#000",
    },
    inlineDropdownMenu: {
        position: "absolute",
        top: 92,
        right: 0,
        width: 85,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 6,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownItemText: {
        fontSize: 16,
        color: "#000",
    },
})