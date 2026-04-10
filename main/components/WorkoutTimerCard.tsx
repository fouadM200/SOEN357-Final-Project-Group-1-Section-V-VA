import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type WorkoutTimerCardProps = {
    workoutDuration: string;
    isRunning: boolean;
    isCountdownVisible: boolean;
    countdownValue: number | "GO" | null;
    onStartWorkout: () => void;
    onStopWorkout: () => void;
};

export default function WorkoutTimerCard({
                                             workoutDuration,
                                             isRunning,
                                             isCountdownVisible,
                                             countdownValue,
                                             onStartWorkout,
                                             onStopWorkout,
                                         }: Readonly<WorkoutTimerCardProps>) {
    return (
        <>
            <Text style={styles.sectionTitle}>Workout timer</Text>

            <View style={styles.timerCard}>
                <Text style={styles.timerLabel}>Elapsed time</Text>
                <Text style={styles.timerValue}>{workoutDuration}</Text>
                <Text style={styles.timerSubtext}>
                    {isRunning
                        ? "Your workout is currently running."
                        : "This day starts at 00:00:00."}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.workoutActionButton,
                    isRunning && styles.stopWorkoutButton,
                ]}
                onPress={isRunning ? onStopWorkout : onStartWorkout}
                activeOpacity={0.85}
            >
                <Text style={styles.workoutActionButtonText}>
                    {isRunning ? "Stop workout" : "Start workout"}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isCountdownVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
            >
                <View style={styles.countdownOverlay}>
                    <Text style={styles.countdownText}>
                        {countdownValue === "GO" ? "GO!" : countdownValue}
                    </Text>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111",
        marginBottom: 14,
    },
    timerCard: {
        backgroundColor: "#EDEDED",
        borderRadius: 18,
        paddingVertical: 22,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    timerLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
        marginBottom: 10,
    },
    timerValue: {
        fontSize: 34,
        fontWeight: "900",
        color: "#111",
        letterSpacing: 1,
    },
    timerSubtext: {
        fontSize: 14,
        fontWeight: "500",
        color: "#555",
        marginTop: 10,
        textAlign: "center",
    },
    workoutActionButton: {
        backgroundColor: "#1EA7FF",
        borderRadius: 24,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 14,
        marginHorizontal: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 4,
    },
    stopWorkoutButton: {
        backgroundColor: "#111",
    },
    workoutActionButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    countdownOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    countdownText: {
        fontSize: 68,
        fontWeight: "900",
        color: "#FFFFFF",
        textAlign: "center",
    },
});
