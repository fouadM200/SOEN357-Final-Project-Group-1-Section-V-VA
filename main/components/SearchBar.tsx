import { StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
};

export default function SearchBar({
                                      value,
                                      onChangeText,
                                      placeholder,
                                  }: Readonly<SearchBarProps>) {
    return (
        <View style={styles.searchWrapper}>
            <Ionicons
                name="search-outline"
                size={18}
                color="#9A9A9A"
                style={styles.searchIcon}
            />

            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#9A9A9A"
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ECECEC",
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#111",
        height: "100%",
    },
});