import { useEffect, useRef, useState } from "react";
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
import Svg, { Circle } from "react-native-svg";
import PageHeaderBanner from "../../components/PageHeaderBanner";

const weekDays = [
    { day: "Sun", date: 1, active: false },
    { day: "Mon", date: 2, active: false },
    { day: "Tue", date: 3, active: false },
    { day: "Wed", date: 4, active: false },
    { day: "Thu", date: 5, active: false },
    { day: "Fri", date: 6, active: false },
    { day: "Sat", date: 7, active: false },
    { day: "Sun", date: 8, active: false },
    { day: "Mon", date: 9, active: false },
    { day: "Tue", date: 10, active: false },
    { day: "Wed", date: 11, active: false },
    { day: "Thu", date: 12, active: false },
    { day: "Fri", date: 13, active: false },
    { day: "Sat", date: 14, active: false },
    { day: "Sun", date: 15, active: false },
    { day: "Mon", date: 16, active: false },
    { day: "Tue", date: 17, active: false },
    { day: "Wed", date: 18, active: false },
    { day: "Thu", date: 19, active: false },
    { day: "Fri", date: 20, active: false },
    { day: "Sat", date: 21, active: false },
    { day: "Sun", date: 22, active: false },
    { day: "Mon", date: 23, active: false },
    { day: "Tue", date: 24, active: false },
    { day: "Wed", date: 25, active: false },
    { day: "Thu", date: 26, active: true },
    { day: "Fri", date: 27, active: false },
    { day: "Sat", date: 28, active: false },
    { day: "Sun", date: 29, active: false },
    { day: "Mon", date: 30, active: false },
    { day: "Tue", date: 31, active: false },
];

const reportCards = [
    {
        title: "Workout completed",
        value: "20",
        label: "Minutes left",
        icon: "barbell-outline",
        progress: 0.72,
    },
    {
        title: "Active Calories",
        value: "1105",
        label: "Calories left",
        icon: "flame-outline",
        progress: 0.58,
    },
    {
        title: "Heart Rate",
        value: "86",
        label: "BPM",
        icon: "heart-outline",
        progress: 0.82,
    },
    {
        title: "Steps",
        value: "2250",
        label: "Steps left",
        icon: "footsteps-outline",
        progress: 0.35,
    },
];

const badges = [
    "Completed your first workout session",
    "Worked out 3 days in a row",
    "Reached your daily calorie intake goal for 7 days in a row",
];

function ReportRing({
                        icon,
                        progress,
                    }: {
    icon: keyof typeof Ionicons.glyphMap;
    progress: number;
}) {
    const size = 68;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const dashOffset = circumference * (1 - clampedProgress);

    return (
        <View style={styles.circleWrapper}>
            <View style={styles.ringContainer}>
                <Svg width={size} height={size} style={styles.ringSvg}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#D9D9D9"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#1EA7FF"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        rotation={-90}
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>

                <View style={styles.circleInner}>
                    <Ionicons name={icon} size={24} color="#000" />
                </View>
            </View>
        </View>
    );
}

export default function HomePage() {
    const [firstName, setFirstName] = useState("User");
    const daysScrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const loadFirstName = async () => {
            const savedFirstName = await AsyncStorage.getItem("firstName");
            if (savedFirstName) {
                setFirstName(savedFirstName);
            }
        };

        loadFirstName();

        const activeIndex = weekDays.findIndex((item) => item.active);

        if (activeIndex !== -1) {
            const cardWidth = 72;
            const cardGap = 10;
            const cardFullWidth = cardWidth + cardGap;

            setTimeout(() => {
                daysScrollRef.current?.scrollTo({
                    x: Math.max(0, activeIndex * cardFullWidth - 135),
                    animated: false,
                });
            }, 100);
        }
    }, []);

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
                        <TouchableOpacity style={styles.monthPill}>
                            <Text style={styles.monthText}>March 2026</Text>
                            <Ionicons name="chevron-down" size={16} color="#8D8D8D" />
                        </TouchableOpacity>

                        <ScrollView
                            ref={daysScrollRef}
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

                                    <ReportRing
                                        icon={card.icon as keyof typeof Ionicons.glyphMap}
                                        progress={card.progress}
                                    />

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
    ringContainer: {
        width: 68,
        height: 68,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    ringSvg: {
        position: "absolute",
        top: 0,
        left: 0,
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