import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { PageHeaderBannerProps } from "@/types/pageHeaderBanner";

export default function PageHeaderBanner({
                                             title,
                                             description,
                                             buttons = [],
                                             logo,
                                             leftAccessory,
                                         }: Readonly<PageHeaderBannerProps>) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                {leftAccessory ? (
                    <View style={styles.leftAccessoryWrapper}>{leftAccessory}</View>
                ) : null}

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>

                    {description ? (
                        <Text style={styles.description}>{description}</Text>
                    ) : null}

                    {buttons.length > 0 ? (
                        <View style={styles.buttonsContainer}>
                            {buttons.map((button, index) => (
                                <TouchableOpacity
                                    key={`${button.label}-${index}`}
                                    style={[
                                        styles.button,
                                        button.active && styles.activeButton,
                                    ]}
                                    onPress={button.onPress}
                                    activeOpacity={0.8}
                                >
                                    {button.iconName ? (
                                        <Ionicons
                                            name={button.iconName}
                                            size={16}
                                            color="#2EA7F2"
                                            style={styles.buttonIcon}
                                        />
                                    ) : null}

                                    <Text
                                        style={[
                                            styles.buttonText,
                                            button.active && styles.activeButtonText,
                                        ]}
                                    >
                                        {button.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : null}
                </View>

                {logo ? <View style={styles.logoWrapper}>{logo}</View> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#2EA7F2",
        height: 130,
        paddingHorizontal: 18,
        justifyContent: "center",
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        height: 110,
    },
    leftAccessoryWrapper: {
        width: 36,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        paddingRight: 12,
        paddingLeft: 10,
        justifyContent: "center",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 4,
    },
    description: {
        color: "#EAF6FF",
        fontSize: 15,
        fontWeight: "500",
        lineHeight: 17,
        marginBottom: 10,
    },
    logoWrapper: {
        width: 96,
        height: 96,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
    },
    buttonsContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: 10,
        marginTop: 6,
    },
    button: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    },
    activeButton: {
        backgroundColor: "#FFFFFF",
    },
    buttonIcon: {
        marginRight: 6,
    },
    buttonText: {
        color: "#2EA7F2",
        fontSize: 13,
        fontWeight: "700",
    },
    activeButtonText: {
        color: "#2EA7F2",
    },
});