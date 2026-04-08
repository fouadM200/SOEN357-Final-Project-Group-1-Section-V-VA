import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import type { TodayReportCardProps } from "@/types/todayReportCardProps";

export default function TodayReportCard({
                                            title,
                                            number,
                                            unit,
                                            icon,
                                            progress,
                                        }: TodayReportCardProps) {
    const size = 58;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const strokeDashoffset = circumference * (1 - clampedProgress);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.ringWrapper}>
                <Svg width={size} height={size}>
                    <Circle
                        stroke="#D9D9D9"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke="#1EA7FF"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={-strokeDashoffset}
                        rotation={-90}
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>

                <View style={styles.iconWrapper}>{icon}</View>
            </View>

            <Text style={styles.number}>{number}</Text>
            <Text style={styles.unit}>{unit}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: "#EDEDED",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111",
        textAlign: "center",
        marginBottom: 12,
    },
    ringWrapper: {
        width: 58,
        height: 58,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    iconWrapper: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    number: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111",
        textAlign: "center",
    },
    unit: {
        fontSize: 13,
        fontWeight: "500",
        color: "#444",
        textAlign: "center",
        marginTop: 2,
    },
});