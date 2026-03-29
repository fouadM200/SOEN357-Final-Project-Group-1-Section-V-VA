import { useMemo } from 'react';
import exercisesData from '../data/exercises.json';
import { ImageSourcePropType } from 'react-native';

const exerciseImages: Record<string, ImageSourcePropType> = {
    "Barbell_bench_press": require("../assets/images/exercises/Chest/Barbell_bench_press.png"),
    "Pec_dec_fly": require("../assets/images/exercises/Chest/Pec_dec_fly.png"),
    "Cable_crossover": require("../assets/images/exercises/Chest/Cable_crossover.png"),
    "Push-ups": require("../assets/images/exercises/Chest/Push-ups.png"),
    "Incline_barbell_bench_press": require("../assets/images/exercises/Chest/Incline_barbell_bench_press.png"),
    "Incline_dumbell_bench_press": require("../assets/images/exercises/Chest/Incline_dumbell_bench_press.png"),
    "Dumbbell_bench_press": require("../assets/images/exercises/Chest/Dumbbell_bench_press.png"),
    "Dumbbell_fly": require("../assets/images/exercises/Chest/Dumbbell_fly.png"),
    "Incline_dumbbell_fly": require("../assets/images/exercises/Chest/Incline_dumbbell_fly.png"),
    "Chest_press_machine": require("../assets/images/exercises/Chest/Chest_press_machine.png"),
    "Barbell_declined_bench_press": require("../assets/images/exercises/Chest/Barbell_declined_bench_press.png"),
    "Dumbbell_declined_bench_press": require("../assets/images/exercises/Chest/Dumbbell_declined_bench_press.png"),
};

export function useExercisesByCategory(category: string | undefined) {
    return useMemo(() => {
        if (!category) return [];
        return exercisesData
            .filter(ex => ex.category.toLowerCase() === category.toLowerCase())
            .map(ex => ({
                ...ex,
                image: exerciseImages[ex.imageName]
            }));
    }, [category]);
}

export function useExercise(id: string) {
    return useMemo(() => {
        const exercise = exercisesData.find(ex => ex.id === id);
        if (!exercise) return null;
        return {
            ...exercise,
            image: exerciseImages[exercise.imageName]
        };
    }, [id]);
}
