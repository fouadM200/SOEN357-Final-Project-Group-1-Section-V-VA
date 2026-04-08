import { useCallback, useEffect, useMemo, useState } from "react";
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
import calorieTrackerData from "../../data/calorieTrackerData.json";
import type { MealSection } from "@/types/calorieTracker";

const STORAGE_SECTIONS_KEY = "calorieTrackerSectionsByDate";

const badges = [
    "Completed your first workout session",
    "Worked out 3 days in a row",
    "Reached your daily calorie intake goal for 7 days in a row",
];

function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function HomePage() {
    const [firstName, setFirstName] = useState("User");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sectionsForSelectedDate, setSectionsForSelectedDate] = useState<MealSection[]>([]);

    const selectedDateKey = useMemo(
        () => formatDateKey(selectedDate),
        [selectedDate]
    );

    const loadFirstName = async () => {
        const savedFirstName = await AsyncStorage.getItem("firstName");
        if (savedFirstName) {
            setFirstName(savedFirstName);
        }
    };

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

    useEffect(() => {
        loadFirstName();
    }, []);

    useEffect(() => {
        loadCaloriesForSelectedDate();
    }, [loadCaloriesForSelectedDate]);

    useFocusEffect(
        useCallback(() => {
            loadFirstName();
            loadCaloriesForSelectedDate();
        }, [loadCaloriesForSelectedDate])
    );

    const totalConsumed = sectionsForSelectedDate.reduce(
        (sum, section) => sum + section.current,
        0
    );

    const calorieGoal = calorieTrackerData.calorieSummary.goal;
    const totalRemaining = Math.max(calorieGoal - totalConsumed, 0);

    const reportCards = [
        {
            title: "Workout completed",
            number: "20",
            unit: "Minutes left",
            icon: "barbell-outline" as keyof typeof Ionicons.glyphMap,
            progress: 0.72,
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
                            {reportCards.map((card, index) => (
                                <TodayReportCard
                                    key={index}
                                    title={card.title}
                                    number={card.number}
                                    unit={card.unit}
                                    progress={card.progress}
                                    icon={<Ionicons name={card.icon} size={24} color="#000" />}
                                />
                            ))}
                        </View>

                        <View style={styles.sectionDivider} />

                        <View style={styles.questionRow}>
                            <Text style={styles.sectionTitle}>Did you workout today?</Text>
                            <View style={styles.checkbox} />
                        </View>

                        <TouchableOpacity style={styles.workoutButton}>
                            <Text style={styles.workoutButtonText}>Access my workout</Text>
                        </TouchableOpacity>

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
                                <Text style={styles.milestoneValue}>01h42</Text>
                            </View>
                        </View>

                        <View style={styles.sectionDivider} />

                        <Text style={styles.sectionTitle}>Your badges for this week</Text>

                        <View style={styles.badgesContainer}>
                            {badges.map((badge, index) => (
                                <View key={index} style={styles.badgeRow}>
                                    <Ionicons
                                        name={
                                            index === 0
                                                ? "shield-checkmark"
                                                : index === 1
                                                    ? "ribbon"
                                                    : "trophy"
                                        }
                                        size={22}
                                        color="#1EA7FF"
                                        style={styles.badgeIcon}
                                    />
                                    <Text style={styles.badgeText}>{badge}</Text>
                                </View>
                            ))}
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
    questionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: "#555",
        borderRadius: 2,
        marginBottom: 12,
    },
    workoutButton: {
        backgroundColor: "#1EA7FF",
        borderRadius: 24,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 4,
        marginHorizontal: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 4,
    },
    workoutButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
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