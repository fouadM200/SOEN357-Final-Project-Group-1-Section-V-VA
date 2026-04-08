import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import Svg, { Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import calorieTrackerData from "../../data/calorieTrackerData.json";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import Calendar from "../../components/Calendar";
import MealRectangleCard from "../../components/MealRectangleCard";
import type {
    CalorieTrackerParams,
    MacroBarProps,
    Meal,
    MealSection,
    MealSectionCardProps,
    ProgressRingProps,
} from "@/types/calorieTracker";

const STORAGE_SECTIONS_KEY = "calorieTrackerSections";
const STORAGE_WATER_KEY = "calorieTrackerWaterIntakeByDate";

function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function ProgressRing({
                          progress,
                          size = 92,
                          strokeWidth = 12,
                      }: ProgressRingProps) {
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
                    rotation={-90}
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            <View style={styles.ringIconWrapper}>
                <Ionicons name="flame-outline" size={34} color="#111" />
            </View>
        </View>
    );
}

function MacroBar({
                      label,
                      current,
                      goal,
                      progress,
                  }: MacroBarProps) {
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

function MealSectionCard({
                             section,
                             onAddPress,
                         }: MealSectionCardProps) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                    <Ionicons name={section.icon} size={24} color="#000" />
                    <View style={styles.sectionTitleTextWrap}>
                        <Text style={styles.sectionCardTitle}>{section.title}</Text>
                        <Text style={styles.sectionCardSubtitle}>
                            {section.current}/{section.goal} kcal
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
                    <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.sectionInnerDivider} />

            {section.meals.length > 0 ? (
                <View style={styles.mealsList}>
                    {section.meals.map((meal) => (
                        <MealRectangleCard key={meal.id} meal={meal} />
                    ))}
                </View>
            ) : (
                <Text style={styles.emptyMealsText}>No meals logged yet.</Text>
            )}
        </View>
    );
}

