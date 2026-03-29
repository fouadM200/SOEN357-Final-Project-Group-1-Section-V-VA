import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useExercisesByCategory } from '../../hooks/useExercise';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FitFuelLogo from "../../components/FitFuelLogo";

export default function ExerciseCategoryScreen() {
    const { category } = useLocalSearchParams<{ category?: string }>();
    const effectiveCategory = category || "Chest";
    const exercises = useExercisesByCategory(effectiveCategory);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"Muscles" | "Exercise Type">("Muscles");

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Exercises</Text>
                    <FitFuelLogo width={150} height={150} />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
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

                <Text style={styles.categoryLabel}>{effectiveCategory}:</Text>

                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.card}
                            onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: item.id } })}
                        >
                            <View style={styles.imageContainer}>
                                <Image source={item.image} style={styles.image} resizeMode="contain" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.name}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: "#1EA7FF",
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
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
        fontWeight: 'bold',
        marginBottom: 15,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#1EA7FF',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        height: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1EA7FF',
    },
    imageContainer: {
        width: 100,
        height: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
