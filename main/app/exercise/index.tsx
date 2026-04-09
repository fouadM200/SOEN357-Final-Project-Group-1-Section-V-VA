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

    const filteredItems = useMemo(() => {
        if (activeTab === "Muscles") {
            return exercises.filter((exercise) =>
                exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return exerciseTypes.filter((type) =>
            type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeTab, exercises, searchQuery]);

    const handlePressExercise = (item: any) => {
        if (activeTab === "Muscles") {
            router.push({
                pathname: "/exercise/[id]",
                params: { id: item.id },
            });
        }
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
                        <View style={styles.searchContainer}>
                            <SearchBar
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder={
                                    activeTab === "Muscles"
                                        ? "Search exercise"
                                        : "Search type"
                                }
                            />
                        </View>

                        <View style={styles.tabRow}>
                            <TouchableOpacity
                                style={[
                                    styles.tabButton,
                                    activeTab === "Muscles" && styles.activeTabButton,
                                ]}
                                onPress={() => setActiveTab("Muscles")}
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
                                    activeTab === "Exercise Type" &&
                                    styles.activeTabButton,
                                ]}
                                onPress={() => setActiveTab("Exercise Type")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "Exercise Type" &&
                                        styles.activeTabText,
                                    ]}
                                >
                                    Exercise Type
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {activeTab === "Muscles" ? (
                            <FlatList
                                data={filteredItems}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.exerciseCard}
                                        onPress={() => handlePressExercise(item)}
                                    >
                                        <Image
                                            source={item.image}
                                            style={styles.exerciseImage}
                                        />
                                        <Text style={styles.exerciseName}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.exerciseTypeScroll}
                            >
                                {filteredItems.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.exerciseTypeCard}
                                    >
                                        <Text style={styles.exerciseTypeText}>
                                            {item}
                                        </Text>
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
    searchContainer: {
        marginBottom: 18,
    },
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 10,
    },
    tabButton: {
        flex: 1,
        height: 42,
        borderRadius: 20,
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
        fontWeight: "600",
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
        borderRadius: 10,
        minHeight: 72,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    exerciseImage: {
        width: 54,
        height: 54,
        borderRadius: 8,
        marginRight: 14,
        backgroundColor: "#fff",
    },
    exerciseName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "800",
        color: "#fff",
    },
    exerciseTypeScroll: {
        paddingBottom: 120,
    },
    exerciseTypeCard: {
        backgroundColor: "#2EA7F2",
        borderRadius: 10,
        minHeight: 72,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 10,
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
        fontWeight: "bold",
    },
});