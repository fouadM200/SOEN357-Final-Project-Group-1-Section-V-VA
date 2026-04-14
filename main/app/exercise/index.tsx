import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchBar from "../../components/SearchBar";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import exercisesData from "../../data/exercises.json";

type ExerciseItem = {
    id: string;
    category: string;
    name: string;
    startingPosition: string;
    execution: string;
    equipment: string;
    mainMuscles: string[];
    secondaryMuscles: string[];
    imageName: string;
};

const exerciseImages: Record<string, any> = {
    Barbell_bench_press: require("../../assets/images/exercises/Chest/Barbell_bench_press.png"),
    Pec_dec_fly: require("../../assets/images/exercises/Chest/Pec_dec_fly.png"),
    Cable_crossover: require("../../assets/images/exercises/Chest/Cable_crossover.png"),
    "Push-ups": require("../../assets/images/exercises/Chest/Push-ups.png"),
    Incline_barbell_bench_press: require("../../assets/images/exercises/Chest/Incline_barbell_bench_press.png"),
    Incline_dumbell_bench_press: require("../../assets/images/exercises/Chest/Incline_dumbell_bench_press.png"),
    Dumbbell_bench_press: require("../../assets/images/exercises/Chest/Dumbbell_bench_press.png"),
    Dumbbell_fly: require("../../assets/images/exercises/Chest/Dumbbell_fly.png"),
    Incline_dumbbell_fly: require("../../assets/images/exercises/Chest/Incline_dumbbell_fly.png"),
    Chest_press_machine: require("../../assets/images/exercises/Chest/Chest_press_machine.png"),
    Barbell_declined_bench_press: require("../../assets/images/exercises/Chest/Barbell_declined_bench_press.png"),
    Dumbbell_declined_bench_press: require("../../assets/images/exercises/Chest/Dumbbell_declined_bench_press.png"),
};

function getExerciseType(exercise: ExerciseItem): string {
    const equipment = exercise.equipment.toLowerCase();
    const name = exercise.name.toLowerCase();

    if (equipment.includes("smith")) return "Smith Machine";
    if (equipment.includes("cable")) return "Cables";
    if (equipment.includes("machine")) return "Machine";
    if (equipment.includes("dumbbell") || equipment.includes("barbell")) return "Free Weights";
    if (equipment === "none" || name.includes("push up") || name.includes("push-up")) {
        return "Functional Exercises";
    }

    return "Cardio";
}

export default function ExerciseCategoryPage() {
    const { category, tab } = useLocalSearchParams<{
        category?: string;
        tab?: string;
    }>();

    const [searchQuery, setSearchQuery] = useState("");

    const selectedCategory = category ?? "Exercises";
    const selectedTab = tab ?? "Muscles";
    const exercises = exercisesData as ExerciseItem[];

    const filteredExercises = useMemo(() => {
        const trimmedQuery = searchQuery.trim().toLowerCase();

        return exercises.filter((exercise) => {
            const matchesCategory =
                selectedTab === "Muscles"
                    ? exercise.category.toLowerCase() === selectedCategory.toLowerCase()
                    : getExerciseType(exercise).toLowerCase() === selectedCategory.toLowerCase();

            const matchesSearch =
                !trimmedQuery || exercise.name.toLowerCase().includes(trimmedQuery);

            return matchesCategory && matchesSearch;
        });
    }, [exercises, searchQuery, selectedCategory, selectedTab]);

    const handlePressExercise = (exerciseId: string) => {
        router.push({
            pathname: "/exercise/[id]",
            params: { id: exerciseId },
        });
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <PageHeaderBanner
                    title={selectedCategory}
                    logo={
                        <Image
                            source={require("../../assets/images/fitfuel-logo.png")}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                    }
                    leftAccessory={
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.8}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                    }
                />

                <View style={styles.content}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search for an exercise"
                    />

                    <Text style={styles.sectionLabel}>{selectedCategory}:</Text>

                    <ScrollView
                        contentContainerStyle={styles.exerciseList}
                        showsVerticalScrollIndicator={false}
                    >
                        {filteredExercises.map((exercise) => (
                            <TouchableOpacity
                                key={exercise.id}
                                style={styles.exerciseRow}
                                onPress={() => handlePressExercise(exercise.id)}
                                activeOpacity={0.85}
                            >
                                <View style={styles.imageWrapper}>
                                    <Image
                                        source={exerciseImages[exercise.imageName]}
                                        style={styles.exerciseImage}
                                        resizeMode="contain"
                                    />
                                </View>

                                <View style={styles.nameBox}>
                                    <Text style={styles.exerciseName} numberOfLines={2}>
                                        {exercise.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {filteredExercises.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No exercises found.</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
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
    backButton: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    headerLogo: {
        width: 112,
        height: 112,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
        backgroundColor: "#F5F5F5",
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#222222",
        marginTop: 10,
        marginBottom: 10,
    },
    exerciseList: {
        paddingBottom: 22,
    },
    exerciseRow: {
        flexDirection: "row",
        alignItems: "stretch",
        marginBottom: 12,
    },
    imageWrapper: {
        width: 86,
        height: 86,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#A9D7F7",
        marginRight: 0,
    },
    exerciseImage: {
        width: 82,
        height: 82,
    },
    nameBox: {
        flex: 1,
        backgroundColor: "#2EA7F2",
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: "center",
        paddingHorizontal: 16,
        marginLeft: 0,
    },
    exerciseName: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 20,
    },
    emptyState: {
        paddingVertical: 30,
        alignItems: "center",
    },
    emptyText: {
        color: "#777777",
        fontSize: 15,
        fontWeight: "600",
    },
});