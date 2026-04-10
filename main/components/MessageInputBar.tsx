import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type MessageInputBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onPressAdd?: () => void;
};

export default function MessageInputBar({
                                            value,
                                            onChangeText,
                                            onSend,
                                            onPressAdd,
                                        }: Readonly<MessageInputBarProps>) {
    return (
        <View style={styles.inputBar}>
            <TouchableOpacity style={styles.iconButton} onPress={onPressAdd}>
                <Ionicons name="add" size={22} color="#999" />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message here..."
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="default"
                    autoCapitalize="sentences"
                    autoCorrect
                    multiline={false}
                    smartInsertDelete={false}
                    textAlignVertical="center"
                />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                <Ionicons name="send" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#E5E5E5",
        backgroundColor: "#fff",
        gap: 12,
    },
    iconButton: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    inputWrapper: {
        flex: 1,
        minHeight: 44,
        backgroundColor: "#F1F1F1",
        borderRadius: 22,
        justifyContent: "center",
    },
    input: {
        fontSize: 14,
        color: "#111",
        paddingHorizontal: 14,
        paddingVertical: 0,
        height: 44,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1DA1F2",
        alignItems: "center",
        justifyContent: "center",
    },
});