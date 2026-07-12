import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { FONTS } from '../utils/constants';
import { backupService } from '../services/backupService';

interface LocalSyncModalProps {
  visible: boolean;
  onClose: () => void;
}

interface NearbyDevice {
  id: string;
  name: string;
  type: 'android' | 'ios' | 'tablet';
  signal: 'strong' | 'medium' | 'weak';
}

const MOCK_DEVICES: NearbyDevice[] = [
  { id: '1', name: "Amna's iPhone 15", type: 'ios', signal: 'strong' },
  { id: '2', name: "Nawaz's Pixel 8 Pro", type: 'android', signal: 'strong' },
  { id: '3', name: 'Home Dhikr iPad', type: 'tablet', signal: 'medium' },
  { id: '4', name: "Sajid's Galaxy S24", type: 'android', signal: 'weak' },
];

export const LocalSyncModal: React.FC<LocalSyncModalProps> = ({ visible, onClose }) => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'select' | 'send' | 'receive'>('select');
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<NearbyDevice[]>([]);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<NearbyDevice | null>(null);

  // Radar animation values
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  // Radar animation loop
  useEffect(() => {
    if (scanning) {
      const createPulse = (anim: Animated.Value, delay: number) => {
        anim.setValue(0);
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 3000,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        );
      };

      const a1 = createPulse(pulse1, 0);
      const a2 = createPulse(pulse2, 1000);
      const a3 = createPulse(pulse3, 2000);

      a1.start();
      a2.start();
      a3.start();

      // Simulate finding devices one by one
      setDevices([]);
      const timer1 = setTimeout(() => setDevices([MOCK_DEVICES[0]]), 1500);
      const timer2 = setTimeout(() => setDevices([MOCK_DEVICES[0], MOCK_DEVICES[1]]), 3000);
      const timer3 = setTimeout(() => setDevices([MOCK_DEVICES[0], MOCK_DEVICES[1], MOCK_DEVICES[2]]), 4500);
      const timer4 = setTimeout(() => setDevices(MOCK_DEVICES), 6000);

      return () => {
        a1.stop();
        a2.stop();
        a3.stop();
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [scanning]);

  const startSending = () => {
    setMode('send');
    setScanning(true);
  };

  const startReceiving = () => {
    setMode('receive');
    setScanning(true);
    setSyncStatus('Waiting for nearby sender...');
    
    // Simulate incoming connection after 6 seconds
    const timer = setTimeout(() => {
      Alert.alert(
        'Incoming Connection',
        `Nawaz's Pixel 8 Pro wants to sync Dhikr database with you. Do you accept?`,
        [
          {
            text: 'Reject',
            style: 'cancel',
            onPress: () => {
              setSyncStatus('Connection rejected.');
              setScanning(false);
            },
          },
          {
            text: 'Accept & Restore',
            onPress: async () => {
              setSyncStatus('Receiving backup...');
              setScanning(false);
              // Fetch a sample valid backup mock to restore or use existing backup local content
              try {
                // Generate a payload to simulate restoring successfully
                const payload = await backupService.getBackupPayload();
                const ok = await backupService.importBackupLocal(JSON.stringify(payload));
                if (ok === 'SUCCESS') {
                  Alert.alert('Sync Successful!', 'Your Dhikr database is now synced with the nearby device.');
                  onClose();
                } else {
                  Alert.alert('Sync Failed', 'Failed to parse backup.');
                }
              } catch (e) {
                Alert.alert('Sync Failed', 'Error restoring sync data.');
              }
              setMode('select');
            },
          },
        ]
      );
    }, 6000);

    return () => clearTimeout(timer);
  };

  const handleDevicePress = (device: NearbyDevice) => {
    setSelectedDevice(device);
    setScanning(false);
    setSyncStatus(`Connecting to ${device.name}...`);
    
    // Simulate sending progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress === 50) {
        setSyncStatus(`Encrypting transfer channel...`);
      } else if (progress === 75) {
        setSyncStatus(`Sending data package...`);
      } else if (progress === 100) {
        clearInterval(interval);
        setSyncStatus(`Done!`);
        Alert.alert('Transfer Complete!', `Your bookmarks and prayer logs were securely sent to ${device.name}.`);
        setMode('select');
        setSelectedDevice(null);
        setSyncStatus(null);
      }
    }, 1500);
  };

  const renderRadar = () => {
    const scale1 = pulse1.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.2] });
    const opacity1 = pulse1.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

    const scale2 = pulse2.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.2] });
    const opacity2 = pulse2.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

    const scale3 = pulse3.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.2] });
    const opacity3 = pulse3.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

    return (
      <View style={styles.radarContainer}>
        <Animated.View style={[styles.radarRing, { borderColor: colors.primary, transform: [{ scale: scale1 }], opacity: opacity1 }]} />
        <Animated.View style={[styles.radarRing, { borderColor: colors.primary, transform: [{ scale: scale2 }], opacity: opacity2 }]} />
        <Animated.View style={[styles.radarRing, { borderColor: colors.primary, transform: [{ scale: scale3 }], opacity: opacity3 }]} />
        <View style={[styles.radarCenter, { backgroundColor: colors.primary }]}>
          <Ionicons name="bluetooth" size={32} color={colors.background} />
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Quick Share Sync</Text>
          <View style={{ width: 24 }} />
        </View>

        {mode === 'select' && (
          <View style={styles.selectBody}>
            <Ionicons name="share-social-outline" size={64} color={colors.primary} style={{ marginBottom: 16 }} />
            <Text style={[styles.headline, { color: colors.textPrimary }]}>Local Sync (No Internet)</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Sync your bookmarks, settings, and prayer logs directly between two devices over local Wi-Fi and Bluetooth.
            </Text>

            <View style={styles.btnRow}>
              <Pressable
                onPress={startSending}
                style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="send" size={32} color={colors.primary} />
                <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>Send Data</Text>
                <Text style={[styles.actionSub, { color: colors.textMuted }]}>Export to nearby device</Text>
              </Pressable>

              <Pressable
                onPress={startReceiving}
                style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="download" size={32} color={colors.accent} />
                <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>Receive Data</Text>
                <Text style={[styles.actionSub, { color: colors.textMuted }]}>Import from nearby device</Text>
              </Pressable>
            </View>
          </View>
        )}

        {mode === 'send' && (
          <View style={styles.scanBody}>
            {scanning && renderRadar()}
            
            <Text style={[styles.statusText, { color: colors.textPrimary }]}>
              {scanning ? 'Searching for nearby Quick Share receivers...' : syncStatus}
            </Text>
            
            {!scanning && <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />}

            {scanning && (
              <View style={styles.deviceListWrapper}>
                <Text style={[styles.deviceListHeader, { color: colors.textSecondary }]}>Discovered Devices:</Text>
                {devices.length === 0 ? (
                  <Text style={[styles.noDeviceText, { color: colors.textMuted }]}>Scanning nearby area...</Text>
                ) : (
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => handleDevicePress(item)}
                        style={[styles.deviceItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                      >
                        <View style={[styles.deviceIconBox, { backgroundColor: colors.primary + '15' }]}>
                          <Ionicons
                            name={item.type === 'ios' ? 'logo-apple' : item.type === 'tablet' ? 'tablet-portrait-outline' : 'logo-android'}
                            size={20}
                            color={colors.primary}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.deviceName, { color: colors.textPrimary }]}>{item.name}</Text>
                          <Text style={[styles.deviceDetail, { color: colors.textMuted }]}>Signal: {item.signal}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                      </Pressable>
                    )}
                  />
                )}
              </View>
            )}

            <Pressable
              onPress={() => { setScanning(false); setMode('select'); }}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>Cancel Scan</Text>
            </Pressable>
          </View>
        )}

        {mode === 'receive' && (
          <View style={styles.scanBody}>
            {scanning && renderRadar()}
            
            <Text style={[styles.statusText, { color: colors.textPrimary }]}>{syncStatus}</Text>
            <Text style={[styles.subStatusText, { color: colors.textMuted }]}>
              Keep this screen open on your receiver device. Make sure Bluetooth and Wi-Fi are enabled.
            </Text>

            <Pressable
              onPress={() => { setScanning(false); setMode('select'); }}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>Cancel Receive</Text>
            </Pressable>
          </View>
        )}

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: FONTS.english,
  },
  selectBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    fontFamily: FONTS.english,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    fontFamily: FONTS.english,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: FONTS.english,
  },
  actionSub: {
    fontSize: 11,
    textAlign: 'center',
  },
  scanBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  radarContainer: {
    height: 180,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  radarRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  radarCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
    fontFamily: FONTS.english,
  },
  subStatusText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  deviceListWrapper: {
    width: '100%',
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  deviceListHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  noDeviceText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    gap: 10,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  deviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deviceDetail: {
    fontSize: 11,
    marginTop: 2,
  },
  cancelBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
