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
import { useRouter } from "expo-router";
import PageHeaderBanner from "../../components/PageHeaderBanner";
import SearchBar from "../../components/SearchBar";

type ExploreTab = "Muscles" | "Exercise Type";

export default function ExerciseScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ExploreTab>("Muscles");
    const [searchQuery, setSearchQuery] = useState("");

    const muscles = ["Legs", "Chest", "Back", "Arms", "Shoulders", "Abs"];
    const exerciseTypes = [
        "Machine",
        "Dumbbell",
        "Barbell",
        "Cable",
        "Bodyweight",
        "Smith Machine",
    ];

    const categories = useMemo(() => {
        return activeTab === "Muscles" ? muscles : exerciseTypes;
    }, [activeTab]);

    const filteredCategories = useMemo(() => {
        const trimmedQuery = searchQuery.trim().toLowerCase();

        if (!trimmedQuery) {
            return categories;
        }

        return categories.filter((category) =>
            category.toLowerCase().includes(trimmedQuery)
        );
    }, [categories, searchQuery]);

    const handlePressCategory = (category: string) => {
        router.push({
            pathname: "/exercise",
            params: {
                category,
                tab: activeTab,
            },
        });
    };

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
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={`Search for an ${activeTab === "Muscles" ? "exercise" : "exercise type"}`}
                    />

                    <View style={styles.tabContainer}>
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

                    <ScrollView
                        contentContainerStyle={styles.categoryList}
                        showsVerticalScrollIndicator={false}
                    >
                        {filteredCategories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={styles.categoryButton}
                                onPress={() => handlePressCategory(category)}
                                activeOpacity={0.85}
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
        backgroundColor: "#F5F5F5",
    },
    headerLogo: {
        width: 120,
        height: 120,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#F5F5F5",
    },
    tabContainer: {
        flexDirection: "row",
        marginTop: 14,
        marginBottom: 18,
        gap: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#E5E5E5",
        alignItems: "center",
    },
    activeTabButton: {
        backgroundColor: "#1EA7FF",
    },
    tabText: {
        color: "#666",
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
        borderRadius: 14,
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
        fontWeight: "700",
    },
});