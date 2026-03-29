import { Stack } from "expo-router";

export default function CoachDynamicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="subscribe" />
    </Stack>
  );
}
