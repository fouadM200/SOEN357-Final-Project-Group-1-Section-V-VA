import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type SuccessCardProps = {
    visible: boolean;
    title: string;
    buttonText?: string;
    loginRoute?: string;
};

export default function SuccessCard({
                                        visible,
                                        title,
                                        buttonText = "Go Back to Login page",
                                        loginRoute = "/login",
                                    }: SuccessCardProps) {
    const router = useRouter();

    const handleGoToLogin = () => {
        router.replace(loginRoute as any);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleGoToLogin}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={84}
                        color="#1DA1F2"
                        style={styles.icon}
                    />

                    <Text style={styles.title}>{title}</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGoToLogin}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    card: {
        width: 315,
        backgroundColor: "#F3F3F3",
        borderRadius: 20,
        alignItems: "center",
        paddingTop: 30,
        paddingBottom: 18,
        paddingHorizontal: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
    },
    icon: {
        marginBottom: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: "#000",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 18,
        maxWidth: 240,
    },
    button: {
        width: 286,
        height: 38,
        borderRadius: 999,
        backgroundColor: "#1E1E1E",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "700",
    },
});