export default function CalorieTrackerPage() {
    const { calorieSummary, mealSections } = calorieTrackerData;

    const params = useLocalSearchParams<CalorieTrackerParams>();

    const waterGoal = calorieSummary.water.goal;
    const waterStep = 0.5;
    const waterStepLabels = Array.from(
        { length: Math.floor(waterGoal / waterStep) + 1 },
        (_, index) => (index * waterStep).toFixed(1).replace(/\.0$/, "")
    );

    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

    const [waterIntake, setWaterIntake] = useState(0);
    const [waterByDate, setWaterByDate] = useState<Record<string, number>>({});
    const [sections, setSections] = useState<MealSection[]>(mealSections as MealSection[]);
    const [isStorageLoaded, setIsStorageLoaded] = useState(false);
    const lastProcessedRefresh = useRef<string | null>(null);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const [savedSections, savedWater] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_SECTIONS_KEY),
                    AsyncStorage.getItem(STORAGE_WATER_KEY),
                ]);

                if (savedSections) {
                    const parsedSections = JSON.parse(savedSections) as MealSection[];
                    setSections(parsedSections);
                }

                if (savedWater) {
                    const parsedWater = JSON.parse(savedWater) as Record<string, number> | number;

                    if (typeof parsedWater === "number") {
                        const todayKey = formatDateKey(new Date());
                        const migratedWaterMap = { [todayKey]: parsedWater };
                        setWaterByDate(migratedWaterMap);
                    } else {
                        setWaterByDate(parsedWater);
                    }
                } else {
                    setWaterByDate({});
                }
            } catch (error) {
                console.error("Failed to load calorie tracker data:", error);
            } finally {
                setIsStorageLoaded(true);
            }
        };

        loadStoredData();
    }, []);

    useEffect(() => {
        if (!isStorageLoaded) {
            return;
        }

        const saveSections = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_SECTIONS_KEY, JSON.stringify(sections));
            } catch (error) {
                console.error("Failed to save sections:", error);
            }
        };

        saveSections();
    }, [sections, isStorageLoaded]);

    useEffect(() => {
        if (!isStorageLoaded) {
            return;
        }

        const saveWaterByDate = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_WATER_KEY, JSON.stringify(waterByDate));
            } catch (error) {
                console.error("Failed to save water intake:", error);
            }
        };

        saveWaterByDate();
    }, [waterByDate, isStorageLoaded]);

    useEffect(() => {
        if (!isStorageLoaded) {
            return;
        }

        setWaterIntake(waterByDate[selectedDateKey] ?? 0);
    }, [selectedDateKey, waterByDate, isStorageLoaded]);

    useEffect(() => {
        if (!isStorageLoaded) {
            return;
        }

        if (!params.refresh || lastProcessedRefresh.current === params.refresh) {
            return;
        }

        if (
            !params.addedSection ||
            !params.addedMealName ||
            !params.addedCalories ||
            !params.addedProtein ||
            !params.addedFat ||
            !params.addedCarbs
        ) {
            return;
        }

        const newMeal: Meal = {
            id: `${params.addedSection}-${Date.now()}`,
            name: params.addedMealName,
            calories: Number(params.addedCalories) || 0,
            protein: Number(params.addedProtein) || 0,
            fat: Number(params.addedFat) || 0,
            carbs: Number(params.addedCarbs) || 0,
            imageKey: params.addedImageKey || "",
        };

        setSections((prevSections) =>
            prevSections.map((section) => {
                if (section.id !== params.addedSection) {
                    return section;
                }

                return {
                    ...section,
                    current: section.current + newMeal.calories,
                    meals: [...section.meals, newMeal],
                };
            })
        );

        lastProcessedRefresh.current = params.refresh;
    }, [params, isStorageLoaded]);

    const totalConsumed = sections.reduce((sum, section) => sum + section.current, 0);

    const totalProtein = sections.reduce(
        (sum, section) => sum + section.meals.reduce((mealSum, meal) => mealSum + meal.protein, 0),
        0
    );

    const totalFat = sections.reduce(
        (sum, section) => sum + section.meals.reduce((mealSum, meal) => mealSum + meal.fat, 0),
        0
    );

    const totalCarbs = sections.reduce(
        (sum, section) => sum + section.meals.reduce((mealSum, meal) => mealSum + meal.carbs, 0),
        0
    );

    const totalRemaining = Math.max(calorieSummary.goal - totalConsumed, 0);

    const calorieProgress = totalConsumed / calorieSummary.goal;
    const proteinProgress = totalProtein / calorieSummary.macros.protein.goal;
    const fatProgress = totalFat / calorieSummary.macros.fat.goal;
    const carbsProgress = totalCarbs / calorieSummary.macros.carbs.goal;

    const updateWaterForSelectedDate = (nextValue: number) => {
        setWaterIntake(nextValue);
        setWaterByDate((prev) => ({
            ...prev,
            [selectedDateKey]: nextValue,
        }));
    };

    const handleAddWater = () => {
        const nextValue = Math.min(waterIntake + waterStep, waterGoal);
        updateWaterForSelectedDate(nextValue);
    };

    const handleWaterSliderChange = (value: number) => {
        const snappedValue = Math.round(value / waterStep) * waterStep;
        const clampedValue = Math.max(0, Math.min(snappedValue, waterGoal));
        updateWaterForSelectedDate(clampedValue);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <PageHeaderBanner
                    title="Calorie Tracker"
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

                        <Text style={styles.pageSectionTitle}>Today’s calorie intake report</Text>

                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>Calorie Goal</Text>
                            <Text style={styles.summaryGoal}>{calorieSummary.goal} kcal</Text>

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
                                    goal={calorieSummary.macros.protein.goal}
                                    progress={proteinProgress}
                                />
                                <MacroBar
                                    label="Fat"
                                    current={totalFat}
                                    goal={calorieSummary.macros.fat.goal}
                                    progress={fatProgress}
                                />
                                <MacroBar
                                    label="Carbs"
                                    current={totalCarbs}
                                    goal={calorieSummary.macros.carbs.goal}
                                    progress={carbsProgress}
                                />
                            </View>
                        </View>

                        <View style={styles.waterCard}>
                            <View style={styles.sectionHeaderRow}>
                                <View style={styles.sectionTitleRow}>
                                    <Ionicons name="water-outline" size={24} color="#000" />
                                    <View style={styles.sectionTitleTextWrap}>
                                        <Text style={styles.sectionCardTitle}>Water Intake</Text>
                                        <Text style={styles.sectionCardSubtitle}>
                                            {waterIntake.toFixed(1)} / {waterGoal} L
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.addButton} onPress={handleAddWater}>
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.sectionInnerDivider} />

                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={waterGoal}
                                step={waterStep}
                                value={waterIntake}
                                onValueChange={handleWaterSliderChange}
                                minimumTrackTintColor="#1EA7FF"
                                maximumTrackTintColor="#BFBFBF"
                                thumbTintColor="#1EA7FF"
                            />

                            <View style={styles.waterScaleRow}>
                                {waterStepLabels.map((label) => (
                                    <Text key={label} style={styles.waterScaleText}>
                                        {label}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        {sections.map((section) => (
                            <MealSectionCard
                                key={section.id}
                                section={section}
                                onAddPress={() =>
                                    router.push({
                                        pathname: "/add-meal",
                                        params: {
                                            section: section.id,
                                        },
                                    })
                                }
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#2EA7F2",
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    headerLogo: {
        width: 120,
        height: 120,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionDivider: {
        height: 3,
        backgroundColor: "#1EA7FF",
        borderRadius: 3,
        marginVertical: 18,
    },
    pageSectionTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: "#111",
        marginBottom: 18,
    },
    summaryCard: {
        backgroundColor: "#DCDCDC",
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
    waterCard: {
        backgroundColor: "#DCDCDC",
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
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
    slider: {
        width: "100%",
        height: 40,
        marginBottom: 2,
    },
    waterScaleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
        paddingHorizontal: 2,
    },
    waterScaleText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#333",
        textAlign: "center",
        minWidth: 18,
    },
    mealsList: {
        gap: 12,
    },
    emptyMealsText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "800",
        color: "#111",
        paddingVertical: 10,
    },
});