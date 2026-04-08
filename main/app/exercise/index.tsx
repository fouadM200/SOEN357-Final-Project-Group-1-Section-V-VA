import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useExercisesByCategory } from "../../hooks/useExercise";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import CustomBottomNavigation from "../../components/CustomBottomNavigation";
import type { ExerciseCategoryParams, TabType } from "@/types/exercise";

export default function ExerciseCategoryScreen() {
    const { category, tab } = useLocalSearchParams<ExerciseCategoryParams>();

    const router = useRouter();

    const effectiveCategory = category || "Chest";
    const initialTab: TabType = tab === "Exercise Type" ? "Exercise Type" : "Muscles";

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
    }, [activeTab, exercises, exerciseTypes, searchQuery]);

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
                        <View style={styles.searchRow}>
                            <Ionicons name="search" size={20} color="#222" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder={`Search ${activeTab === "Muscles" ? "exercise" : "type"}`}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#999"
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
                                    activeTab === "Exercise Type" && styles.activeTabButton,
                                ]}
                                onPress={() => setActiveTab("Exercise Type")}
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
                                data={filteredItems}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.exerciseCard}
                                        onPress={() => handlePressExercise(item)}
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
                                {filteredItems.map((item) => (
                                    <TouchableOpacity key={item} style={styles.exerciseTypeCard}>
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
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E5E5E5",
        borderRadius: 999,
        paddingHorizontal: 14,
        height: 44,
        marginBottom: 18,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#111",
    },
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 12,
    },
    tabButton: {
        flex: 1,
        height: 42,
        borderRadius: 22,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
    },
    activeTabButton: {
        backgroundColor: "#2EA7F2",
    },
    tabText: {
        color: "#fff",
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
        backgroundColor: "#D9D9D9",
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
    },
    exerciseImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        marginRight: 14,
    },
    exerciseName: {
        flex: 1,
        fontSize: 18,
        fontWeight: "800",
        color: "#111",
    },
    exerciseTypeScroll: {
        paddingBottom: 120,
    },
    exerciseTypeCard: {
        backgroundColor: "#2EA7F2",
        borderRadius: 20,
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
        fontWeight: "bold",
    },
});