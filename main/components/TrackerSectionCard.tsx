import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type TrackerSectionCardProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    current: number | string;
    goal: number | string;
    unit: "L" | "kcal";
    onAddPress: () => void;
    children?: React.ReactNode;
};

export default function TrackerSectionCard({
                                               icon,
                                               title,
                                               current,
                                               goal,
                                               unit,
                                               onAddPress,
                                               children,
                                           }: Readonly<TrackerSectionCardProps>) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                    <Ionicons name={icon} size={24} color="#000" />
                    <View style={styles.sectionTitleTextWrap}>
                        <Text style={styles.sectionCardTitle}>{title}</Text>
                        <Text style={styles.sectionCardSubtitle}>
                            {current}/{goal} {unit}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
                    <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {children ? (
                <>
                    <View style={styles.sectionInnerDivider} />
                    {children}
                </>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionCard: {
        backgroundColor: "#DCDCDC",
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 18,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    sectionTitleTextWrap: {
        marginLeft: 10,
    },
    sectionCardTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111",
    },
    sectionCardSubtitle: {
        fontSize: 13,
        fontWeight: "700",
        color: "#333",
        marginTop: 2,
    },
    addButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#1EA7FF",
        justifyContent: "center",
        alignItems: "center",
    },
    sectionInnerDivider: {
        height: 2,
        backgroundColor: "#B8B8B8",
        marginVertical: 12,
    },
});