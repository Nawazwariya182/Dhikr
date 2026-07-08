import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { FONTS } from '../utils/constants';
import { parseScannedQR } from '../utils/qrHelper';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (id: string, type: 'circle' | 'khatm') => void;
  expectedType?: 'circle' | 'khatm';
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  visible,
  onClose,
  onScanSuccess,
  expectedType,
}) => {
  const { colors } = useAppPreferences();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible && (!permission || !permission.granted)) {
      requestPermission();
    }
  }, [visible, permission]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!data) return;
    const result = parseScannedQR(data, expectedType);
    if (result.type !== 'invalid' && result.id) {
      onScanSuccess(result.id, result.type);
    }
  };

  const renderContent = () => {
    if (!permission) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={[styles.center, { backgroundColor: colors.background, padding: 24 }]}>
          <Ionicons name="camera-outline" size={64} color={colors.textMuted} style={{ marginBottom: 16 }} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>Camera Access Required</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            We need camera access to scan QR codes for community circles and Khatm rooms.
          </Text>
          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </Pressable>
          <Pressable
            style={[styles.closeButton, { borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        
        {/* Transparent Scan Overlay */}
        <View style={styles.overlay}>
          <View style={styles.topMask} />
          <View style={styles.middleRow}>
            <View style={styles.sideMask} />
            <View style={[styles.scanWindow, { borderColor: colors.primary }]}>
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
            </View>
            <View style={styles.sideMask} />
          </View>
          <View style={styles.bottomMask}>
            <Text style={styles.instructions}>Align QR Code inside the box</Text>
            <Pressable
              style={[styles.closeFab, { backgroundColor: colors.surface }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      {renderContent()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.english,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.english,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.english,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.english,
  },
  overlay: {
    flex: 1,
  },
  topMask: {
    flex: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 250,
  },
  sideMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanWindow: {
    width: 250,
    height: 250,
    borderWidth: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  bottomMask: {
    flex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    paddingTop: 20,
  },
  instructions: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: FONTS.english,
    marginBottom: 40,
    textAlign: 'center',
  },
  closeFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
});
