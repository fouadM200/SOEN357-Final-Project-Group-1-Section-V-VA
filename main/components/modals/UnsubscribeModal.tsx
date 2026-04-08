import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import type { UnsubscribeModalProps } from "@/types/unsubscribeModal";

export default function UnsubscribeModal({ visible, onCancel, onUnsubscribe, coach }: UnsubscribeModalProps) {
    if (!coach) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Unsubscribe</Text>

                    <Text style={styles.message}>
                        Are you sure you want to unsubscribe from <Text style={styles.bold}>{coach.name}’s</Text> online coaching program?
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmUnsubscribeButton}
                            onPress={onUnsubscribe}
                        >
                            <Text style={styles.confirmUnsubscribeButtonText}>Unsubscribe</Text>
                        </TouchableOpacity>
                    </View>
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
    card: {
        backgroundColor: "#EEEEEE",
        width: "100%",
        borderRadius: 24,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "900",
        color: "#000",
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 30,
    },
    bold: {
        fontWeight: "900",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#222",
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#fff",
    },
    confirmUnsubscribeButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E55656",
        justifyContent: "center",
        alignItems: "center",
    },
    confirmUnsubscribeButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#fff",
    },
});