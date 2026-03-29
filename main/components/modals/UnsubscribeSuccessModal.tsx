import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

interface UnsubscribeSuccessModalProps {
  visible: boolean;
  coachName: string | undefined;
  onGoBack: () => void;
}

export const UnsubscribeSuccessModal: React.FC<UnsubscribeSuccessModalProps> = ({
  visible,
  coachName,
  onGoBack,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successCard}>
          <View style={styles.checkIconContainer}>
            <Ionicons name="checkmark-circle-outline" size={100} color="#1DA1F2" />
          </View>
          <Text style={styles.successTitle}>
            Unsubscription from <Text style={styles.boldText}>{coachName}</Text>’s online coaching program done successfully!
          </Text>
          <TouchableOpacity
            style={styles.goBackSubsButton}
            onPress={onGoBack}
          >
            <Text style={styles.goBackSubsButtonText}>Go Back to Subscriptions page</Text>
          </TouchableOpacity>
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
  successCard: {
    width: "85%",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 25,
  },
  boldText: {
    fontWeight: "800",
  },
  goBackSubsButton: {
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  goBackSubsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
