export type EstimatedMeal = {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    imageKey?: string;
};

export type AddMealParams = {
    section?: string;
};