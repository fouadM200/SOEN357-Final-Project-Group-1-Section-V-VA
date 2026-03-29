import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="intro" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "" }} />
            <Stack.Screen name="exercise/index" options={{ headerShown: false }} />
            <Stack.Screen name="exercise/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="coach" options={{ headerShown: false }} />
            <Stack.Screen name="messages" options={{ headerShown: false }} />
        </Stack>
    );
}