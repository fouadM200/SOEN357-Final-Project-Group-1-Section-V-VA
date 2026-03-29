import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useExercise } from '../../hooks/useExercise';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const exercise = useExercise(id);
    const router = useRouter();

    if (!exercise) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Exercise not found</Text>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.sectionText}>We couldn't find the exercise you're looking for (ID: {id}).</Text>
                    </View>
                </SafeAreaView>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>

            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={exercise.image} style={styles.image} resizeMode="contain" />
                </View>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{exercise.category}</Text>
                    </View>
                </View>
                <View style={styles.headerDivider} />

                <View style={styles.content}>
                    <Text style={styles.exerciseGuideTitle}>Exercise execution guide</Text>
                    
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Starting position</Text>
                        <Text style={styles.sectionText}>{exercise.startingPosition}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Execution</Text>
                        <Text style={styles.sectionText}>{exercise.execution}</Text>
                    </View>

                    {exercise.equipment && (
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>Equipment required</Text>
                            <Text style={styles.sectionText}>{exercise.equipment}</Text>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Main muscles</Text>
                        <Text style={styles.sectionText}>{exercise.mainMuscles.join(', ')}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Secondary muscles</Text>
                        <Text style={styles.sectionText}>{exercise.secondaryMuscles.join(', ')}</Text>
                    </View>
                </View>
            </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 5,
        marginRight: 5,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        paddingTop: 16,
        paddingBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 20,
        flex: 1,
    },
    headerDivider: {
        height: 3,
        backgroundColor: '#1EA7FF',
        marginHorizontal: 15,
        marginBottom: 10,
    },
    categoryBadge: {
        backgroundColor: '#1EA7FF',
        paddingHorizontal: 15,
        paddingVertical: 6,
        paddingLeft: 26,
        paddingRight: 26,
        borderRadius: 20,
        marginRight: 30,
    },
    categoryBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#fff',
        borderBottomWidth: 1.5,
        borderBottomColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    exerciseGuideTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 20,
        color: '#000',
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 15,
        color: '#777',
        lineHeight: 22,
    },
});
