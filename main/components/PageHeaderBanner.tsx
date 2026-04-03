import React, { ReactNode } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type HeaderButton = {
    label: string;
    onPress?: () => void;
};

type PageHeaderBannerProps = {
    title: string;
    description?: string;
    buttons?: HeaderButton[];
    logo?: ReactNode;
};

export default function PageHeaderBanner({
                                             title,
                                             description,
                                             buttons = [],
                                             logo,
                                         }: Readonly<PageHeaderBannerProps>) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>

                    {description ? (
                        <Text style={styles.description}>{description}</Text>
                    ) : null}
                </View>

                {logo ? <View style={styles.logoWrapper}>{logo}</View> : null}
            </View>

            {buttons.length > 0 ? (
                <View style={styles.buttonsContainer}>
                    {buttons.map((button, index) => (
                        <TouchableOpacity
                            key={`${button.label}-${index}`}
                            style={styles.button}
                            onPress={button.onPress}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>{button.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#2EA7F2",
        paddingTop: 22,
        paddingBottom: 16,
        paddingHorizontal: 18,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        paddingRight: 12,
        paddingLeft: 10,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 4,
    },
    description: {
        color: "#EAF6FF",
        fontSize: 15,
        fontWeight: "500",
        lineHeight: 17,
    },
    logoWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    buttonsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 12,
    },
    button: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
    },
    buttonText: {
        color: "#2EA7F2",
        fontSize: 13,
        fontWeight: "700",
    },
});