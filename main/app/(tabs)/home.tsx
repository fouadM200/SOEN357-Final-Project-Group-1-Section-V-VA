import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import FitFuelLogo from "../../components/FitFuelLogo";

const weekDays = [
    { day: "Tue", date: 24, active: false },
    { day: "Wed", date: 25, active: false },
    { day: "Thu", date: 26, active: true },
    { day: "Fri", date: 27, active: false },
    { day: "Sat", date: 28, active: false },
];

const reportCards = [
    {
        title: "Workout completed",
        value: "20",
        label: "Minutes left",
        icon: "barbell-outline",
    },
    {
        title: "Active Calories",
        value: "1105",
        label: "Calories left",
        icon: "flame-outline",
    },
    {
        title: "Heart Rate",
        value: "86",
        label: "BPM",
        icon: "heart-outline",
    },
    {
        title: "Steps",
        value: "2250",
        label: "Steps left",
        icon: "footsteps-outline",
    },
];

const badges = [
    "Completed your first workout session",
    "Worked out 3 days in a row",
    "Reached your daily calorie intake goal for 7 days in a row",
];

export default function HomePage() {
    const [firstName, setFirstName] = useState("User");

    useEffect(() => {
        const loadFirstName = async () => {
            const savedFirstName = await AsyncStorage.getItem("firstName");
            if (savedFirstName) {
                setFirstName(savedFirstName);
            }
        };

        loadFirstName();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.hello}>Hello, {firstName}!</Text>
                    <Text style={styles.subtext}>Hope you're doing well today!</Text>
                </View>

                <View style={styles.logoWrapper}>
                    <FitFuelLogo width={120} height={120} />
                </View>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.monthPill}>
                    <Text style={styles.monthText}>March 2026</Text>
                    <Ionicons name="chevron-down" size={16} color="#8D8D8D" />
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysRow}
                >
                    {weekDays.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dayCard,
                                item.active && styles.dayCardActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    item.active && styles.dayTextActive,
                                ]}
                            >
                                {item.day}
                            </Text>
                            <Text
                                style={[
                                    styles.dateText,
                                    item.active && styles.dateTextActive,
                                ]}
                            >
                                {item.date}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionTitle}>Today’s report</Text>

                <View style={styles.reportGrid}>
                    {reportCards.map((card, index) => (
                        <View key={index} style={styles.reportCard}>
                            <Text style={styles.reportTitle}>{card.title}</Text>

                            <View style={styles.circleWrapper}>
                                <View style={styles.circleOuter}>
                                    <View style={styles.circleInner}>
                                        <Ionicons
                                            name={card.icon as any}
                                            size={24}
                                            color="#000"
                                        />
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.reportValue}>{card.value}</Text>
                            <Text style={styles.reportLabel}>{card.label}</Text>
                        </View>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F3F3",
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        backgroundColor: "#1EA7FF",
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#C9C9C9",
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    hello: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "800",
    },
    subtext: {
        color: "#fff",
        fontSize: 14,
        marginTop: 6,
        fontWeight: "500",
    },
    logoWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 14,
    },
    monthPill: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E7E7E7",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginBottom: 14,
        gap: 6,
    },
    monthText: {
        color: "#8D8D8D",
        fontSize: 14,
        fontWeight: "600",
    },
    daysRow: {
        paddingBottom: 8,
        gap: 10,
    },
    dayCard: {
        width: 72,
        height: 92,
        backgroundColor: "#D9D9D9",
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    dayCardActive: {
        backgroundColor: "#1EA7FF",
    },
    dayText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
        marginBottom: 4,
    },
    dayTextActive: {
        color: "#fff",
    },
    dateText: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111",
    },
    dateTextActive: {
        color: "#fff",
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
        gap: 12,
    },
    reportCard: {
        width: "48%",
        backgroundColor: "#EDEDED",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 3,
    },
    reportTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111",
        textAlign: "center",
        marginBottom: 10,
    },
    circleWrapper: {
        marginBottom: 10,
    },
    circleOuter: {
        width: 68,
        height: 68,
        borderRadius: 34,
        borderWidth: 6,
        borderColor: "#1EA7FF",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    circleInner: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
    },
    reportValue: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111",
        lineHeight: 32,
    },
    reportLabel: {
        fontSize: 13,
        color: "#111",
        fontWeight: "600",
        textAlign: "center",
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