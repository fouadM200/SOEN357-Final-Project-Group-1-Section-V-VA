import React from "react";
import { View, StyleSheet } from "react-native";
import SuccessCard from "../components/SuccessCard";

export default function PasswordResetDonePage() {
    return (
        <View style={styles.container}>
            <SuccessCard
                visible={true}
                title={"Password reset done\nsuccessfully!"}
                loginRoute="/login"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
    },
});