import { Image, StyleSheet, View } from "react-native";

type FitFuelLogoProps = {
    width?: number;
    height?: number;
    opacity?: number;
};


export default function FitFuelLogo({
                                        width = 180,
                                        height = 180,
                                    }: FitFuelLogoProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/fitfuel-logo-blue.png")}
                style={[styles.logo, { width, height }]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {},
});