import Ionicons from "@expo/vector-icons/Ionicons";

export type Meal = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    imageKey: string;
};

export type MealSection = {
    id: string;
    title: string;
    current: number;
    goal: number;
    icon: keyof typeof Ionicons.glyphMap;
    meals: Meal[];
};

export type ProgressRingProps = {
    progress: number;
    size?: number;
    strokeWidth?: number;
};

export type MacroBarProps = {
    label: string;
    current: number;
    goal: number;
    progress: number;
};

export type MealCardProps = {
    meal: Meal;
};

export type MealSectionCardProps = {
    section: MealSection;
    onAddPress: () => void;
};

export type CalorieTrackerParams = {
    addedSection?: string;
    addedMealName?: string;
    addedCalories?: string;
    addedProtein?: string;
    addedFat?: string;
    addedCarbs?: string;
    addedImageKey?: string;
    refresh?: string;
};

export type CalorieIntakeSummaryCardProps = {
    calorieGoal: number;
    totalConsumed: number;
    totalRemaining: number;
    calorieProgress: number;
    totalProtein: number;
    proteinGoal: number;
    proteinProgress: number;
    totalFat: number;
    fatGoal: number;
    fatProgress: number;
    totalCarbs: number;
    carbsGoal: number;
    carbsProgress: number;
};