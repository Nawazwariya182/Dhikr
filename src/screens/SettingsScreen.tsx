import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, ActivityIndicator, TextInput, Linking, Modal, Share, Platform, Image, Animated } from 'react-native';


import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { FONTS, GOOGLE_DRIVE_CONFIG } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { notificationService } from '../services/notificationService';
import { backupService } from '../services/backupService';
import { googleAuthService } from '../services/googleAuthService';
import { sharingService, KhatmRoom, DhikrCircle, getJuzDivisionForMember } from '../services/sharingService';

// Initialize WebBrowser redirect listener
WebBrowser.maybeCompleteAuthSession();

const AnimatedSegmentButton: React.FC<{
  active: boolean;
  onPress: () => void;
  label: string;
  colors: any;
}> = ({ active, onPress, label, colors }) => {
  const anim = React.useRef(new Animated.Value(active ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: active ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const textColor = active ? colors.white : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={styles.segmentButton}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: colors.primary,
            borderRadius: 8,
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Text
        style={[
          styles.segmentText,
          { zIndex: 1, color: textColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    preferences,
    setTranslationLanguage,
    setThemeMode,
    setArabicFont,
    setEnableHifzBlur,
    setDailyRukuGoal,
    setRemindersEnabled,
    setReminderStartHour,
    setReminderEndHour,
    colors,
  } = useAppPreferences();


  // Backup & Auth States
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importText, setImportText] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [lastBackupTime, setLastBackupTime] = useState<number | null>(null);
  const [authState, setAuthState] = useState(googleAuthService.getAuthState());
  const [communityVisible, setCommunityVisible] = useState(false);



  // Group Khatm States
  const [userName, setUserName] = useState('');
  const [khatmRoomIdInput, setKhatmRoomIdInput] = useState('');
  const [khatmRoomNameInput, setKhatmRoomNameInput] = useState('');
  const [khatmMemberCountInput, setKhatmMemberCountInput] = useState('5');
  const [selectedMemberSlot, setSelectedMemberSlot] = useState(0);
  const [activeKhatmRoom, setActiveKhatmRoom] = useState<KhatmRoom | null>(null);
  const [khatmAction, setKhatmAction] = useState<'none' | 'create' | 'join'>('none');
  const [khatmLoading, setKhatmLoading] = useState(false);

  // Dhikr Circle States
  const [circleIdInput, setCircleIdInput] = useState('');
  const [circleNameInput, setCircleNameInput] = useState('');
  const [circleTargetInput, setCircleTargetInput] = useState('1000');
  const [activeCircle, setActiveCircle] = useState<DhikrCircle | null>(null);
  const [circleAction, setCircleAction] = useState<'none' | 'create' | 'join'>('none');
  const [circleLoading, setCircleLoading] = useState(false);
  const [myCircleCount, setMyCircleCount] = useState(0);

  useEffect(() => {
    // Load Username & GDrive Token
    AsyncStorage.getItem('@dhikr_username').then(name => {
      if (name) setUserName(name);
      else setUserName(`Guest_${Math.floor(1000 + Math.random() * 9000)}`);
    });

    // Load last backup time even without token
    AsyncStorage.getItem('@gdrive_last_backup').then(ts => {
      if (ts) setLastBackupTime(Number(ts));
    });

    // Subscribe to Google authentication state changes
    const unsubscribe = googleAuthService.subscribe((state) => {
      setAuthState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  // Live Firebase Subscriptions
  useEffect(() => {
    let unsubscribeKhatm: (() => void) | null = null;
    let unsubscribeCircle: (() => void) | null = null;

    if (activeKhatmRoom?.roomId) {
      unsubscribeKhatm = sharingService.subscribeToKhatmRoom(
        activeKhatmRoom.roomId,
        (room) => {
          if (room) {
            setActiveKhatmRoom(room);
          }
        }
      );
    }

    if (activeCircle?.circleId) {
      unsubscribeCircle = sharingService.subscribeToDhikrCircle(
        activeCircle.circleId,
        (circle) => {
          if (circle) {
            setActiveCircle(circle);
            // Sync personal count in circle if exists
            if (circle.members[userName]) {
              setMyCircleCount(circle.members[userName].count);
            }
          }
        }
      );
    }

    return () => {
      if (unsubscribeKhatm) unsubscribeKhatm();
      if (unsubscribeCircle) unsubscribeCircle();
    };
  }, [activeKhatmRoom?.roomId, activeCircle?.circleId, userName]);

  // Google OAuth redirect link opener (using native Google Sign-In)
  const handleConnectGoogle = async () => {
    if (!googleAuthService.isNativeAvailable) {
      Alert.alert(
        'Manual Connection Required',
        'Native Google Sign-In is not supported in Expo Go or emulators. Please paste a manual access token or code below to connect your account.',
        [{ text: 'OK' }]
      );
      return;
    }
    setRestoring(true);
    try {
      const success = await googleAuthService.loginNatively();
      if (success) {
        // Search for existing backups on the new device/install
        const token = await googleAuthService.getAccessToken();
        if (token) {
          const latestBackup = await backupService.getLatestBackup(token);
          if (latestBackup) {
            Alert.alert(
              'Backup Found',
              'We found an existing backup on your Google Drive. Would you like to restore your settings, bookmarks, and prayer history now?',
              [
                {
                  text: 'No, Keep Current',
                  style: 'cancel',
                  onPress: () => {
                    Alert.alert('Google Connected', 'Your Google Drive account has been connected successfully.', [{ text: 'OK' }]);
                  }
                },
                {
                  text: 'Yes, Restore Data',
                  onPress: async () => {
                    setRestoring(true);
                    try {
                      const err = await backupService.restoreFromDrive(token);
                      if (err === null) {
                        Alert.alert('Restore Successful', 'Your bookmarks and settings have been restored successfully.');
                      } else {
                        Alert.alert('Restore Failed', 'Failed to restore backup data from Google Drive.');
                      }
                    } catch (e: any) {
                      Alert.alert('Restore Error', e.message || 'An error occurred during restore.');
                    } finally {
                      setRestoring(false);
                    }
                  }
                }
              ]
            );
          } else {
            Alert.alert('Google Connected', 'Your Google Drive account has been connected successfully.', [{ text: 'OK' }]);
          }
        } else {
          Alert.alert('Google Connected', 'Your Google Drive account has been connected successfully.', [{ text: 'OK' }]);
        }
      }
    } catch (err: any) {
      if (err.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Connection Failed', err.message || 'An error occurred during native sign-in.');
      }
    } finally {
      setRestoring(false);
    }
  };

  const handleConnectManualToken = async () => {
    if (!manualToken.trim()) {
      Alert.alert('Empty Token', 'Please enter a valid Google OAuth Access Token, Code or Redirect URL.');
      return;
    }
    const input = manualToken.trim();
    
    // Check if the input contains an authorization code parameter or is a code
    const codeMatch = input.match(/[?&]code=([^&]+)/);
    const code = codeMatch ? decodeURIComponent(codeMatch[1]) : (input.startsWith('4/') ? input : null);

    if (code) {
      setRestoring(true);
      try {
        await googleAuthService.exchangeCodeForTokens(code);
        setManualToken('');
        Alert.alert('Google Connected', 'Your Google Drive account has been connected successfully.', [{ text: 'OK' }]);
      } catch (err: any) {
        Alert.alert('Connection Failed', err.message || 'An error occurred during code exchange.');
      } finally {
        setRestoring(false);
      }
      return;
    }

    // Fallback to direct access token if provided
    const tokenMatch = input.match(/access_token=([^&]+)/);
    const token = tokenMatch && tokenMatch[1] ? tokenMatch[1] : input;

    setRestoring(true);
    try {
      const success = await googleAuthService.loginWithDirectToken(token);
      if (success) {
        setManualToken('');
        Alert.alert('Google Connected', 'Your Google Drive account has been connected successfully.', [{ text: 'OK' }]);
      } else {
        Alert.alert('Connection Error', 'Failed to authenticate with direct token.');
      }
    } catch (err: any) {
      Alert.alert('Connection Failed', err.message || 'Direct token login failed.');
    } finally {
      setRestoring(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    await googleAuthService.logout();
    Alert.alert('Google Disconnected', 'Google Drive link removed.');
  };

  const handleExportBackup = async () => {
    setBackingUp(true);
    const success = await backupService.exportBackupLocal();
    setBackingUp(false);
    if (success) {
      Alert.alert('Export Successful', 'Your backup has been generated and shared.', [{ text: 'OK' }]);
    } else {
      Alert.alert('Export Failed', 'Unable to export backup data.');
    }
  };

  const handleImportBackup = async () => {
    if (!importText.trim()) {
      Alert.alert('Empty Input', 'Please paste your backup JSON text.');
      return;
    }
    setRestoring(true);
    const success = await backupService.importBackupLocal(importText.trim());
    setRestoring(false);
    if (success) {
      setImportModalVisible(false);
      setImportText('');
      Alert.alert('Restore Complete', 'Bookmarks and preferences successfully restored.', [{ text: 'OK' }]);
    } else {
      Alert.alert('Restore Failed', 'Invalid backup text format. Make sure you copied the correct backup string.');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Free Up Storage',
      'This will remove temporary cache data (search history, cached lists). Your bookmarks, prayer logs, and preferences are NOT affected. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          onPress: async () => {
            await backupService.clearStorageCache();
            Alert.alert('Done', 'Storage cache cleared. You can now try exporting to Drive again.');
          },
        },
      ]
    );
  };

  const handleBackupToDrive = async () => {
    const token = await googleAuthService.getAccessToken();
    if (!token) {
      Alert.alert('Not Connected', 'Please connect your Google account first.');
      return;
    }
    setBackingUp(true);
    const err = await backupService.backupToDrive(token);
    setBackingUp(false);
    if (err === null) {
      const now = Date.now();
      setLastBackupTime(now);
      Alert.alert('Backup Successful', 'Your bookmarks and settings have been backed up to Google Drive.');
    } else {
      Alert.alert(
        'Backup Failed',
        `Google Drive error:\n\n${err}\n\nTip: Disconnect and reconnect your Google account to refresh the token.`
      );
    }
  };

  const handleRestoreFromDrive = async () => {
    const token = await googleAuthService.getAccessToken();
    if (!token) {
      Alert.alert('Not Connected', 'Please connect your Google account first.');
      return;
    }
    Alert.alert(
      'Import from Drive',
      'This will overwrite your current bookmarks and settings with the Drive backup. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            setRestoring(true);
            const err = await backupService.restoreFromDrive(token);
            setRestoring(false);
            if (err === null) {
              Alert.alert('Import Successful', 'Your bookmarks and settings have been restored from Google Drive.');
            } else if (err === 'NO_BACKUP') {
              Alert.alert('No Backup Found', 'No backup file exists on Drive yet. Please press "Export to Drive" first to create one.');
            } else if (err === 'PARSE_ERROR') {
              Alert.alert('Import Failed', 'The backup file on Drive is corrupted or invalid.');
            } else {
              Alert.alert('Import Failed', `Google Drive error:\n\n${err}\n\nTip: Disconnect and reconnect your Google account to refresh the token.`);
            }
          },
        },
      ]
    );
  };

  // Group Khatm Handlers
  const handleCreateKhatmRoom = async () => {
    if (!khatmRoomIdInput.trim() || !khatmRoomNameInput.trim()) {
      Alert.alert('Required Info', 'Please specify a Room ID and Room Name.');
      return;
    }
    setKhatmLoading(true);
    try {
      const count = Number(khatmMemberCountInput);
      const room = await sharingService.createKhatmRoom(khatmRoomIdInput.trim(), khatmRoomNameInput.trim(), count);
      setActiveKhatmRoom(room);
      setKhatmAction('none');
      await AsyncStorage.setItem('@dhikr_username', userName.trim());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not create room.');
    } finally {
      setKhatmLoading(false);
    }
  };

  const handleJoinKhatmRoom = async () => {
    if (!khatmRoomIdInput.trim() || !userName.trim()) {
      Alert.alert('Required Info', 'Room ID and Username are required to join.');
      return;
    }
    setKhatmLoading(true);
    try {
      await sharingService.claimMemberDivision(
        khatmRoomIdInput.trim(),
        selectedMemberSlot,
        5, // Temporary fallback, division details will be read from Firestore room metadata
        userName.trim()
      );
      
      // Setup active reference
      setActiveKhatmRoom({
        roomId: khatmRoomIdInput.trim().toLowerCase(),
        name: 'Connecting...',
        createdAt: Date.now(),
        memberCount: 5,
        slots: {},
      });
      setKhatmAction('none');
      await AsyncStorage.setItem('@dhikr_username', userName.trim());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not join room.');
      setActiveKhatmRoom(null);
    } finally {
      setKhatmLoading(false);
    }
  };

  const handleToggleJuzCompletion = async (juzNum: number, currentStatus: boolean) => {
    if (!activeKhatmRoom) return;
    try {
      await sharingService.updateJuzCompletion(activeKhatmRoom.roomId, juzNum, !currentStatus, userName.trim());
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Dhikr Circle Handlers
  const handleCreateCircle = async () => {
    if (!circleIdInput.trim() || !circleNameInput.trim()) {
      Alert.alert('Required Info', 'Specify a Circle ID and Name.');
      return;
    }
    setCircleLoading(true);
    try {
      const target = Number(circleTargetInput) || 1000;
      const circle = await sharingService.createDhikrCircle(circleIdInput.trim(), circleNameInput.trim(), target);
      setActiveCircle(circle);
      setCircleAction('none');
      setMyCircleCount(0);
      await AsyncStorage.setItem('@dhikr_username', userName.trim());
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setCircleLoading(false);
    }
  };

  const handleJoinCircle = async () => {
    if (!circleIdInput.trim() || !userName.trim()) {
      Alert.alert('Required Info', 'Circle ID and Username are required to join.');
      return;
    }
    setCircleLoading(true);
    try {
      // Connect to circle
      setActiveCircle({
        circleId: circleIdInput.trim().toLowerCase(),
        name: 'Connecting...',
        createdAt: Date.now(),
        targetCount: 1000,
        totalCount: 0,
        members: {},
      });
      setCircleAction('none');
      await AsyncStorage.setItem('@dhikr_username', userName.trim());
    } catch (e: any) {
      Alert.alert('Error', e.message);
      setActiveCircle(null);
    } finally {
      setCircleLoading(false);
    }
  };

  const handleIncrementCircle = async () => {
    if (!activeCircle) return;
    const nextCount = myCircleCount + 1;
    setMyCircleCount(nextCount);
    try {
      await sharingService.updateCircleCount(activeCircle.circleId, userName.trim(), nextCount);
    } catch (e: any) {
      console.warn(e.message);
    }
  };

  const handleResetCircle = async () => {
    if (!activeCircle) return;
    setMyCircleCount(0);
    try {
      await sharingService.updateCircleCount(activeCircle.circleId, userName.trim(), 0);
    } catch (e: any) {
      console.warn(e.message);
    }
  };

  // Preference Settings Handlers
  const handleToggleReminders = async (enabled: boolean) => {
    await setRemindersEnabled(enabled);
    await notificationService.scheduleRukuReminders(
      enabled,
      preferences.dailyRukuGoal,
      preferences.reminderStartHour,
      preferences.reminderEndHour
    );
  };

  const handleGoalChange = async (increment: boolean) => {
    const nextGoal = increment
      ? preferences.dailyRukuGoal + 1
      : Math.max(1, preferences.dailyRukuGoal - 1);
    
    await setDailyRukuGoal(nextGoal);
    await notificationService.scheduleRukuReminders(
      preferences.remindersEnabled,
      nextGoal,
      preferences.reminderStartHour,
      preferences.reminderEndHour
    );
  };

  const handleHourChange = async (isStart: boolean, increment: boolean) => {
    const currentHour = isStart ? preferences.reminderStartHour : preferences.reminderEndHour;
    let nextHour = increment ? currentHour + 1 : currentHour - 1;
    
    if (nextHour < 0) nextHour = 23;
    if (nextHour > 23) nextHour = 0;

    if (isStart) {
      await setReminderStartHour(nextHour);
    } else {
      await setReminderEndHour(nextHour);
    }

    await notificationService.scheduleRukuReminders(
      preferences.remindersEnabled,
      preferences.dailyRukuGoal,
      isStart ? nextHour : preferences.reminderStartHour,
      isStart ? preferences.reminderEndHour : nextHour
    );
  };

  const handleTestNotification = async () => {
    await notificationService.triggerTestNotification();
    Alert.alert('Triggered', 'Local notification scheduled immediately.', [{ text: 'OK' }]);
  };

  const formatHourLabel = (hour: number): string => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <View style={[styles.screenWrapper, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* App Info Header */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={55} color={colors.primary} />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Dhikr</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>Quran Reader • Version 3.0.0 </Text>
        </View>
      </View>

      {/* Spacer where Profile Settings used to be */}
      <View style={{ height: 10 }} />

      {/* Translations setting */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Reading Options</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.prefLabel, { color: colors.textSecondary }]}>Translation Display</Text>
          <View style={[styles.segmentRow, { backgroundColor: colors.background }]}> 
            <Pressable
              onPress={() => setTranslationLanguage('english')}
              style={[
                styles.segmentButton,
                preferences.translationLanguage === 'english' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.translationLanguage === 'english' ? colors.white : colors.textSecondary }]}>English</Text>
            </Pressable>
            <Pressable
              onPress={() => setTranslationLanguage('urdu')}
              style={[
                styles.segmentButton,
                preferences.translationLanguage === 'urdu' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.translationLanguage === 'urdu' ? colors.white : colors.textSecondary }]}>Urdu</Text>
            </Pressable>
            <Pressable
              onPress={() => setTranslationLanguage('both')}
              style={[
                styles.segmentButton,
                preferences.translationLanguage === 'both' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.translationLanguage === 'both' ? colors.white : colors.textSecondary }]}>Stacked</Text>
            </Pressable>
          </View>

          <Text style={[styles.prefLabel, { color: colors.textSecondary, marginTop: 14 }]}>Quran Font Style</Text>
          <View style={[styles.segmentRow, { backgroundColor: colors.background }]}> 
            <Pressable
              onPress={() => setArabicFont('uthmani')}
              style={[
                styles.segmentButton,
                preferences.arabicFont === 'uthmani' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.arabicFont === 'uthmani' ? colors.white : colors.textSecondary }]}>Uthmani</Text>
            </Pressable>
            <Pressable
              onPress={() => setArabicFont('indopak')}
              style={[
                styles.segmentButton,
                preferences.arabicFont === 'indopak' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.arabicFont === 'indopak' ? colors.white : colors.textSecondary }]}>IndoPak</Text>
            </Pressable>
          </View>

          <Text style={[styles.prefLabel, { color: colors.textSecondary, marginTop: 14 }]}>Appearance</Text>
          <View style={[styles.segmentRow, { backgroundColor: colors.background }]}> 
            <Pressable
              onPress={() => setThemeMode('dark')}
              style={[styles.segmentButton, preferences.themeMode === 'dark' ? { backgroundColor: colors.primary } : null]}
            >
              <Text style={[styles.segmentText, { color: preferences.themeMode === 'dark' ? colors.white : colors.textSecondary }]}>Dark</Text>
            </Pressable>
            <Pressable
              onPress={() => setThemeMode('light')}
              style={[styles.segmentButton, preferences.themeMode === 'light' ? { backgroundColor: colors.primary } : null]}
            >
              <Text style={[styles.segmentText, { color: preferences.themeMode === 'light' ? colors.white : colors.textSecondary }]}>Light</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Sunni Features paused for now */}



      {/* Backup & Restore
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Backup & Restore</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.prefDesc, { color: colors.textMuted, marginBottom: 16 }]}>
            Export your bookmarks and settings locally, or restore them from a previously exported backup string.
          </Text>
          <View style={styles.backupButtons}>
            <Pressable
              onPress={handleExportBackup}
              disabled={backingUp || restoring}
              style={[styles.backupBtn, { backgroundColor: colors.primary }]}
            >
              {backingUp ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="share-outline" size={18} color="#fff" />
                  <Text style={styles.backupBtnText}>Export Backup</Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={() => setImportModalVisible(true)}
              disabled={backingUp || restoring}
              style={[styles.restoreBtn, { borderColor: colors.primary }]}
            >
              {restoring ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Ionicons name="download-outline" size={18} color={colors.primary} />
                  <Text style={[styles.restoreBtnText, { color: colors.primary }]}>Import Backup</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Storage warning + clear cache */}
          {/* <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            padding: 10, borderRadius: 8, backgroundColor: colors.background }}>
            <Text style={{ color: colors.textMuted, fontSize: 11, flex: 1, marginRight: 8 }}>
              If Drive export fails with a storage error, clear cache first.
            </Text>
            <Pressable
              onPress={handleClearCache}
              style={({ pressed }) => ([
                { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
                  backgroundColor: colors.error + '18', opacity: pressed ? 0.7 : 1 },
              ])}
            >
              <Text style={{ color: colors.error, fontWeight: '700', fontSize: 12 }}>Free Storage</Text>
            </Pressable>
          </View>
        </View>
      </View> */}

      {/* Google Drive Backup */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Google Drive Cloud Sync</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
          {authState.isAuthenticated ? (
            <View>
              {/* Header: Google brand gradient bar */}
              <View style={{ height: 4, backgroundColor: '#4285F4', borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />

              {/* Account row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 12 }}>
                {/* Avatar */}
                {authState.user?.picture ? (
                  <Image
                    source={{ uri: authState.user.picture }}
                    style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#4285F4' }}
                  />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 20 }}>
                      {authState.user?.email ? authState.user.email[0].toUpperCase() : 'G'}
                    </Text>
                  </View>
                )}
                {/* Info */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 15 }} numberOfLines={1}>
                    {authState.user?.name || authState.user?.email || 'Google Account'}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#10b981' }} />
                    <Text style={{ color: '#10b981', fontSize: 12, fontWeight: '600' }}>Drive Connected</Text>
                  </View>
                  {lastBackupTime && (
                    <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
                      Last exported: {new Date(lastBackupTime).toLocaleString()}
                    </Text>
                  )}
                </View>
                {/* Disconnect */}
                <Pressable
                  onPress={handleDisconnectGoogle}
                  style={({ pressed }) => ([
                    { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.error + '18' },
                    pressed && { opacity: 0.75 },
                  ])}
                >
                  <Text style={{ color: colors.error, fontWeight: '700', fontSize: 12 }}>Disconnect</Text>
                </Pressable>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }} />

              {/* Action buttons */}
              <View style={{ flexDirection: 'row', padding: 14, gap: 10 }}>
                {/* Export to Drive */}
                <Pressable
                  onPress={handleBackupToDrive}
                  disabled={backingUp || restoring}
                  style={({ pressed }) => ([
                    {
                      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                      gap: 7, paddingVertical: 13, borderRadius: 12,
                      backgroundColor: '#4285F4',
                      opacity: (backingUp || restoring) ? 0.6 : pressed ? 0.85 : 1,
                    },
                  ])}
                >
                  {backingUp
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <>
                        <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Export to Drive</Text>
                      </>
                  }
                </Pressable>

                {/* Import from Drive */}
                <Pressable
                  onPress={handleRestoreFromDrive}
                  disabled={backingUp || restoring}
                  style={({ pressed }) => ([
                    {
                      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                      gap: 7, paddingVertical: 13, borderRadius: 12,
                      backgroundColor: 'transparent',
                      borderWidth: 1.5, borderColor: '#4285F4',
                      opacity: (backingUp || restoring) ? 0.6 : pressed ? 0.75 : 1,
                    },
                  ])}
                >
                  {restoring
                    ? <ActivityIndicator size="small" color="#4285F4" />
                    : <>
                        <Ionicons name="cloud-download-outline" size={18} color="#4285F4" />
                        <Text style={{ color: '#4285F4', fontWeight: '700', fontSize: 13 }}>Import from Drive</Text>
                      </>
                  }
                </Pressable>
              </View>

              {/* Safety note */}
              {/* <View style={{ marginHorizontal: 14, marginBottom: 14, padding: 10, borderRadius: 10, backgroundColor: colors.background, borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
                <Text style={{ color: '#f59e0b', fontWeight: '700', fontSize: 11, marginBottom: 2 }}>⚠ Manual sync only</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11, lineHeight: 16 }}>
                  Export to Drive manually to sync your data. To restore your data on this or another device, tap Import from Drive.
                </Text>
              </View> */}
            </View>
          ) : (
            <View style={{ padding: 16 }}>
              {/* Google branding top */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#4285F420', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="logo-google" size={22} color="#4285F4" />
                </View>
                <View>
                  <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 15 }}>Google Drive Backup</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>Keep your data safe in the cloud</Text>
                </View>
              </View>

              <Text style={[styles.prefDesc, { color: colors.textMuted, marginBottom: 16 }]}>
                Connect your Google Account to backup bookmarks, prayer logs, and preferences — and restore them on any device.
              </Text>

              <Pressable
                onPress={handleConnectGoogle}
                style={({ pressed }) => ([
                  {
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, paddingVertical: 14, borderRadius: 12,
                    backgroundColor: '#4285F4',
                    opacity: pressed ? 0.85 : 1,
                  },
                ])}
              >
                <Ionicons name="logo-google" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Connect via Google OAuth</Text>
              </Pressable>
              {!googleAuthService.isNativeAvailable && (
                <>
                  <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center', marginVertical: 12 }}>
                    — or connect manually (e.g. for Expo Go testing / Emulator) —
                  </Text>

                  <TextInput
                    value={manualToken}
                    onChangeText={setManualToken}
                    placeholder="Paste Google OAuth Access Token (ya29...)"
                    placeholderTextColor={colors.textMuted}
                    style={[
                      styles.inputField,
                      {
                        color: colors.textPrimary,
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                        marginBottom: 8,
                        fontSize: 12,
                      }
                    ]}
                  />

                  <Pressable
                    onPress={handleConnectManualToken}
                    style={({ pressed }) => ([
                      {
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        gap: 8, paddingVertical: 12, borderRadius: 12,
                        borderWidth: 1.5, borderColor: colors.border,
                        backgroundColor: colors.surfaceLight,
                        opacity: pressed ? 0.8 : 1,
                        marginBottom: 8,
                      },
                    ])}
                  >
                    <Ionicons name="key-outline" size={16} color={colors.textSecondary} />
                    <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>Connect with Token</Text>
                  </Pressable>

                  <Text style={{ color: colors.textMuted, fontSize: 11, fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 4, marginTop: 4 }}>
                    Tip: Google blocks standard sign-in inside Expo Go due to security proxy policies. To test backup/restore, search "Google OAuth Playground", authorize the "drive.appdata" scope to generate an Access Token, and paste it here.
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      </View>



      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>About</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}> 
            Dikhr is a clean, respectful Quran reading application designed for daily recitation and study. It provides a distraction-free interface to read the Quran in Arabic along with English and Urdu translations By Ahmed Raza Khan. Dikhr is built with love and respect for the Holy Quran, aiming to make it easy for everyone to access and read the Quran on their mobile devices. May this app be a means of bringing us closer to the words of Allah. Ameen.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Quran Data</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Surahs</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>114</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Ayahs</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>6,236</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Juz</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>30</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Rukus</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>556</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}> 
          Made with respect for the Holy Quran By Nawaz Wariya.
        </Text>
      </View>
    </ScrollView>

    {/* Floating Community button paused for now
    <Pressable
      onPress={() => setCommunityVisible(true)}
      style={[styles.floatingCommunityBtn, { backgroundColor: colors.primary }]}
      android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
    >
      <Ionicons name="people" size={24} color="#ffffff" />
    </Pressable>
    */}

    {/* Import Backup Modal */}
    <Modal
      visible={importModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setImportModalVisible(false)}
    >
      <View style={styles.modalOverlayCentered}>
        <View style={[styles.dialogLarge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.dialogTitle, { color: colors.textPrimary }]}>Import Backup</Text>
          <Text style={[styles.prefDesc, { color: colors.textMuted, marginBottom: 12 }]}>
            Paste your exported backup text below to restore your bookmarks and preferences. This will overwrite all current local data.
          </Text>
          
          <TextInput
            multiline
            numberOfLines={10}
            value={importText}
            onChangeText={setImportText}
            placeholder="Paste backup JSON text here..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.largeInputField,
              {
                color: colors.textPrimary,
                borderColor: colors.border,
                backgroundColor: colors.background,
              }
            ]}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
          />

          <View style={styles.rowButtons}>
            <Pressable
              onPress={handleImportBackup}
              disabled={restoring}
              style={[styles.syncOptionBtn, { backgroundColor: colors.primary }]}
            >
              {restoring ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.syncBtnText}>Restore</Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                setImportModalVisible(false);
                setImportText('');
              }}
              style={styles.syncCancelBtn}
            >
              <Text style={{ color: colors.textSecondary }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>

    {/* Community Sync Modal */}
    <Modal
      visible={communityVisible}
      animationType="slide"
      onRequestClose={() => setCommunityVisible(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Community Sync</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>Live Collaborative Quran Sync</Text>
          </View>
          <Pressable
            onPress={() => setCommunityVisible(false)}
            style={[styles.modalCloseBtn, { backgroundColor: colors.border }]}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* PROFILE USERNAME REMOVED */}

          {/* GROUP KHATM */}
          <View style={[styles.premiumCard, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
            <View style={styles.premiumCardHeader}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={[styles.premiumCardTitle, { color: colors.textPrimary, marginLeft: 6 }]}>Group Khatm Room (30 Juz Sync)</Text>
            </View>
            <Text style={[styles.prefDesc, { color: colors.textMuted, marginBottom: 12 }]}>
              Claim and read Juz divisions collaboratively with 2 to 30 members.
            </Text>

            {activeKhatmRoom ? (
              <View style={styles.activeSyncBox}>
                <View style={styles.activeSyncHeader}>
                  <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} />
                  <Text style={[styles.activeSyncTitle, { color: colors.textPrimary, marginLeft: 6 }]}>
                    {activeKhatmRoom.name}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 10 }}>
                  Room ID: {activeKhatmRoom.roomId} | Total Members: {activeKhatmRoom.memberCount}
                </Text>

                {/* Progress bar */}
                {(() => {
                  const completedCount = Object.values(activeKhatmRoom.slots).filter(s => s.completed).length;
                  const percent = Math.round((completedCount / 30) * 100);
                  return (
                    <View style={{ marginBottom: 14 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>
                          Khatm Progress: {completedCount} / 30 Juz
                        </Text>
                        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: 'bold' }}>
                          {percent}%
                        </Text>
                      </View>
                      <View style={[styles.progressBarContainer, { backgroundColor: colors.background }]}>
                        <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: colors.primary }]} />
                      </View>
                    </View>
                  );
                })()}

                {/* Division range */}
                <View style={[styles.memberBadge, { backgroundColor: colors.background, padding: 10, borderRadius: 8, marginBottom: 12 }]}>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '600' }}>
                    Assigned range: Juz {getJuzDivisionForMember(selectedMemberSlot, activeKhatmRoom.memberCount).join(', ')}
                  </Text>
                </View>

                {/* Slots progress grid */}
                <View style={styles.slotsGrid}>
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const juzNum = idx + 1;
                    const slot = activeKhatmRoom.slots[juzNum] || { reservedBy: '', completed: false };
                    const inMyDivision = getJuzDivisionForMember(selectedMemberSlot, activeKhatmRoom.memberCount).includes(juzNum);
                    const isMine = slot.reservedBy === userName.trim();

                    return (
                      <Pressable
                        key={juzNum}
                        disabled={!inMyDivision || (slot.reservedBy !== '' && !isMine)}
                        onPress={() => handleToggleJuzCompletion(juzNum, slot.completed)}
                        style={[
                          styles.juzSlotCard,
                          { borderColor: colors.border, backgroundColor: colors.background },
                          slot.completed ? { backgroundColor: '#10b98120', borderColor: '#10b981' } : null,
                          inMyDivision && !slot.completed ? { borderWidth: 1.5, borderColor: colors.primary } : null,
                          isMine && !slot.completed ? { backgroundColor: colors.primary + '12' } : null,
                        ]}
                      >
                        <Text style={[styles.juzSlotNum, { color: colors.textPrimary, fontSize: 11, fontWeight: 'bold' }]}>Juz {juzNum}</Text>
                        <Text style={[styles.juzSlotUser, { color: colors.textMuted, fontSize: 8 }]} numberOfLines={1}>
                          {slot.reservedBy ? (isMine ? 'You' : 'Claimed') : 'Unclaimed'}
                        </Text>
                        {slot.completed && <Ionicons name="checkmark-circle" size={12} color="#10b981" style={styles.juzCheck} />}
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  onPress={() => setActiveKhatmRoom(null)}
                  style={[styles.actionBtnOutline, { borderColor: colors.error, marginTop: 16 }]}
                >
                  <Text style={{ color: colors.error, fontWeight: 'bold' }}>Leave Room</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                {khatmAction === 'none' ? (
                  <View style={styles.rowButtons}>
                    <Pressable onPress={() => setKhatmAction('create')} style={[styles.syncOptionBtn, { backgroundColor: colors.primary }]}>
                      <Text style={styles.syncBtnText}>Create Room</Text>
                    </Pressable>
                    <Pressable onPress={() => setKhatmAction('join')} style={[styles.syncOptionBtnOutline, { borderColor: colors.primary }]}>
                      <Text style={[styles.syncBtnOutlineText, { color: colors.primary }]}>Join Room</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.syncForm}>
                    <TextInput
                      value={khatmRoomIdInput}
                      onChangeText={setKhatmRoomIdInput}
                      placeholder="Enter Alphanumeric Room ID"
                      placeholderTextColor={colors.textMuted}
                      style={[styles.inputField, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                      autoCapitalize="none"
                    />
                    {khatmAction === 'create' && (
                      <View>
                        <TextInput
                          value={khatmRoomNameInput}
                          onChangeText={setKhatmRoomNameInput}
                          placeholder="Room Name"
                          placeholderTextColor={colors.textMuted}
                          style={[styles.inputField, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                        />

                        {/* Premium Member Count Picker */}
                        <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: 'bold', marginBottom: 8, marginTop: 4 }}>
                          Select Room Member Size: {khatmMemberCountInput} Members
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          {[2, 3, 5, 10, 15, 30].map(num => (
                            <Pressable
                              key={num}
                              onPress={() => setKhatmMemberCountInput(num.toString())}
                              style={[
                                styles.memberSizeBtn,
                                { backgroundColor: colors.background, borderColor: colors.border },
                                khatmMemberCountInput === num.toString() ? { backgroundColor: colors.primary, borderColor: colors.primary } : null
                              ]}
                            >
                              <Text style={{ color: khatmMemberCountInput === num.toString() ? '#ffffff' : colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>
                                {num}
                              </Text>
                            </Pressable>
                          ))}
                        </View>

                        {/* Plus / Minus Adjuster */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <Pressable
                            onPress={() => {
                              const current = parseInt(khatmMemberCountInput) || 5;
                              if (current > 2) setKhatmMemberCountInput((current - 1).toString());
                            }}
                            style={[styles.counterBtn, { backgroundColor: colors.background }]}
                          >
                            <Ionicons name="remove" size={16} color={colors.textPrimary} />
                          </Pressable>
                          <Text style={{ color: colors.textPrimary, fontWeight: 'bold' }}>Custom Adjustment</Text>
                          <Pressable
                            onPress={() => {
                              const current = parseInt(khatmMemberCountInput) || 5;
                              if (current < 30) setKhatmMemberCountInput((current + 1).toString());
                            }}
                            style={[styles.counterBtn, { backgroundColor: colors.background }]}
                          >
                            <Ionicons name="add" size={16} color={colors.textPrimary} />
                          </Pressable>
                        </View>
                      </View>
                    )}

                    {khatmAction === 'join' && (
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>
                          Choose Your Member Slot:
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <Pressable
                              key={i}
                              onPress={() => setSelectedMemberSlot(i)}
                              style={[
                                styles.slotChoiceBtn,
                                { backgroundColor: colors.background, borderColor: colors.border },
                                selectedMemberSlot === i ? { backgroundColor: colors.primary, borderColor: colors.primary } : null,
                              ]}
                            >
                              <Text style={{ color: selectedMemberSlot === i ? '#fff' : colors.textSecondary, fontWeight: 'bold', fontSize: 12 }}>{i + 1}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}

                    <View style={styles.rowButtons}>
                      <Pressable
                        disabled={khatmLoading}
                        onPress={khatmAction === 'create' ? handleCreateKhatmRoom : handleJoinKhatmRoom}
                        style={[styles.syncOptionBtn, { backgroundColor: colors.primary }]}
                      >
                        {khatmLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.syncBtnText}>Confirm</Text>}
                      </Pressable>
                      <Pressable onPress={() => setKhatmAction('none')} style={styles.syncCancelBtn}>
                        <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Real-time Dhikr Circles */}
          <View style={[styles.premiumCard, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16, marginBottom: 40 }]}>
            <View style={styles.premiumCardHeader}>
              <Ionicons name="sync-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.premiumCardTitle, { color: colors.textPrimary, marginLeft: 6 }]}>Cooperative Dhikr Circle</Text>
            </View>
            <Text style={[styles.prefDesc, { color: colors.textMuted, marginBottom: 12 }]}>
              Join circles and recite live. Aggregate counts in real-time.
            </Text>

            {activeCircle ? (
              <View style={styles.activeSyncBox}>
                <View style={styles.activeSyncHeader}>
                  <Ionicons name="ellipse-outline" size={18} color={colors.accent} />
                  <Text style={[styles.activeSyncTitle, { color: colors.textPrimary, marginLeft: 6 }]}>
                    {activeCircle.name}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 10 }}>
                  Circle ID: {activeCircle.circleId} | Target: {activeCircle.targetCount}
                </Text>

                {/* Progress bar */}
                {(() => {
                  const percent = Math.min(100, Math.round((activeCircle.totalCount / activeCircle.targetCount) * 100)) || 0;
                  return (
                    <View style={{ marginBottom: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>
                          Total Circle Progress: {activeCircle.totalCount} / {activeCircle.targetCount}
                        </Text>
                        <Text style={{ color: colors.accent, fontSize: 12, fontWeight: 'bold' }}>
                          {percent}%
                        </Text>
                      </View>
                      <View style={[styles.progressBarContainer, { backgroundColor: colors.background }]}>
                        <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: colors.accent }]} />
                      </View>
                    </View>
                  );
                })()}

                {/* Increment / Reset */}
                <View style={[styles.circleControls, { backgroundColor: colors.background, padding: 14, borderRadius: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 }}>YOUR RECITATIONS</Text>
                    <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginTop: 2 }}>{myCircleCount}</Text>
                  </View>

                  {/* Giant premium Tasbih tap button */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Pressable
                      onPress={handleIncrementCircle}
                      style={[styles.giantCircleBtn, { backgroundColor: colors.primary }]}
                      hitSlop={8}
                    >
                      <Ionicons name="add" size={24} color="#ffffff" />
                      <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginTop: -2 }}>Tap</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleResetCircle}
                      style={[styles.circleBtnReset, { borderColor: colors.border, height: 44, width: 56 }]}
                      hitSlop={6}
                    >
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Reset</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Reciters list */}
                <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 'bold', marginVertical: 10 }}>Active Reciters</Text>
                <View style={styles.memberList}>
                  {Object.values(activeCircle.members).map((m, idx) => {
                    const isMe = m.username === userName.trim();
                    return (
                      <View key={m.username} style={[styles.memberRow, { borderBottomColor: colors.border }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Ionicons name="person-outline" size={12} color={colors.textMuted} />
                          <Text style={{ color: colors.textPrimary, fontSize: 13 }}>
                            {isMe ? 'You' : `Reciter ${idx + 1}`}
                          </Text>
                        </View>
                        <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 13 }}>{m.count} recitations</Text>
                      </View>
                    );
                  })}
                </View>

                <Pressable
                  onPress={() => setActiveCircle(null)}
                  style={[styles.actionBtnOutline, { borderColor: colors.error, marginTop: 16 }]}
                >
                  <Text style={{ color: colors.error, fontWeight: 'bold' }}>Leave Circle</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                {circleAction === 'none' ? (
                  <View style={styles.rowButtons}>
                    <Pressable onPress={() => setCircleAction('create')} style={[styles.syncOptionBtn, { backgroundColor: colors.primary }]}>
                      <Text style={styles.syncBtnText}>Create Circle</Text>
                    </Pressable>
                    <Pressable onPress={() => setCircleAction('join')} style={[styles.syncOptionBtnOutline, { borderColor: colors.primary }]}>
                      <Text style={[styles.syncBtnOutlineText, { color: colors.primary }]}>Join Circle</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.syncForm}>
                    <TextInput
                      value={circleIdInput}
                      onChangeText={setCircleIdInput}
                      placeholder="Enter Alphanumeric Circle ID"
                      placeholderTextColor={colors.textMuted}
                      style={[styles.inputField, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                      autoCapitalize="none"
                    />
                    {circleAction === 'create' && (
                      <View>
                        <TextInput
                          value={circleNameInput}
                          onChangeText={setCircleNameInput}
                          placeholder="Circle Name"
                          placeholderTextColor={colors.textMuted}
                          style={[styles.inputField, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                        />
                        <TextInput
                          value={circleTargetInput}
                          onChangeText={setCircleTargetInput}
                          placeholder="Target Count (e.g. 1000)"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="number-pad"
                          style={[styles.inputField, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                        />
                      </View>
                    )}

                    <View style={styles.rowButtons}>
                      <Pressable
                        disabled={circleLoading}
                        onPress={circleAction === 'create' ? handleCreateCircle : handleJoinCircle}
                        style={[styles.syncOptionBtn, { backgroundColor: colors.primary }]}
                      >
                        {circleLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.syncBtnText}>Confirm</Text>}
                      </Pressable>
                      <Pressable onPress={() => setCircleAction('none')} style={styles.syncCancelBtn}>
                        <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#3b82f620',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontFamily: FONTS.english,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: FONTS.english,
    fontSize: 13,
  },
  sectionTitle: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  prefLabel: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  prefDesc: {
    fontFamily: FONTS.english,
    fontSize: 12,
    lineHeight: 16,
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    gap: 6,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  segmentText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'center',
  },
  activeWindowBox: {
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  activeWindowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hourSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hourBtn: {
    padding: 4,
  },
  hourText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'center',
  },
  testAlertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 6,
    marginTop: 12,
    gap: 6,
  },
  testAlertText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '600',
  },
  backupButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backupBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backupBtnText: {
    color: '#fff',
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '700',
  },
  restoreBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  restoreBtnText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '700',
  },
  aboutText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    textAlign: 'center',
  },
  // GDrive OAuth Connection Elements
  connectBtn: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  connectionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disconnectBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.2,
  },
  // Community Sync Styles
  inputField: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: FONTS.english,
    fontSize: 14,
    marginBottom: 10,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  syncOptionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncOptionBtnOutline: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBtnText: {
    color: '#ffffff',
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '700',
  },
  syncBtnOutlineText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '700',
  },
  syncCancelBtn: {
    paddingHorizontal: 12,
  },
  syncForm: {
    marginTop: 8,
  },
  slotSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  slotChoiceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeSyncBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  activeSyncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  activeSyncTitle: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '800',
  },
  memberBadge: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  slotsScroll: {
    maxHeight: 180,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  juzSlotCard: {
    width: '31%',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  juzSlotNum: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '700',
  },
  juzSlotUser: {
    fontFamily: FONTS.english,
    fontSize: 10,
    marginTop: 2,
  },
  juzCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  circleProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  circleControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  circleBtnInc: {
    width: 60,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnReset: {
    width: 60,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberList: {
    maxHeight: 120,
    overflow: 'hidden',
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionBtnOutline: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenWrapper: {
    flex: 1,
  },
  floatingCommunityBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontFamily: FONTS.english,
    fontSize: 11,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 60,
  },
  premiumCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumCardTitle: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '800',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  memberSizeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 46,
  },
  giantCircleBtn: {
    width: 72,
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlayCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  dialogLarge: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    elevation: 10,
  },
  dialogTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#64748b55',
  },
  statLabel: {
    fontFamily: FONTS.english,
    fontSize: 15,
  },
  statValue: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '600',
  },
  largeInputField: {
    width: '100%',
    height: 180,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.english,
    fontSize: 11,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
});
