import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
    visible: boolean;
    coachName?: string;
    onGoBack: () => void;
}

export default function UnsubscribeSuccessModal({ visible, coachName, onGoBack }: Props) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.successCard}>
                    <View style={styles.checkmarkCircle}>
                        <Ionicons name="checkmark" size={60} color="#1DA1F2" />
                    </View>

                    <Text style={styles.successSubtitle}>
                        Unsubscription from <Text style={styles.bold}>{coachName || "your coach"}’s</Text> online coaching program done successfully!
                    </Text>

                    <TouchableOpacity style={styles.goBackButton} onPress={onGoBack}>
                        <Text style={styles.goBackButtonText}>Go Back to Subscriptions page</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    successCard: {
        backgroundColor: "#EEEEEE",
        width: "100%",
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    checkmarkCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#1DA1F2",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    successSubtitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#000",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 30,
    },
    bold: {
        fontWeight: "900",
    },
    goBackButton: {
        backgroundColor: "#222",
        width: "100%",
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
    },
    goBackButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
    },
});
