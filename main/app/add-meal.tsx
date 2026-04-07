import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeaderBanner from "../components/PageHeaderBanner";
import { mealImages } from "../data/mealImages";
import CustomBottomNavigation from "@/components/CustomBottomNavigation";

type EstimatedMeal = {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    imageKey?: string;
};

const API_BASE_URL = "http://127.0.0.1:5000";

export default function AddMealPage() {
    const params = useLocalSearchParams<{ section?: string }>();
    const section = params.section ?? "meal";

    const [mealName, setMealName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [estimatedMeal, setEstimatedMeal] = useState<EstimatedMeal | null>(null);

    const handleCancel = () => {
        router.back();
    };

    const handleSearch = async () => {
        const trimmedMealName = mealName.trim();

        if (!trimmedMealName) {
            Alert.alert("Missing meal name", "Please enter a meal name.");
            return;
        }

        try {
            setIsLoading(true);
            setEstimatedMeal(null);

            const response = await fetch(`${API_BASE_URL}/api/estimate-meal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mealName: trimmedMealName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to estimate meal.");
            }

            setEstimatedMeal({
                name: data.name,
                calories: Number(data.calories) || 0,
                protein: Number(data.protein) || 0,
                fat: Number(data.fat) || 0,
                carbs: Number(data.carbs) || 0,
                imageKey: data.imageKey || "",
            });
        } catch (error) {
            console.error("handleSearch error:", error);
            Alert.alert("Error", "Could not estimate this meal.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        if (!estimatedMeal) {
            return;
        }

        router.push({
            pathname: "/(tabs)/calorieTracker",
            params: {
                addedSection: section,
                addedMealName: estimatedMeal.name,
                addedCalories: String(estimatedMeal.calories),
                addedProtein: String(estimatedMeal.protein),
                addedFat: String(estimatedMeal.fat),
                addedCarbs: String(estimatedMeal.carbs),
                addedImageKey: estimatedMeal.imageKey || "",
                refresh: String(Date.now()),
            },
        });
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.container}>
                    <PageHeaderBanner
                        title="Calorie Tracker"
                        logo={
                            <Image
                                source={require("../assets/images/fitfuel-logo.png")}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                        }
                    />

                    <View style={styles.content}>
                        <Text style={styles.title}>Add a {section} meal:</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter meal's name"
                            placeholderTextColor="#9A9A9A"
                            value={mealName}
                            onChangeText={setMealName}
                        />

                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleSearch}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.searchButtonText}>Search</Text>
                            )}
                        </TouchableOpacity>

                        {estimatedMeal ? (
                            <>
                                <View style={styles.blueDivider} />

                                <View style={styles.mealCard}>
                                    {estimatedMeal.imageKey && mealImages[estimatedMeal.imageKey] ? (
                                        <Image
                                            source={mealImages[estimatedMeal.imageKey]}
                                            style={styles.mealImage}
                                        />
                                    ) : (
                                        <View style={styles.noImagePlaceholder}>
                                            <Text style={styles.noImageText}>No image</Text>
                                        </View>
                                    )}

                                    <View style={styles.mealContent}>
                                        <Text style={styles.mealName}>{estimatedMeal.name}</Text>
                                        <Text style={styles.mealCalories}>
                                            {estimatedMeal.calories} kcal
                                        </Text>

                                        <View style={styles.mealDivider} />

                                        <View style={styles.mealMacrosRow}>
                                            <Text style={styles.mealMacroText}>
                                                Protein: {estimatedMeal.protein}g
                                            </Text>
                                            <Text style={styles.mealMacroText}>
                                                Fat: {estimatedMeal.fat}g
                                            </Text>
                                            <Text style={styles.mealMacroText}>
                                                Carbs: {estimatedMeal.carbs}g
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                                    <Text style={styles.addButtonText}>Add</Text>
                                </TouchableOpacity>
                            </>
                        ) : null}

                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <CustomBottomNavigation />
            </SafeAreaView>
        </>
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
    content: {
        paddingHorizontal: 28,
        paddingTop: 34,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111",
        marginBottom: 24,
    },
    input: {
        height: 46,
        borderWidth: 1,
        borderColor: "#CFCFCF",
        backgroundColor: "#F8F8F8",
        borderRadius: 2,
        paddingHorizontal: 12,
        fontSize: 14,
        color: "#111",
        marginBottom: 20,
    },
    searchButton: {
        height: 44,
        borderRadius: 22,
        backgroundColor: "#1EA7FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    searchButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "800",
    },
    addButton: {
        height: 44,
        borderRadius: 22,
        backgroundColor: "#1EA7FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "800",
    },
    cancelButton: {
        height: 44,
        borderRadius: 22,
        backgroundColor: "#1E1E1E",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "800",
    },
    blueDivider: {
        height: 3,
        backgroundColor: "#1EA7FF",
        borderRadius: 3,
        marginBottom: 18,
    },
    mealCard: {
        backgroundColor: "#DCDCDC",
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 26,
    },
    mealImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    noImagePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: "#E8E8E8",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CFCFCF",
    },
    noImageText: {
        fontSize: 8,
        fontWeight: "700",
        color: "#7A7A7A",
        textAlign: "center",
    },
    mealContent: {
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
        fontSize: 11,
        fontWeight: "700",
        color: "#333",
    },
});