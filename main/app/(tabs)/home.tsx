import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import Calendar from "../../components/Calendar";
import TodayReportCard from "../../components/TodayReportCard";
import WorkoutTimerCard from "../../components/WorkoutTimerCard";
import calorieTrackerData from "../../data/calorieTrackerData.json";
import type { MealSection } from "@/types/calorieTracker";

const STORAGE_SECTIONS_KEY = "calorieTrackerSectionsByDate";
const WORKOUT_TIMER_STORAGE_KEY = "workoutTimerByDate";
const WORKOUT_GOAL_MINUTES = 120;

const badges = [
    "Completed your first workout session",
    "Worked out 3 days in a row",
    "Reached your daily calorie intake goal for 7 days in a row",
];

type WorkoutTimerEntry = {
    elapsedSeconds: number;
    isRunning: boolean;
};

type WorkoutTimerMap = Record<string, WorkoutTimerEntry>;

function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDuration(totalSeconds: number) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function formatHoursMinutes(totalSeconds: number) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    return `${hours}h${minutes}`;
}

export default function HomePage() {
    const [firstName, setFirstName] = useState("User");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sectionsForSelectedDate, setSectionsForSelectedDate] = useState<MealSection[]>([]);
    const [workoutTimersByDate, setWorkoutTimersByDate] = useState<WorkoutTimerMap>({});
    const [countdownValue, setCountdownValue] = useState<number | "GO" | null>(null);
    const [isCountdownVisible, setIsCountdownVisible] = useState(false);

    const workoutIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

    const selectedWorkoutEntry = workoutTimersByDate[selectedDateKey] ?? {
        elapsedSeconds: 0,
        isRunning: false,
    };

    const loadFirstName = async () => {
        const savedFirstName = await AsyncStorage.getItem("firstName");
        if (savedFirstName) {
            setFirstName(savedFirstName);
        }
    };

    const saveWorkoutTimers = useCallback(async (timers: WorkoutTimerMap) => {
        try {
            await AsyncStorage.setItem(
                WORKOUT_TIMER_STORAGE_KEY,
                JSON.stringify(timers)
            );
        } catch (error) {
            console.error("Failed to save workout timer data:", error);
        }
    }, []);

    const loadWorkoutTimers = useCallback(async () => {
        try {
            const savedTimers = await AsyncStorage.getItem(WORKOUT_TIMER_STORAGE_KEY);

            if (!savedTimers) {
                setWorkoutTimersByDate({});
                return;
            }

            const parsedTimers = JSON.parse(savedTimers) as WorkoutTimerMap;
            setWorkoutTimersByDate(parsedTimers);
        } catch (error) {
            console.error("Failed to load workout timer data:", error);
            setWorkoutTimersByDate({});
        }
    }, []);

    const loadCaloriesForSelectedDate = useCallback(async () => {
        try {
            const savedSectionsByDate = await AsyncStorage.getItem(STORAGE_SECTIONS_KEY);

            if (!savedSectionsByDate) {
                setSectionsForSelectedDate([]);
                return;
            }

            const parsedSectionsByDate = JSON.parse(
                savedSectionsByDate
            ) as Record<string, MealSection[]>;

            setSectionsForSelectedDate(parsedSectionsByDate[selectedDateKey] ?? []);
        } catch (error) {
            console.error("Failed to load homepage calorie data:", error);
            setSectionsForSelectedDate([]);
        }
    }, [selectedDateKey]);

    const stopWorkoutInterval = useCallback(() => {
        if (workoutIntervalRef.current) {
            clearInterval(workoutIntervalRef.current);
            workoutIntervalRef.current = null;
        }
    }, []);

    const stopCountdownInterval = useCallback(() => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    }, []);

    const startWorkoutInterval = useCallback(() => {
        stopWorkoutInterval();

        workoutIntervalRef.current = setInterval(() => {
            setWorkoutTimersByDate((prev) => {
                const currentEntry = prev[selectedDateKey] ?? {
                    elapsedSeconds: 0,
                    isRunning: true,
                };

                const updatedTimers = {
                    ...prev,
                    [selectedDateKey]: {
                        ...currentEntry,
                        elapsedSeconds: currentEntry.elapsedSeconds + 1,
                        isRunning: true,
                    },
                };

                void saveWorkoutTimers(updatedTimers);
                return updatedTimers;
            });
        }, 1000);
    }, [saveWorkoutTimers, selectedDateKey, stopWorkoutInterval]);

    const startWorkout = useCallback(() => {
        if (selectedWorkoutEntry.isRunning || isCountdownVisible) {
            return;
        }

        setIsCountdownVisible(true);
        setCountdownValue(3);

        let currentValue = 3;

        stopCountdownInterval();

        countdownIntervalRef.current = setInterval(() => {
            currentValue -= 1;

            if (currentValue > 0) {
                setCountdownValue(currentValue);
                return;
            }

            if (currentValue === 0) {
                setCountdownValue("GO");
                return;
            }

            stopCountdownInterval();
            setIsCountdownVisible(false);
            setCountdownValue(null);

            setWorkoutTimersByDate((prev) => {
                const currentEntry = prev[selectedDateKey] ?? {
                    elapsedSeconds: 0,
                    isRunning: false,
                };

                const updatedTimers = {
                    ...prev,
                    [selectedDateKey]: {
                        ...currentEntry,
                        isRunning: true,
                    },
                };

                void saveWorkoutTimers(updatedTimers);
                return updatedTimers;
            });

            startWorkoutInterval();
        }, 1000);
    }, [
        isCountdownVisible,
        saveWorkoutTimers,
        selectedDateKey,
        selectedWorkoutEntry.isRunning,
        startWorkoutInterval,
        stopCountdownInterval,
    ]);

    const stopWorkout = useCallback(() => {
        stopWorkoutInterval();

        setWorkoutTimersByDate((prev) => {
            const currentEntry = prev[selectedDateKey] ?? {
                elapsedSeconds: 0,
                isRunning: false,
            };

            const updatedTimers = {
                ...prev,
                [selectedDateKey]: {
                    ...currentEntry,
                    isRunning: false,
                },
            };

            void saveWorkoutTimers(updatedTimers);
            return updatedTimers;
        });
    }, [saveWorkoutTimers, selectedDateKey, stopWorkoutInterval]);

    useEffect(() => {
        loadFirstName();
        loadWorkoutTimers();
    }, [loadWorkoutTimers]);

    useEffect(() => {
        loadCaloriesForSelectedDate();
    }, [loadCaloriesForSelectedDate]);

    useFocusEffect(
        useCallback(() => {
            loadFirstName();
            loadCaloriesForSelectedDate();
            loadWorkoutTimers();
        }, [loadCaloriesForSelectedDate, loadWorkoutTimers])
    );

    useEffect(() => {
        if (selectedWorkoutEntry.isRunning) {
            startWorkoutInterval();
        } else {
            stopWorkoutInterval();
        }

        return () => {
            stopWorkoutInterval();
        };
    }, [
        selectedDateKey,
        selectedWorkoutEntry.isRunning,
        startWorkoutInterval,
        stopWorkoutInterval,
    ]);

    useEffect(() => {
        return () => {
            stopWorkoutInterval();
            stopCountdownInterval();
        };
    }, [stopCountdownInterval, stopWorkoutInterval]);

    const totalConsumed = sectionsForSelectedDate.reduce(
        (sum, section) => sum + section.current,
        0
    );

    const calorieGoal = calorieTrackerData.calorieSummary.goal;
    const totalRemaining = Math.max(calorieGoal - totalConsumed, 0);
    const workoutDuration = formatDuration(selectedWorkoutEntry.elapsedSeconds);
    const totalWorkoutTimeDisplay = formatHoursMinutes(selectedWorkoutEntry.elapsedSeconds);

    const elapsedMinutes = Math.floor(selectedWorkoutEntry.elapsedSeconds / 60);
    const minutesLeftToWorkout = Math.max(WORKOUT_GOAL_MINUTES - elapsedMinutes, 0);
    const workoutProgress = Math.min(
        selectedWorkoutEntry.elapsedSeconds / (WORKOUT_GOAL_MINUTES * 60),
        1
    );

    const reportCards = [
        {
            title: "Workout completed",
            number: String(minutesLeftToWorkout),
            unit: "Minutes left",
            icon: "barbell-outline" as keyof typeof Ionicons.glyphMap,
            progress: workoutProgress,
        },
        {
            title: "Active Calories",
            number: String(totalRemaining),
            unit: "Calories left",
            icon: "flame-outline" as keyof typeof Ionicons.glyphMap,
            progress: calorieGoal > 0 ? totalConsumed / calorieGoal : 0,
        },
        {
            title: "Heart Rate",
            number: "86",
            unit: "BPM",
            icon: "heart-outline" as keyof typeof Ionicons.glyphMap,
            progress: 0.82,
        },
        {
            title: "Steps",
            number: "2250",
            unit: "Steps left",
            icon: "footsteps-outline" as keyof typeof Ionicons.glyphMap,
            progress: 0.35,
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <PageHeaderBanner
                    title={`Hi, ${firstName}!`}
                    description="Hope you're doing well today!"
                    logo={
                        <Image
                            source={require("../../assets/images/fitfuel-logo.png")}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                    }
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <Calendar onDateChange={setSelectedDate} />

                        <View style={styles.sectionDivider} />

                        <Text style={styles.sectionTitle}>Today’s report</Text>

                        <View style={styles.reportGrid}>
                            {reportCards.map((card) => (
                                <TodayReportCard
                                    key={card.title}
                                    title={card.title}
                                    number={card.number}
                                    unit={card.unit}
                                    progress={card.progress}
                                    icon={<Ionicons name={card.icon} size={24} color="#000" />}
                                />
                            ))}
                        </View>

                        <View style={styles.sectionDivider} />

                        <WorkoutTimerCard
                            workoutDuration={workoutDuration}
                            isRunning={selectedWorkoutEntry.isRunning}
                            isCountdownVisible={isCountdownVisible}
                            countdownValue={countdownValue}
                            onStartWorkout={startWorkout}
                            onStopWorkout={stopWorkout}
                        />

                        <View style={styles.sectionDivider} />

                        <Text style={styles.sectionTitle}>Your milestones</Text>

                        <View style={styles.milestonesContainer}>
                            <View style={styles.milestoneItem}>
                                <Text style={styles.milestoneLabel}>Workouts completed</Text>
                                <Text style={styles.milestoneValue}>1</Text>
                            </View>

                            <View style={styles.milestoneItem}>
                                <Text style={styles.milestoneLabel}>Exercises completed</Text>
                                <Text style={styles.milestoneValue}>8</Text>
                            </View>

                            <View style={styles.milestoneItem}>
                                <Text style={styles.milestoneLabel}>Total weight lifted</Text>
                                <Text style={styles.milestoneValue}>320 kg / 705 lbs</Text>
                            </View>

                            <View style={styles.milestoneItem}>
                                <Text style={styles.milestoneLabel}>Total workout time</Text>
                                <Text style={styles.milestoneValue}>{totalWorkoutTimeDisplay}</Text>
                            </View>
                        </View>

                        <View style={styles.sectionDivider} />

                        <Text style={styles.sectionTitle}>Your badges for this week</Text>

                        <View style={styles.badgesContainer}>
                            {badges.map((badge) => {
                                let badgeIconName: keyof typeof Ionicons.glyphMap;

                                if (badge === "Completed your first workout session") {
                                    badgeIconName = "shield-checkmark";
                                } else if (badge === "Worked out 3 days in a row") {
                                    badgeIconName = "ribbon";
                                } else {
                                    badgeIconName = "trophy";
                                }

                                return (
                                    <View key={badge} style={styles.badgeRow}>
                                        <Ionicons
                                            name={badgeIconName}
                                            size={22}
                                            color="#1EA7FF"
                                            style={styles.badgeIcon}
                                        />
                                        <Text style={styles.badgeText}>{badge}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <TouchableOpacity style={styles.keepItUpButton}>
                            <Text style={styles.keepItUpText}>Keep it Up!</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#1EA7FF",
    },
    container: {
        flex: 1,
        backgroundColor: "#F3F3F3",
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#F3F3F3",
    },
    scrollContent: {
        paddingBottom: 30,
    },
    headerLogo: {
        width: 120,
        height: 120,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 14,
    },
    sectionDivider: {
        height: 3,
        backgroundColor: "#1EA7FF",
        marginVertical: 18,
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111",
        marginBottom: 14,
    },
    reportGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 2,
    },
    milestonesContainer: {
        gap: 8,
    },
    milestoneItem: {
        marginBottom: 2,
    },
    milestoneLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4B4B4B",
    },
    milestoneValue: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1EA7FF",
        marginTop: 2,
    },
    badgesContainer: {
        gap: 16,
        marginBottom: 20,
    },
    badgeRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingRight: 8,
    },
    badgeIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    badgeText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#444",
        lineHeight: 22,
    },
    keepItUpButton: {
        backgroundColor: "#1EA7FF",
        borderRadius: 8,
        paddingVertical: 18,
        alignItems: "center",
        marginTop: 6,
    },
    keepItUpText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
});