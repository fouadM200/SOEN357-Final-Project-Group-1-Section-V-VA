import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { mealImages } from "../data/mealImages";
import type { MealCardProps } from "@/types/calorieTracker";

export default function MealRectangleCard({ meal }: MealCardProps) {
    return (
        <View style={styles.mealCard}>
            {mealImages[meal.imageKey] ? (
                <Image source={mealImages[meal.imageKey]} style={styles.mealImage} />
            ) : (
                <View style={styles.noImagePlaceholder}>
                    <Text style={styles.noImageText}>No image</Text>
                </View>
            )}

            <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>

                <View style={styles.mealInnerDivider} />

                <View style={styles.mealMacroRow}>
                    <Text style={styles.mealMacroText}>Protein: {meal.protein}g</Text>
                    <Text style={styles.mealMacroText}>Fat: {meal.fat}g</Text>
                    <Text style={styles.mealMacroText}>Carbs: {meal.carbs}g</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mealCard: {
        backgroundColor: "#E9E9E9",
        borderRadius: 12,
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
    noImagePlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D0D0D0",
    },
    noImageText: {
        fontSize: 8,
        fontWeight: "700",
        color: "#7A7A7A",
        textAlign: "center",
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        fontSize: 14,
        fontWeight: "800",
        color: "#111",
    },
    mealCalories: {
        fontSize: 15,
        fontWeight: "900",
        color: "#1EA7FF",
        marginTop: 2,
    },
    mealInnerDivider: {
        height: 1.5,
        backgroundColor: "#C3C3C3",
        marginVertical: 8,
    },
    mealMacroRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    mealMacroText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#333",
    },
});