import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import type { CalorieIntakeSummaryCardProps } from "@/types/calorieTracker";

function ProgressRing({
                          progress,
                          size = 92,
                          strokeWidth = 12,
                      }: Readonly<{
    progress: number;
    size?: number;
    strokeWidth?: number;
}>) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const strokeDashoffset = circumference * (1 - clampedProgress);

    return (
        <View style={styles.ringWrapper}>
            <Svg width={size} height={size} style={{ position: "absolute" }}>
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
                    strokeDashoffset={strokeDashoffset}
                    rotation={90}
                    origin={`${size / 2}, ${size / 2}`}
                    scaleX={-1}
                />
            </Svg>

            <View style={styles.ringIconWrapper}>
                <MaterialCommunityIcons name="fire" size={50} color="#111" />
            </View>
        </View>
    );
}

function MacroBar({
                      label,
                      current,
                      goal,
                      progress,
                  }: Readonly<{
    label: string;
    current: number;
    goal: number;
    progress: number;
}>) {
    const clampedProgress = Math.max(0, Math.min(progress, 1));

    return (
        <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>{label}</Text>
            <Text style={styles.macroValue}>
                {current}g/{goal}g
            </Text>
            <View style={styles.macroTrack}>
                <View style={[styles.macroFill, { width: `${clampedProgress * 100}%` }]} />
            </View>
        </View>
    );
}

export default function CalorySummaryCard({
                                              calorieGoal,
                                              totalConsumed,
                                              totalRemaining,
                                              calorieProgress,
                                              totalProtein,
                                              proteinGoal,
                                              proteinProgress,
                                              totalFat,
                                              fatGoal,
                                              fatProgress,
                                              totalCarbs,
                                              carbsGoal,
                                              carbsProgress,
                                          }: Readonly<CalorieIntakeSummaryCardProps>) {
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Calorie Goal</Text>
            <Text style={styles.summaryGoal}>{calorieGoal} kcal</Text>

            <View style={styles.summaryMiddleRow}>
                <View style={styles.sideStat}>
                    <Text style={styles.sideStatBlue}>{totalConsumed} kcal</Text>
                    <Text style={styles.sideStatLabel}>consumed</Text>
                </View>

                <ProgressRing progress={calorieProgress} />

                <View style={styles.sideStat}>
                    <Text style={styles.sideStatBlue}>{totalRemaining} kcal</Text>
                    <Text style={styles.sideStatLabel}>remaining</Text>
                </View>
            </View>

            <View style={styles.macroRow}>
                <MacroBar
                    label="Protein"
                    current={totalProtein}
                    goal={proteinGoal}
                    progress={proteinProgress}
                />
                <MacroBar
                    label="Fat"
                    current={totalFat}
                    goal={fatGoal}
                    progress={fatProgress}
                />
                <MacroBar
                    label="Carbs"
                    current={totalCarbs}
                    goal={carbsGoal}
                    progress={carbsProgress}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: "#E7E7E7",
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    summaryTitle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "800",
        color: "#000",
    },
    summaryGoal: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "900",
        color: "#1EA7FF",
        marginTop: 4,
        marginBottom: 14,
    },
    summaryMiddleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    sideStat: {
        alignItems: "center",
        width: 90,
    },
    sideStatBlue: {
        fontSize: 20,
        fontWeight: "900",
        color: "#1EA7FF",
        textAlign: "center",
    },
    sideStatLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#333",
        textAlign: "center",
        marginTop: 2,
    },
    ringWrapper: {
        width: 92,
        height: 92,
        justifyContent: "center",
        alignItems: "center",
    },
    ringIconWrapper: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    macroRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    macroItem: {
        flex: 1,
    },
    macroLabel: {
        fontSize: 14,
        fontWeight: "800",
        color: "#111",
        marginBottom: 3,
    },
    macroValue: {
        fontSize: 12,
        fontWeight: "700",
        color: "#333",
        marginBottom: 6,
    },
    macroTrack: {
        height: 8,
        borderRadius: 999,
        backgroundColor: "#BFBFBF",
        overflow: "hidden",
    },
    macroFill: {
        height: "100%",
        borderRadius: 999,
        backgroundColor: "#1EA7FF",
    },
});