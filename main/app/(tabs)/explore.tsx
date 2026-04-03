import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PageHeaderBanner from "../../components/PageHeaderBanner";

export default function ExerciseScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"Muscles" | "Exercise Type">(
        "Muscles"
    );
    const [searchQuery, setSearchQuery] = useState("");

    const muscles = ["Legs", "Chest", "Back", "Arms", "Shoulders", "Abs"];
    const exerciseTypes = [
        "Machine",
        "Cables",
        "Free Weights",
        "Smith Machine",
        "Functional Exercises",
        "Cardio",
    ];

    const categories = activeTab === "Muscles" ? muscles : exerciseTypes;

    const filteredCategories = categories.filter((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <PageHeaderBanner
                    title="Exercises"
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

                    <ScrollView
                        contentContainerStyle={styles.categoryList}
                        showsVerticalScrollIndicator={false}
                    >
                        {filteredCategories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={styles.categoryButton}
                                onPress={() =>
                                    router.push({
                                        pathname: "/exercise",
                                        params: { category: category.toLowerCase() },
                                    })
                                }
                            >
                                <Text style={styles.categoryText}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#1EA7FF",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    activeTabText: {
        color: "#fff",
    },
    categoryList: {
        paddingBottom: 20,
    },
    categoryButton: {
        backgroundColor: "#1EA7FF",
        paddingVertical: 24,
        borderRadius: 10,
        marginBottom: 10,
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
    categoryText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});