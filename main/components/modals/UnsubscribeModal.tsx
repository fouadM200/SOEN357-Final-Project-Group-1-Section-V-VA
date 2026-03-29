import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

interface UnsubscribeModalProps {
  visible: boolean;
  coachName: string | undefined;
  onCancel: () => void;
  onUnsubscribe: () => void;
}

export const UnsubscribeModal: React.FC<UnsubscribeModalProps> = ({
  visible,
  coachName,
  onCancel,
  onUnsubscribe,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.unsubscribeCard}>
          <Text style={styles.unsubscribeTitle}>
            Are you sure you want to unsubscribe from <Text style={styles.boldText}>{coachName}'s </Text>
            online coach program?
          </Text>
          <View style={styles.modalButtonsRow}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={onCancel}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalUnsubscribeButton}
              onPress={onUnsubscribe}
            >
              <Text style={styles.modalUnsubscribeButtonText}>Unsubscribe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  unsubscribeCard: {
    width: "85%",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  unsubscribeTitle: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 15,
  },
  boldText: {
    fontWeight: "800",
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 15,
  },
  modalCancelButton: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  modalCancelButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalUnsubscribeButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  modalUnsubscribeButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
