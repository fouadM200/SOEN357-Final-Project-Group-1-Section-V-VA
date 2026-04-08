import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import type { SubscriptionSuccessModalProps } from "@/types/subscriptionSuccessModal";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SubscriptionSuccessModal({
                                                     visible,
                                                     onGoBack,
                                                     coach,
                                                 }: Readonly<SubscriptionSuccessModalProps>) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.successCard}>
                    <View style={styles.checkmarkCircle}>
                        <Ionicons name="checkmark" size={60} color="#1DA1F2" />
                    </View>
                    <Text style={styles.successTitle}>Payment Successful!</Text>
                    <Text style={styles.successSubtitle}>
                        You’re now subscribed to the online coaching program of:
                    </Text>
                    <Text style={styles.coachNameText}>{coach.name}</Text>

                    <Text style={styles.transactionText}>Transaction ID: 123000048237684370</Text>

                    <TouchableOpacity style={styles.goBackButton} onPress={onGoBack}>
                        <Text style={styles.goBackButtonText}>Go Back to Online Coaching</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)", // Lighter overlay as seen in screenshot
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    successCard: {
        backgroundColor: "#EEEEEE", // Slightly grey card background
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
    successTitle: {
        fontSize: 24,
        fontWeight: "900",
        color: "#000",
        marginBottom: 8,
        textAlign: "center",
    },
    successSubtitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#000",
        textAlign: "center",
        lineHeight: 24,
    },
    coachNameText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#000",
        textAlign: "center",
        marginBottom: 30,
    },
    transactionText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#888",
        marginBottom: 30,
    },
    goBackButton: {
        backgroundColor: "#222", // Dark button
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
