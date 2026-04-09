import { StyleSheet, Text, View } from "react-native";

type MessageDateChipProps = {
    label: string;
};

export default function MessageDateChip({
                                            label,
                                        }: Readonly<MessageDateChipProps>) {
    return (
        <View style={styles.dateChip}>
            <Text style={styles.dateChipText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    dateChip: {
        alignSelf: "center",
        backgroundColor: "#E7E7E7",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    dateChipText: {
        color: "#666",
        fontSize: 12,
        fontWeight: "600",
    },
});