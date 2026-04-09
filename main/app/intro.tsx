import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function IntroPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/login");
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/fitfuel-logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#26A7F7",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    logo: {
        width: 260,
        height: 260,
    },
});