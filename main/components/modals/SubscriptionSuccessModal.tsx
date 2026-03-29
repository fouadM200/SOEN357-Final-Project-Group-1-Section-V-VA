import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

interface SubscriptionSuccessModalProps {
  visible: boolean;
  coachName: string | undefined;
  onGoBack: () => void;
}

export const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({
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
        <View style={styles.confirmationCard}>
          <View style={styles.checkIconContainer}>
            <Ionicons name="checkmark-circle-outline" size={100} color="#1DA1F2" />
          </View>
          <Text style={styles.confirmationTitle}>Payment Successful!</Text>
          <Text style={styles.confirmationSubTitle}>
            You’re now subscribed to the online coaching program of:
          </Text>
          <Text style={styles.coachNameText}>{coachName}</Text>
          
          <Text style={styles.transactionId}>
            Transaction ID: 123000048237684370
          </Text>

          <TouchableOpacity 
            style={styles.goBackButton}
            onPress={onGoBack}
          >
            <Text style={styles.goBackButtonText}>Go Back to Online Coaching</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationCard: {
    width: "80%",
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  checkIconContainer: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#000",
  },
  confirmationSubTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginBottom: 4,
  },
  coachNameText: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#000",
    marginBottom: 25,
  },
  transactionId: {
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
    marginBottom: 30,
  },
  goBackButton: {
    backgroundColor: "#222",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  goBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
