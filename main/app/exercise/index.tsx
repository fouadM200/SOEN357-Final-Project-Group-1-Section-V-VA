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

type TabType = "Muscles" | "Exercise Type";

export default function ExerciseCategoryScreen() {
    const { category, tab } = useLocalSearchParams<{
        category?: string;
        tab?: string;
    }>();

    const router = useRouter();

    const effectiveCategory = category || "Chest";
    const initialTab: TabType = tab === "Exercise Type" ? "Exercise Type" : "Muscles";

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    const exercises = useExercisesByCategory(effectiveCategory);

    const exerciseTypes = [
        "Machine",
        "Cables",
        "Free Weights",
        "Smith Machine",
        "Functional Exercises",
        "Cardio",
    ];

    const filteredExercises = useMemo(() => {
        return exercises.filter((ex) =>
            ex.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [exercises, searchQuery]);

    const filteredExerciseTypes = useMemo(() => {
        return exerciseTypes.filter((type) =>
            type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.container}>
                    <PageHeaderBanner
                        title="Exercises"
                        leftAccessory={
                            <TouchableOpacity
                                onPress={() => router.back()}
                                activeOpacity={0.8}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={28} color="#fff" />
                            </TouchableOpacity>
                        }
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
                            <Ionicons
                                name="search"
                                size={20}
                                color="#999"
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for an exercise"
                                placeholderTextColor="#999"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tabButton,
                                    activeTab === "Muscles" && styles.activeTabButton,
                                ]}
                                onPress={() => setActiveTab("Muscles")}
                            >
                                <Text style={styles.tabText}>Muscles</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tabButton,
                                    activeTab === "Exercise Type" && styles.activeTabButton,
                                ]}
                                onPress={() => setActiveTab("Exercise Type")}
                            >
                                <Text style={styles.tabText}>Exercise Type</Text>
                            </TouchableOpacity>
                        </View>

                        {activeTab === "Muscles" ? (
                            <>
                                <Text style={styles.categoryLabel}>
                                    {effectiveCategory.toLowerCase()}:
                                </Text>

                                <FlatList
                                    data={filteredExercises}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.card}
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/exercise/[id]",
                                                    params: { id: item.id },
                                                })
                                            }
                                        >
                                            <View style={styles.imageContainer}>
                                                <Image
                                                    source={item.image}
                                                    style={styles.image}
                                                    resizeMode="contain"
                                                />
                                            </View>

                                            <View style={styles.cardContent}>
                                                <Text style={styles.name}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={styles.list}
                                    showsVerticalScrollIndicator={false}
                                />
                            </>
                        ) : (
                            <ScrollView
                                contentContainerStyle={styles.exerciseTypeList}
                                showsVerticalScrollIndicator={false}
                            >
                                {filteredExerciseTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={styles.exerciseTypeButton}
                                        activeOpacity={0.85}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/exercise",
                                                params: {
                                                    category: type,
                                                    tab: "Exercise Type",
                                                },
                                            })
                                        }
                                    >
                                        <Text style={styles.exerciseTypeText}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>
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
        backgroundColor: "#fff",
    },
    backButton: {
        padding: 2,
    },
    headerLogo: {
        width: 120,
        height: 120,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#fff",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 20,
        gap: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#A0AEC0",
        alignItems: "center",
    },
    activeTabButton: {
        backgroundColor: "#1EA7FF",
    },
    tabText: {
        color: "#fff",
        fontWeight: "600",
    },
    categoryLabel: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textTransform: "lowercase",
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#1EA7FF",
        borderRadius: 12,
        marginBottom: 15,
        overflow: "hidden",
        height: 100,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#1EA7FF",
    },
    imageContainer: {
        width: 100,
        height: "100%",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: "center",
    },
    name: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    exerciseTypeList: {
        paddingBottom: 20,
    },
    exerciseTypeButton: {
        backgroundColor: "#1EA7FF",
        paddingVertical: 24,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
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