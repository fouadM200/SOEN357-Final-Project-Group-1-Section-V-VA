import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useExercisesByCategory } from "../../hooks/useExercise";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import CustomBottomNavigation from "../../components/CustomBottomNavigation";
import SearchBar from "../../components/SearchBar";
import type { ExerciseCategoryParams, TabType } from "@/types/exercise";

export default function ExerciseCategoryScreen() {
    const { category, tab } = useLocalSearchParams<ExerciseCategoryParams>();
    const router = useRouter();

    const effectiveCategory = category || "Chest";
    const initialTab: TabType =
        tab === "Exercise Type" ? "Exercise Type" : "Muscles";

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    const exercises = useExercisesByCategory(effectiveCategory);

    const exerciseTypes = [
        "Machine",
        "Dumbbell",
        "Barbell",
        "Cable",
        "Bodyweight",
        "Smith Machine",
    ];

    const filteredExercises = useMemo(() => {
        const trimmedQuery = searchQuery.trim().toLowerCase();

        if (!trimmedQuery) {
            return exercises;
        }

        return exercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(trimmedQuery)
        );
    }, [exercises, searchQuery]);

    const filteredExerciseTypes = useMemo(() => {
        const trimmedQuery = searchQuery.trim().toLowerCase();

        if (!trimmedQuery) {
            return exerciseTypes;
        }

        return exerciseTypes.filter((type) =>
            type.toLowerCase().includes(trimmedQuery)
        );
    }, [exerciseTypes, searchQuery]);

    const handlePressExercise = (exerciseId: string) => {
        router.push({
            pathname: "/exercise/[id]",
            params: { id: exerciseId },
        });
    };

    const handlePressType = (type: string) => {
        router.push({
            pathname: "/exercise",
            params: {
                category: type,
                tab: "Exercise Type",
            },
        });
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.container}>
                    <PageHeaderBanner
                        title="Exercise"
                        logo={
                            <Image
                                source={require("../../assets/images/fitfuel-logo.png")}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                        }
                    />

                    <View style={styles.content}>
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder={`Search ${activeTab === "Muscles" ? "exercise" : "type"}`}
                        />

                        <View style={styles.tabRow}>
                            <TouchableOpacity
                                style={[
                                    styles.tabButton,
                                    activeTab === "Muscles" && styles.activeTabButton,
                                ]}
                                onPress={() => setActiveTab("Muscles")}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "Muscles" && styles.activeTabText,
                                    ]}
                                >
                                    Muscles
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tabButton,
                                    activeTab === "Exercise Type" && styles.activeTabButton,
                                ]}
                                onPress={() => setActiveTab("Exercise Type")}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "Exercise Type" && styles.activeTabText,
                                    ]}
                                >
                                    Exercise Type
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {activeTab === "Muscles" ? (
                            <FlatList
                                data={filteredExercises}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.exerciseCard}
                                        onPress={() => handlePressExercise(item.id)}
                                        activeOpacity={0.85}
                                    >
                                        <Image source={item.image} style={styles.exerciseImage} />
                                        <Text style={styles.exerciseName}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.exerciseTypeScroll}
                            >
                                {filteredExerciseTypes.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.exerciseTypeCard}
                                        onPress={() => handlePressType(item)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={styles.exerciseTypeText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
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
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        marginBottom: 20,
        gap: 12,
    },
    tabButton: {
        flex: 1,
        height: 42,
        borderRadius: 22,
        backgroundColor: "#E5E5E5",
        justifyContent: "center",
        alignItems: "center",
    },
    activeTabButton: {
        backgroundColor: "#2EA7F2",
    },
    tabText: {
        color: "#666",
        fontSize: 15,
        fontWeight: "700",
    },
    activeTabText: {
        color: "#fff",
    },
    listContent: {
        paddingBottom: 120,
    },
    exerciseCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2EA7F2",
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    exerciseImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        marginRight: 14,
        backgroundColor: "#fff",
    },
    exerciseName: {
        flex: 1,
        fontSize: 18,
        fontWeight: "800",
        color: "#fff",
    },
    exerciseTypeScroll: {
        paddingBottom: 120,
    },
    exerciseTypeCard: {
        backgroundColor: "#2EA7F2",
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    exerciseTypeText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});