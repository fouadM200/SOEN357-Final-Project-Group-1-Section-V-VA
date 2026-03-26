import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FitFuelLogo from "../../components/FitFuelLogo";

export default function HomePage() {
    const [firstName, setFirstName] = useState("User");

    useEffect(() => {
        const loadFirstName = async () => {
            const savedFirstName = await AsyncStorage.getItem("firstName");
            if (savedFirstName) {
                setFirstName(savedFirstName);
            }
        };

        loadFirstName();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.hello}>Hello, {firstName}!</Text>
                    <Text style={styles.subtext}>Hope you're doing well today!</Text>
                </View>

                <FitFuelLogo width={150} height={150} />
            </View>

            <View style={styles.content}>
                <Text>Home content goes here</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#1EA7FF",
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    hello: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
    subtext: {
        color: "#fff",
        fontSize: 12,
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
});