import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle } from "react-native-svg";
import calorieTrackerData from "../../data/calorieTrackerData.json";
import { mealImages } from "../../data/mealImages";
import FitFuelLogo from "../../components/FitFuelLogo";

type Meal = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    imageKey: string;
};

type MealSection = {
    id: string;
    title: string;
    current: number;
    goal: number;
    icon: keyof typeof Ionicons.glyphMap;
    meals: Meal[];
};

const STORAGE_SECTIONS_KEY = "calorieTrackerSections";
const STORAGE_WATER_KEY = "calorieTrackerWaterIntake";

function ProgressRing({
                          progress,
                          size = 92,
                          strokeWidth = 12,
                      }: {
    progress: number;
    size?: number;
    strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const dashOffset = circumference * (1 - clampedProgress);

    return (
        <View style={styles.ringWrapper}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E8E8E8"
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
                    strokeDashoffset={-dashOffset}
                    rotation={-90}
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            <View style={styles.ringInner}>
                <Ionicons name="flame" size={34} color="#000" />
            </View>
        </View>
    );
}

function MacroBar({
                      label,
                      current,
                      goal,
                      progress,
                  }: {
    label: string;
    current: number;
    goal: number;
    progress: number;
}) {
    return (
        <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>{label}</Text>
            <View style={styles.macroTrack}>
                <View style={[styles.macroFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
            </View>
            <Text style={styles.macroValue}>
                {current}/{goal} g
            </Text>
        </View>
    );
}

function MealCard({ meal }: { meal: Meal }) {
    return (
        <View style={styles.mealCard}>
            {mealImages[meal.imageKey] ? (
                <Image source={mealImages[meal.imageKey]} style={styles.mealImage} />
            ) : (
                <View style={styles.noImagePlaceholder}>
                    <Text style={styles.noImageText}>No image</Text>
                </View>
            )}

            <View style={styles.mealContent}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>

                <View style={styles.mealDivider} />

                <View style={styles.mealMacrosRow}>
                    <Text style={styles.mealMacroText}>Protein: {meal.protein}g</Text>
                    <Text style={styles.mealMacroText}>Fat: {meal.fat}g</Text>
                    <Text style={styles.mealMacroText}>Carbs: {meal.carbs}g</Text>
                </View>
            </View>
        </View>
    );
}

function MealSectionCard({
                             section,
                             onAddPress,
                         }: {
    section: MealSection;
    onAddPress: () => void;
}) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                    <Ionicons name={section.icon} size={24} color="#000" />
                    <View style={styles.sectionTitleTextWrap}>
                        <Text style={styles.sectionCardTitle}>{section.title}</Text>
                        <Text style={styles.sectionCardSubtitle}>
                            {section.current} / {section.goal} kcal
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
                        <MealCard key={meal.id} meal={meal} />
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

    const params = useLocalSearchParams<{
        addedSection?: string;
        addedMealName?: string;
        addedCalories?: string;
        addedProtein?: string;
        addedFat?: string;
        addedCarbs?: string;
        addedImageKey?: string;
        refresh?: string;
    }>();

    const waterGoal = calorieSummary.water.goal;
    const waterStep = 0.5;

    const [waterIntake, setWaterIntake] = useState(calorieSummary.water.current);
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
                    const parsedWater = JSON.parse(savedWater) as number;
                    setWaterIntake(parsedWater);
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

        const saveWater = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_WATER_KEY, JSON.stringify(waterIntake));
            } catch (error) {
                console.error("Failed to save water intake:", error);
            }
        };

        saveWater();
    }, [waterIntake, isStorageLoaded]);

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
    const waterProgress = waterIntake / waterGoal;

    const handleAddWater = () => {
        setWaterIntake((prev) => Math.min(prev + waterStep, waterGoal));
    };

    const handleWaterSliderChange = (value: number) => {
        const snappedValue = Math.round(value / waterStep) * waterStep;
        const clampedValue = Math.max(0, Math.min(snappedValue, waterGoal));
        setWaterIntake(clampedValue);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                    <Text style={styles.headerTitle}>Calorie Tracker</Text>
                </View>

                <View style={styles.logoWrapper}>
                    <FitFuelLogo width={110} height={110} />
                </View>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.monthPill}>
                    <Text style={styles.monthText}>March 2026</Text>
                    <Ionicons name="chevron-down" size={16} color="#A0A0A0" />
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysRow}
                >
                    {[
                        { day: "Tue", date: 24, active: false },
                        { day: "Wed", date: 25, active: false },
                        { day: "Thu", date: 26, active: true },
                        { day: "Fri", date: 27, active: false },
                        { day: "Sat", date: 28, active: false },
                    ].map((item, index) => (
                        <View
                            key={index}
                            style={[styles.dayCard, item.active && styles.dayCardActive]}
                        >
                            <Text style={[styles.dayText, item.active && styles.dayTextActive]}>
                                {item.day}
                            </Text>
                            <Text style={[styles.dateText, item.active && styles.dateTextActive]}>
                                {item.date}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

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

                    <View style={styles.waterSliderWrapper}>
                        <View style={styles.waterTrack}>
                            <View
                                style={[
                                    styles.waterFill,
                                    { width: `${Math.min(waterProgress * 100, 100)}%` },
                                ]}
                            />
                        </View>

                        <Slider
                            style={styles.waterSlider}
                            minimumValue={0}
                            maximumValue={waterGoal}
                            step={waterStep}
                            value={waterIntake}
                            onValueChange={handleWaterSliderChange}
                            minimumTrackTintColor="transparent"
                            maximumTrackTintColor="transparent"
                            thumbTintColor="#1EA7FF"
                        />
                    </View>
                </View>

                {sections.map((section) => (
                    <MealSectionCard
                        key={section.id}
                        section={section}
                        onAddPress={() =>
                            router.push({
                                pathname: "/add-meal",
                                params: { section: section.id },
                            })
                        }
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        backgroundColor: "#1EA7FF",
        paddingTop: 54,
        paddingBottom: 24,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottomWidth: 1,
        borderBottomColor: "#CFCFCF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 3,
        elevation: 4,
    },
    headerTitleWrap: {
        flex: 1,
        paddingRight: 10,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
    },
    logoWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
    },
    monthPill: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E7E7E7",
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 9,
        marginBottom: 16,
        gap: 8,
    },
    monthText: {
        color: "#A0A0A0",
        fontSize: 15,
        fontWeight: "700",
    },
    daysRow: {
        gap: 12,
        paddingBottom: 10,
    },
    dayCard: {
        width: 82,
        height: 112,
        backgroundColor: "#D9D9D9",
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.13,
        shadowRadius: 3,
        elevation: 3,
    },
    dayCardActive: {
        backgroundColor: "#1EA7FF",
    },
    dayText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#111",
        marginBottom: 6,
    },
    dayTextActive: {
        color: "#fff",
    },
    dateText: {
        fontSize: 28,
        fontWeight: "900",
        color: "#000",
    },
    dateTextActive: {
        color: "#fff",
    },
    sectionDivider: {
        height: 4,
        backgroundColor: "#1EA7FF",
        borderRadius: 4,
        marginVertical: 18,
    },
    pageSectionTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: "#111",
        marginBottom: 18,
    },
    summaryCard: {
        backgroundColor: "#DCDCDC",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    summaryTitle: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "800",
        color: "#111",
    },
    summaryGoal: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "900",
        color: "#1EA7FF",
        marginTop: 2,
    },
    summaryMiddleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 16,
    },
    sideStat: {
        width: 82,
        alignItems: "center",
    },
    sideStatBlue: {
        fontSize: 16,
        fontWeight: "900",
        color: "#1EA7FF",
        textAlign: "center",
    },
    sideStatLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#4A4A4A",
        textAlign: "center",
        marginTop: 1,
    },
    ringWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    ringInner: {
        position: "absolute",
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center",
    },
    macroRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    macroItem: {
        flex: 1,
    },
    macroLabel: {
        fontSize: 14,
        fontWeight: "800",
        color: "#111",
        marginBottom: 4,
    },
    macroTrack: {
        height: 12,
        backgroundColor: "#F2F2F2",
        borderRadius: 999,
        overflow: "hidden",
        marginBottom: 4,
    },
    macroFill: {
        height: "100%",
        backgroundColor: "#1EA7FF",
        borderRadius: 999,
    },
    macroValue: {
        fontSize: 12,
        fontWeight: "800",
        color: "#111",
    },
    waterCard: {
        backgroundColor: "#DCDCDC",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 18,
    },
    sectionCard: {
        backgroundColor: "#DCDCDC",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
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
        marginLeft: 12,
    },
    sectionCardTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#111",
    },
    sectionCardSubtitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6A6A6A",
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#1EA7FF",
        justifyContent: "center",
        alignItems: "center",
    },
    sectionInnerDivider: {
        height: 2,
        backgroundColor: "#B6B6B6",
        marginVertical: 14,
    },
    waterSliderWrapper: {
        marginHorizontal: 10,
        position: "relative",
        justifyContent: "center",
        height: 28,
    },
    waterTrack: {
        height: 18,
        backgroundColor: "#F2F2F2",
        borderRadius: 999,
        overflow: "hidden",
    },
    waterFill: {
        height: "100%",
        backgroundColor: "#1EA7FF",
        borderRadius: 999,
    },
    waterSlider: {
        position: "absolute",
        width: "100%",
        height: 28,
    },
    mealsList: {
        gap: 14,
    },
    mealCard: {
        backgroundColor: "#F5F5F5",
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    mealImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
    },
    mealContent: {
        flex: 1,
    },
    mealName: {
        fontSize: 14,
        fontWeight: "800",
        color: "#111",
        lineHeight: 18,
    },
    mealCalories: {
        fontSize: 15,
        fontWeight: "900",
        color: "#1EA7FF",
        marginTop: 2,
    },
    mealDivider: {
        height: 1.5,
        backgroundColor: "#B8B8B8",
        marginVertical: 8,
    },
    mealMacrosRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    mealMacroText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#333",
    },
    emptyMealsText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "800",
        color: "#111",
        paddingVertical: 10,
    },
});