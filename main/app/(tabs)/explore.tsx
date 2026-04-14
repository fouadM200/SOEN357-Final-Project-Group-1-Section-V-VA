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

type ExploreTab = "Muscles" | "Exercise Type";

export default function ExerciseScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ExploreTab>("Muscles");

    const muscles = ["Legs", "Chest", "Back", "Arms", "Shoulders", "Abs"];
    const exerciseTypes = [
        "Machine",
        "Cables",
        "Free Weights",
        "Smith Machine",
        "Functional Exercises",
        "Cardio",
    ];

    const categories = useMemo(() => {
        return activeTab === "Muscles" ? muscles : exerciseTypes;
    }, [activeTab]);

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
                        {categories.map((category) => (
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
        backgroundColor: "#2EA7F2",
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    headerLogo: {
        width: 112,
        height: 112,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
        backgroundColor: "#F5F5F5",
    },
    tabContainer: {
        flexDirection: "row",
        marginTop: 12,
        marginBottom: 14,
        gap: 8,
    },
    tabButton: {
        flex: 1,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#CFCFCF",
        alignItems: "center",
        justifyContent: "center",
    },
    activeTabButton: {
        backgroundColor: "#2EA7F2",
    },
    tabText: {
        color: "#666666",
        fontWeight: "700",
        fontSize: 13,
    },
    activeTabText: {
        color: "#FFFFFF",
    },
    categoryList: {
        paddingBottom: 24,
    },
    categoryButton: {
        backgroundColor: "#2EA7F2",
        minHeight: 70,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    categoryText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
});