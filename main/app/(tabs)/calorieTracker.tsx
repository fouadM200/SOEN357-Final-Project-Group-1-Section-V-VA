import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import calorieTrackerData from "../../data/calorieTrackerData.json";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import Calendar from "../../components/Calendar";
import MealRectangleCard from "../../components/MealRectangleCard";
import TrackerSectionCard from "../../components/TrackerSectionCard";
import CalorySummaryCard from "../../components/CalorySummaryCard";
import type {
    CalorieTrackerParams,
    Meal,
    MealSection,
} from "@/types/calorieTracker";
import { getScopedStorageKey } from "@/utils/authStorage";

const STORAGE_SECTIONS_KEY = "calorieTrackerSectionsByDate";
const STORAGE_WATER_KEY = "calorieTrackerWaterIntakeByDate";

function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function createDefaultSections() {
    return (calorieTrackerData.mealSections as MealSection[]).map((section) => ({
        ...section,
        current: 0,
        meals: [],
    }));
}

export default function CalorieTrackerPage() {
    const { calorieSummary } = calorieTrackerData;

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
    const [sections, setSections] = useState<MealSection[]>(createDefaultSections());
    const [sectionsByDate, setSectionsByDate] = useState<Record<string, MealSection[]>>({});
    const [isStorageLoaded, setIsStorageLoaded] = useState(false);
    const lastProcessedRefresh = useRef<string | null>(null);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const sectionsStorageKey = await getScopedStorageKey(STORAGE_SECTIONS_KEY);
                const waterStorageKey = await getScopedStorageKey(STORAGE_WATER_KEY);

                if (!sectionsStorageKey || !waterStorageKey) {
                    setSectionsByDate({});
                    setWaterByDate({});
                    setIsStorageLoaded(true);
                    return;
                }

                const [savedSectionsByDate, savedWater] = await Promise.all([
                    AsyncStorage.getItem(sectionsStorageKey),
                    AsyncStorage.getItem(waterStorageKey),
                ]);

                if (savedSectionsByDate) {
                    const parsedSectionsByDate = JSON.parse(
                        savedSectionsByDate
                    ) as Record<string, MealSection[]>;
                    setSectionsByDate(parsedSectionsByDate);
                } else {
                    setSectionsByDate({});
                }

                if (savedWater) {
                    const parsedWater = JSON.parse(savedWater) as
                        | Record<string, number>
                        | number;

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

        const saveSectionsByDate = async () => {
            try {
                const storageKey = await getScopedStorageKey(STORAGE_SECTIONS_KEY);

                if (!storageKey) {
                    return;
                }

                await AsyncStorage.setItem(
                    storageKey,
                    JSON.stringify(sectionsByDate)
                );
            } catch (error) {
                console.error("Failed to save sections by date:", error);
            }
        };

        saveSectionsByDate();
    }, [sectionsByDate, isStorageLoaded]);

    useEffect(() => {
        if (!isStorageLoaded) {
            return;
        }

        const saveWaterByDate = async () => {
            try {
                const storageKey = await getScopedStorageKey(STORAGE_WATER_KEY);

                if (!storageKey) {
                    return;
                }

                await AsyncStorage.setItem(
                    storageKey,
                    JSON.stringify(waterByDate)
                );
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
        setSections(sectionsByDate[selectedDateKey] ?? createDefaultSections());
    }, [selectedDateKey, waterByDate, sectionsByDate, isStorageLoaded]);

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

        setSections((prevSections) => {
            const updatedSections = prevSections.map((section) => {
                if (section.id !== params.addedSection) {
                    return section;
                }

                return {
                    ...section,
                    current: section.current + newMeal.calories,
                    meals: [...section.meals, newMeal],
                };
            });

            setSectionsByDate((prev) => ({
                ...prev,
                [selectedDateKey]: updatedSections,
            }));

            return updatedSections;
        });

        lastProcessedRefresh.current = params.refresh;
    }, [params, isStorageLoaded, selectedDateKey]);

    const totalConsumed = sections.reduce((sum, section) => sum + section.current, 0);
    const totalProtein = sections.reduce(
        (sum, section) =>
            sum + section.meals.reduce((mealSum, meal) => mealSum + meal.protein, 0),
        0
    );
    const totalFat = sections.reduce(
        (sum, section) =>
            sum + section.meals.reduce((mealSum, meal) => mealSum + meal.fat, 0),
        0
    );
    const totalCarbs = sections.reduce(
        (sum, section) =>
            sum + section.meals.reduce((mealSum, meal) => mealSum + meal.carbs, 0),
        0
    );

    const totalRemaining = Math.max(calorieSummary.goal - totalConsumed, 0);

    const calorieProgress =
        calorieSummary.goal > 0 ? totalConsumed / calorieSummary.goal : 0;
    const proteinProgress =
        calorieSummary.macros.protein.goal > 0
            ? totalProtein / calorieSummary.macros.protein.goal
            : 0;
    const fatProgress =
        calorieSummary.macros.fat.goal > 0
            ? totalFat / calorieSummary.macros.fat.goal
            : 0;
    const carbsProgress =
        calorieSummary.macros.carbs.goal > 0
            ? totalCarbs / calorieSummary.macros.carbs.goal
            : 0;

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

                        <Text style={styles.pageSectionTitle}>
                            Today’s calorie intake report
                        </Text>

                        <CalorySummaryCard
                            calorieGoal={calorieSummary.goal}
                            totalConsumed={totalConsumed}
                            totalRemaining={totalRemaining}
                            calorieProgress={calorieProgress}
                            totalProtein={totalProtein}
                            proteinGoal={calorieSummary.macros.protein.goal}
                            proteinProgress={proteinProgress}
                            totalFat={totalFat}
                            fatGoal={calorieSummary.macros.fat.goal}
                            fatProgress={fatProgress}
                            totalCarbs={totalCarbs}
                            carbsGoal={calorieSummary.macros.carbs.goal}
                            carbsProgress={carbsProgress}
                        />

                        <TrackerSectionCard
                            icon="water-outline"
                            title="Water Intake"
                            current={waterIntake.toFixed(1)}
                            goal={waterGoal}
                            unit="L"
                            onAddPress={handleAddWater}
                        >
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
                        </TrackerSectionCard>

                        {sections.map((section) => (
                            <TrackerSectionCard
                                key={section.id}
                                icon={section.icon}
                                title={section.title}
                                current={section.current}
                                goal={section.goal}
                                unit="kcal"
                                onAddPress={() =>
                                    router.push({
                                        pathname: "/add-meal",
                                        params: {
                                            section: section.id,
                                        },
                                    })
                                }
                            >
                                {section.meals.length > 0 ? (
                                    <View style={styles.mealsList}>
                                        {section.meals.map((meal) => (
                                            <MealRectangleCard key={meal.id} meal={meal} />
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={styles.emptyMealsText}>
                                        No meals logged yet.
                                    </Text>
                                )}
                            </TrackerSectionCard>
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