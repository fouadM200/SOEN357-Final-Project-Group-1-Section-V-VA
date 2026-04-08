import React from "react";
import { Image, StyleSheet, View } from "react-native";
import type { FitFuelLogoProps } from "@/types/fitFuelLogoBlue";

export default function FitFuelLogoBlue({
                                            width = 100,
                                            height = 100,
                                            opacity = 1,
                                        }: Readonly<FitFuelLogoProps>) {
    return (
        <View style={[styles.container, { opacity }]}>
            <Image
                source={require("../assets/images/fitfuel-logo-blue.png")}
                style={{ width, height, resizeMode: "contain" }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
});