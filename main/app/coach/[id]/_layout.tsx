import { Stack } from "expo-router";

export default function CoachLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="subscribe" options={{ headerShown: false }} />
    </Stack>
  );
}
