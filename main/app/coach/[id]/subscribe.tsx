import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useCoach, subscribeToCoach } from "@/hooks/useCoach";
import SubscriptionSuccessModal from "@/components/modals/SubscriptionSuccessModal";

function PaymentRow({
                        label,
                        value,
                    }: Readonly<{ label: string; value: string }>) {
    return (
        <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{label}</Text>
            <Text numberOfLines={1} style={styles.paymentDotsText}>
                ................................................................................................
            </Text>
            <Text style={styles.paymentValue}>{value}</Text>
        </View>
    );
}

export default function SubscribePage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const coach = useCoach(id);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [zip, setZip] = useState("");

    const handleConfirm = () => {
        if (
            !cardName ||
            !cardNumber ||
            !expiry ||
            !cvv ||
            !street ||
            !city ||
            !state ||
            !country ||
            !zip
        ) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        if (id) {
            subscribeToCoach(id);
        }
        setIsConfirmed(true);
    };

    if (!coach) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundText}>Coach not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={28} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Subscription payment</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.mainTitle}>
                        Subscribe to {coach.name} online coaching program!
                    </Text>

                    <View style={styles.imageContainer}>
                        {coach.image ? (
                            <Image source={coach.image} style={styles.coachImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="person" size={50} color="#999" />
                            </View>
                        )}
                    </View>

                    <View style={styles.blueDivider} />

                    <View style={styles.paymentDetailsCard}>
                        <Text style={styles.cardTitle}>Payment Details</Text>

                        <PaymentRow
                            label="Monthly Subscription"
                            value={`$${coach.price.toFixed(2)}`}
                        />

                        <PaymentRow
                            label="GST (5%)"
                            value={`$${(coach.price * 0.05).toFixed(2)}`}
                        />

                        <PaymentRow
                            label="QST (9.975%)"
                            value={`$${(coach.price * 0.09975).toFixed(2)}`}
                        />

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Text style={styles.totalLabel}>Total Due Today</Text>
                            <Text style={styles.totalValue}>
                                ${(coach.price * 1.14975).toFixed(2)}
                            </Text>
                        </View>

                        <Text style={styles.noteText}>
                            Note: All prices are in Canadian Dollar
                        </Text>
                    </View>

                    <View style={styles.blueDivider} />

                    <Text style={styles.sectionTitle}>Please add your payment details:</Text>

                    <Text style={styles.inputLabel}>Full Name on Card</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name, Last Name"
                        placeholderTextColor="#ccc"
                        value={cardName}
                        onChangeText={setCardName}
                    />

                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0000 0000 0000 0000"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInputLeft}>
                            <Text style={styles.inputLabel}>Card Expiry Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="MM/YY"
                                placeholderTextColor="#ccc"
                                value={expiry}
                                onChangeText={setExpiry}
                            />
                        </View>

                        <View style={styles.halfInputRight}>
                            <Text style={styles.inputLabel}>CVV / CVC</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="000"
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={cvv}
                                onChangeText={setCvv}
                            />
                        </View>
                    </View>

                    <View style={styles.blueDivider} />

                    <Text style={styles.sectionTitle}>
                        Please add your billing address info:
                    </Text>

                    <Text style={styles.inputLabel}>Street Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Street number, street name"
                        placeholderTextColor="#ccc"
                        value={street}
                        onChangeText={setStreet}
                    />

                    <Text style={styles.inputLabel}>Address Line 2</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Apt., suite, etc."
                        placeholderTextColor="#ccc"
                    />

                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="City name"
                        placeholderTextColor="#ccc"
                        value={city}
                        onChangeText={setCity}
                    />

                    <Text style={styles.inputLabel}>State / Province / Region</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="State / Province / Region name"
                        placeholderTextColor="#ccc"
                        value={state}
                        onChangeText={setState}
                    />

                    <Text style={styles.inputLabel}>Country</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Country name"
                        placeholderTextColor="#ccc"
                        value={country}
                        onChangeText={setCountry}
                    />

                    <Text style={styles.inputLabel}>ZIP code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="A0A 0A0"
                        placeholderTextColor="#ccc"
                        value={zip}
                        onChangeText={(text) => {
                            const cleaned = text.toUpperCase().replaceAll(/[^A-Z0-9]/g, "").slice(0, 6);
                            const formatted =
                                cleaned.length > 3
                                    ? `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
                                    : cleaned;
                            setZip(formatted);
                        }}
                        autoCapitalize="characters"
                        maxLength={7}
                    />

                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirm Subscription</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <SubscriptionSuccessModal
                visible={isConfirmed}
                coach={coach}
                onGoBack={() => {
                    setIsConfirmed(false);
                    router.push("/(tabs)/coach");
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 15,
    },
    backButton: {
        marginRight: 15,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 18,
        color: "#000",
        fontWeight: "500",
        paddingTop: 40,
    },
    content: {
        paddingHorizontal: 25,
        alignItems: "center",
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: "hidden",
        backgroundColor: "#eee",
        marginBottom: 20,
    },
    coachImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    blueDivider: {
        width: "100%",
        height: 4,
        backgroundColor: "#1DA1F2",
        opacity: 0.6,
        marginVertical: 20,
    },
    paymentDetailsCard: {
        width: "100%",
        backgroundColor: "#F2F2F2",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 15,
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    paymentLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
    },
    paymentDotsText: {
        flex: 1,
        marginHorizontal: 6,
        color: "#B8B8B8",
        fontSize: 12,
        lineHeight: 12,
    },
    paymentValue: {
        fontSize: 12,
        fontWeight: "700",
        color: "#333",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: "800",
        color: "#000",
    },
    totalValue: {
        fontSize: 15,
        fontWeight: "800",
        color: "#000",
    },
    noteText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#000",
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "800",
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        height: 45,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        paddingHorizontal: 12,
        marginBottom: 20,
        fontSize: 14,
        fontWeight: "500",
        fontStyle: "italic",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        width: "100%",
    },
    halfInputLeft: {
        flex: 1,
        marginRight: 10,
    },
    halfInputRight: {
        flex: 1,
    },
    confirmButton: {
        backgroundColor: "#1DA1F2",
        width: "100%",
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 12,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    cancelButton: {
        backgroundColor: "#222",
        width: "100%",
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});