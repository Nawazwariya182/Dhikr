import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Vibration,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useSpiritualTimeTracker } from '../utils/useSpiritualTimeTracker';
import { FONTS } from '../utils/constants';

interface DhikrItem {
  id: string;
  arabic: string;
  translation: string;
  count: number;
  target: number; // 33, 99, 100, 0 (unlimited)
  isCustom?: boolean;
}

const PREDEFINED_DHIKR: DhikrItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    translation: 'Glory be to Allah',
    count: 0,
    target: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    translation: 'Praise be to Allah',
    count: 0,
    target: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    translation: 'Allah is the Greatest',
    count: 0,
    target: 34,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    translation: 'I seek forgiveness from Allah',
    count: 0,
    target: 100,
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    translation: 'There is no deity but Allah',
    count: 0,
    target: 100,
  },
  {
    id: 'subhanallah_bihamdihi',
    arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
    translation: 'Glory be to Allah and Praise is due to Him',
    count: 0,
    target: 100,
  },
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ',
    translation: 'There is no power or strength except with Allah',
    count: 0,
    target: 100,
  },
  {
    id: 'hasbunallah',
    arabic: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ',
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs',
    count: 0,
    target: 100,
  },
  {
    id: 'salawat',
    arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    translation: 'O Allah, send blessings upon Muhammad',
    count: 0,
    target: 100,
  },
];

export const DhikrScreen: React.FC = () => {
  useSpiritualTimeTracker('Remembrance');
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const [dhikrList, setDhikrList] = useState<DhikrItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('subhanallah');
  
  // Modals visibility state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [targetSheetVisible, setTargetSheetVisible] = useState(false);
  
  // Custom dialog confirmations state
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [targetId, setTargetId] = useState<string>('');

  // Custom toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Custom Dhikr creation fields
  const [newArabic, setNewArabic] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newTarget, setNewTarget] = useState('33');
  const [validationError, setValidationError] = useState('');
  
  // Custom Target fields
  const [customTargetInput, setCustomTargetInput] = useState('');
  const [showCustomTargetInput, setShowCustomTargetInput] = useState(false);
  const [targetSheetError, setTargetSheetError] = useState('');
  
  // Preferences
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Animated values for active tap ripple
  const tapScale = useRef(new Animated.Value(1)).current;
  const tapOpacity = useRef(new Animated.Value(0)).current;

  // Animated values for continuous idle breathing ripple
  const idleScale = useRef(new Animated.Value(1)).current;
  const idleOpacity = useRef(new Animated.Value(0.12)).current;

  // Active Dhikr Item
  const activeDhikr = dhikrList.find((item) => item.id === selectedId) || dhikrList[0];

  // Start continuous idle breathing ripple animation loop
  useEffect(() => {
    const startIdleLoop = () => {
      idleScale.setValue(1);
      idleOpacity.setValue(0.12);

      Animated.loop(
        Animated.parallel([
          Animated.timing(idleScale, {
            toValue: 1.65,
            duration: 2600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(idleOpacity, {
            toValue: 0,
            duration: 2600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startIdleLoop();
  }, []);

  // Load list on focus
  useFocusEffect(
    useCallback(() => {
      const loadDhikrData = async () => {
        try {
          const storedList = await AsyncStorage.getItem('@dhikr_app_list_v1');
          const storedVibration = await AsyncStorage.getItem('@dhikr_vibration_enabled');
          
          if (storedVibration !== null) {
            setVibrationEnabled(storedVibration === 'true');
          }

          if (storedList !== null) {
            setDhikrList(JSON.parse(storedList));
          } else {
            setDhikrList(PREDEFINED_DHIKR);
          }
        } catch (error) {
          console.error('Failed to load Dhikr list:', error);
          setDhikrList(PREDEFINED_DHIKR);
        }
      };
      loadDhikrData();
    }, [])
  );

  // Auto-dismiss toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const saveDhikrList = async (updatedList: DhikrItem[]) => {
    try {
      await AsyncStorage.setItem('@dhikr_app_list_v1', JSON.stringify(updatedList));
      setDhikrList(updatedList);
    } catch (error) {
      console.error('Failed to save Dhikr list:', error);
      setDhikrList(updatedList);
    }
  };

  const toggleVibration = async () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    try {
      await AsyncStorage.setItem('@dhikr_vibration_enabled', String(newValue));
    } catch (e) {
      console.warn(e);
    }
  };

  // Increment handler triggering fast tap ripple
  const handleIncrement = () => {
    if (!activeDhikr) return;

    // Reset tap animation values
    tapScale.setValue(1);
    tapOpacity.setValue(0.35); // faded tap ripple

    // Animate tap ripple
    Animated.parallel([
      Animated.timing(tapScale, {
        toValue: 1.75,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(tapOpacity, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const updatedList = dhikrList.map((item) => {
      if (item.id === activeDhikr.id) {
        const nextCount = item.count + 1;
        
        if (vibrationEnabled) {
          if (item.target > 0 && nextCount === item.target) {
            Vibration.vibrate([0, 120, 80, 180]);
          } else {
            Vibration.vibrate(60);
          }
        }

        // Custom toast notification when target completed
        if (item.target > 0 && nextCount === item.target) {
          setToastMessage(`Target Completed! 🎉 You have completed ${item.target} repetitions.`);
          setShowToast(true);
        }

        return { ...item, count: nextCount };
      }
      return item;
    });

    saveDhikrList(updatedList);
  };

  // Trigger reset confirmation modal
  const promptReset = (id: string) => {
    setTargetId(id);
    setConfirmResetVisible(true);
  };

  const confirmReset = () => {
    const updatedList = dhikrList.map((item) => {
      if (item.id === targetId) {
        return { ...item, count: 0 };
      }
      return item;
    });
    saveDhikrList(updatedList);
    setConfirmResetVisible(false);
  };

  // Trigger delete confirmation modal
  const promptDelete = (id: string) => {
    setTargetId(id);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = () => {
    const updatedList = dhikrList.filter((item) => item.id !== targetId);
    if (selectedId === targetId) {
      setSelectedId(PREDEFINED_DHIKR[0].id);
    }
    saveDhikrList(updatedList);
    setConfirmDeleteVisible(false);
  };

  const handleAddCustom = () => {
    setValidationError('');
    if (!newArabic.trim()) {
      setValidationError('Please enter the Arabic phrase.');
      return;
    }

    const targetVal = parseInt(newTarget, 10);
    if (isNaN(targetVal) || targetVal < 0) {
      setValidationError('Please enter a valid count target.');
      return;
    }

    const newItem: DhikrItem = {
      id: `custom_${Date.now()}`,
      arabic: newArabic.trim(),
      translation: newTranslation.trim() || 'Custom Supplication',
      count: 0,
      target: targetVal,
      isCustom: true,
    };

    const updatedList = [...dhikrList, newItem];
    saveDhikrList(updatedList);
    setSelectedId(newItem.id);
    setNewArabic('');
    setNewTranslation('');
    setNewTarget('33');
    setCustomModalVisible(false);
    setDropdownVisible(false);
  };

  const setQuickLimit = (limit: number) => {
    if (!activeDhikr) return;
    const updatedList = dhikrList.map((item) => {
      if (item.id === activeDhikr.id) {
        return { ...item, target: limit };
      }
      return item;
    });
    saveDhikrList(updatedList);
    setTargetSheetVisible(false);
  };

  const handleSetCustomTarget = () => {
    setTargetSheetError('');
    const targetVal = parseInt(customTargetInput, 10);
    if (isNaN(targetVal) || targetVal < 0) {
      setTargetSheetError('Please enter a valid target count.');
      return;
    }
    setQuickLimit(targetVal);
    setCustomTargetInput('');
    setShowCustomTargetInput(false);
    setTargetSheetVisible(false);
  };

  if (!activeDhikr) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  const progressRatio = activeDhikr.target > 0 ? activeDhikr.count / activeDhikr.target : 0;
  const progressPercent = Math.min(Math.round(progressRatio * 100), 100);

  return (
    <Pressable 
      onPress={handleIncrement} 
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}
      android_ripple={{ color: colors.primary + '10', borderless: false }}
    >
      {/* Slide-Down Completion Toast */}
      {showToast && (
        <View style={[styles.toastContainer, { backgroundColor: colors.primary }]} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={20} color={colors.background} />
          <Text style={[styles.toastText, { color: colors.background }]}>
            {toastMessage}
          </Text>
        </View>
      )}

      {/* Main Display Area (Atmospheric glassmorphic design) */}
      <View style={styles.displayArea} pointerEvents="none">
        
        {/* Floating Calligraphy Card */}
        <View style={[styles.calligraphyCard, { backgroundColor: colors.surface , borderColor: colors.border }]}>
          <Text style={[styles.arabicDisplay, { color: colors.textPrimary, fontFamily: FONTS.arabic }]}>
            {activeDhikr.arabic}
          </Text>
          <Text style={[styles.translationDisplay, { color: colors.textSecondary }]}>
            {activeDhikr.translation}
          </Text>
        </View>

        {/* Bouncing / Rippling Circle Counter Section */}
        <View style={styles.circleContainer}>
          
          {/* Subtle Ambient Golden Glow (Pulse effect behind) */}
          <View style={[styles.ambientGlow, { backgroundColor: colors.primary + '05' }]} />

          {/* Continuous Idle breathing ripple (Faded background pulse) */}
          <Animated.View
            style={[
              styles.idleRipple,
              {
                borderColor: colors.primary,
                transform: [{ scale: idleScale }],
                opacity: idleOpacity,
              },
            ]}
          />

          {/* Fast Tap concentric ripple (Expanding circle border on tap) */}
          <Animated.View
            style={[
              styles.tapRipple,
              {
                borderColor: colors.primary,
                transform: [{ scale: tapScale }],
                opacity: tapOpacity,
              },
            ]}
          />

          {/* Main Static glassmorphic circle */}
          <View
            style={[
              styles.mainCircle,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.countDigit, { color: colors.primary }]}>
              {activeDhikr.count}
            </Text>
            
            {activeDhikr.target > 0 ? (
              <Text style={[styles.targetLabel, { color: colors.textMuted }]}>
                / {activeDhikr.target}
              </Text>
            ) : (
              <Text style={[styles.targetLabel, { color: colors.textMuted }]}>
                ∞ Mode
              </Text>
            )}

            {/* {activeDhikr.target > 0 && (
              <Text style={[styles.percentLabel, { color: colors.primary }]}>
                {progressPercent}%
              </Text>
            )} */}
          </View>
        </View>

        <Text style={[styles.tapInstructions, { color: colors.textMuted }]}>
          Tap anywhere to count
        </Text>
      </View>

      {/* iOS-Style Translucent Bottom Control Dock */}
      <View style={styles.bottomDockContainer} pointerEvents="box-none">
        <View style={[styles.controlDock, { backgroundColor: colors.surface + '75', borderColor: colors.border }]} pointerEvents="box-none">
          
          {/* Active Dhikr Selector Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setDropdownVisible(true);
            }}
            style={[styles.dockBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
            <Text numberOfLines={1} style={[styles.dockBtnText, { color: colors.textPrimary }]}>
              Dhikr List
            </Text>
          </Pressable>

          {/* Target Limit Selector Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setTargetSheetError('');
              setShowCustomTargetInput(false);
              setTargetSheetVisible(true);
            }}
            style={[styles.dockBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons name="flag-outline" size={18} color={colors.primary} />
            <Text style={[styles.dockBtnText, { color: colors.textPrimary }]}>
              {activeDhikr.target > 0 ? `${activeDhikr.target}` : '∞'}
            </Text>
          </Pressable>

          {/* Reset Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              promptReset(activeDhikr.id);
            }}
            style={[styles.dockActionBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons name="refresh-outline" size={20} color={colors.error} />
          </Pressable>

          {/* Sound/Vibration Toggle */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              toggleVibration();
            }}
            style={[styles.dockActionBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons
              name={vibrationEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
              size={20}
              color={vibrationEnabled ? colors.primary : colors.textMuted}
            />
          </Pressable>
        </View>
      </View>

      {/* Supplication Dropdown Selector (Modal Sheet) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setDropdownVisible(false)} />
          
          <View style={[styles.bottomSheetContent, { backgroundColor: colors.surface }]}>
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>Choose Supplication</Text>
              <Pressable onPress={() => setDropdownVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <FlatList
              data={dhikrList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.bottomSheetList}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedId;
                return (
                  <View style={[styles.itemRowWrapper, { borderBottomColor: colors.border }]}>
                    <Pressable
                      onPress={() => {
                        setSelectedId(item.id);
                        setDropdownVisible(false);
                      }}
                      style={[
                        styles.bottomSheetItemBtn,
                        isSelected && { backgroundColor: colors.primary + '10' }
                      ]}
                    >
                      <View style={styles.itemTextLeft}>
                        <Text style={[styles.itemArabic, { color: colors.textPrimary, fontFamily: FONTS.arabic }]}>
                          {item.arabic}
                        </Text>
                        <Text style={[styles.itemTranslation, { color: colors.textSecondary }]}>
                          {item.translation}
                        </Text>
                      </View>
                      
                      <View style={styles.itemProgressRight}>
                        <Text style={[styles.itemProgressText, { color: colors.primary }]}>
                          {item.count}{item.target > 0 ? `/${item.target}` : ' (∞)'}
                        </Text>
                        
                        {item.isCustom ? (
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              promptDelete(item.id);
                            }}
                            style={styles.deleteMiniBtn}
                          >
                            <Ionicons name="trash-outline" size={16} color={colors.error} />
                          </Pressable>
                        ) : (
                          <View style={{ width: 24 }} />
                        )}
                      </View>
                    </Pressable>
                  </View>
                );
              }}
              ListFooterComponent={
                <Pressable
                  onPress={() => {
                    setValidationError('');
                    setCustomModalVisible(true);
                  }}
                  style={[styles.addCustomTriggerBtn, { borderColor: colors.primary }]}
                >
                  <Ionicons name="add" size={20} color={colors.primary} />
                  <Text style={[styles.addCustomTriggerText, { color: colors.primary }]}>
                    Add Custom Supplication
                  </Text>
                </Pressable>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Target Count Dropdown Selector (Bottom Sheet Modal) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={targetSheetVisible}
        onRequestClose={() => setTargetSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setTargetSheetVisible(false)} />
          
          <View style={[styles.bottomSheetContent, { backgroundColor: colors.surface }]}>
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>Select Target Limit</Text>
              <Pressable onPress={() => setTargetSheetVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            {targetSheetError ? (
              <View style={[styles.validationBox, { backgroundColor: colors.error + '15', borderColor: colors.error, marginBottom: 12 }]}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={[styles.validationText, { color: colors.error }]}>{targetSheetError}</Text>
              </View>
            ) : null}

            <View style={styles.targetSheetBody}>
              <View style={styles.targetGrid}>
                <Pressable
                  onPress={() => setQuickLimit(33)}
                  style={[styles.targetGridItem, activeDhikr.target === 33 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>33 Reps</Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuickLimit(99)}
                  style={[styles.targetGridItem, activeDhikr.target === 99 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>99 Reps</Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuickLimit(100)}
                  style={[styles.targetGridItem, activeDhikr.target === 100 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>100 Reps</Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuickLimit(0)}
                  style={[styles.targetGridItem, activeDhikr.target === 0 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>Unlimited (∞)</Text>
                </Pressable>
              </View>

              {!showCustomTargetInput ? (
                <Pressable
                  onPress={() => setShowCustomTargetInput(true)}
                  style={[styles.customTargetTrigger, { borderColor: colors.primary }]}
                >
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                  <Text style={[styles.customTargetTriggerText, { color: colors.primary }]}>
                    Set Custom Target
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.customTargetInputRow}>
                  <TextInput
                    style={[
                      styles.customTargetTextInput,
                      {
                        backgroundColor: colors.background,
                        color: colors.textPrimary,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder="e.g. 500, 1000"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={customTargetInput}
                    onChangeText={setCustomTargetInput}
                    autoFocus
                  />
                  <Pressable
                    onPress={handleSetCustomTarget}
                    style={[styles.customTargetSetBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.customTargetSetBtnText, { color: colors.background }]}>Set</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Supplication Creation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={customModalVisible}
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setCustomModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Custom Dhikr</Text>
              <Pressable onPress={() => setCustomModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              {validationError ? (
                <View style={[styles.validationBox, { backgroundColor: colors.error + '15', borderColor: colors.error }]}>
                  <Ionicons name="alert-circle" size={16} color={colors.error} />
                  <Text style={[styles.validationText, { color: colors.error }]}>{validationError}</Text>
                </View>
              ) : null}

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Arabic Text</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    fontFamily: FONTS.arabic,
                    fontSize: 20,
                    textAlign: 'right',
                  },
                ]}
                placeholder="مثال: سُبْحَانَ ٱللَّٰهِ"
                placeholderTextColor={colors.textMuted}
                value={newArabic}
                onChangeText={setNewArabic}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Translation / Name</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g. Glory be to Allah"
                placeholderTextColor={colors.textMuted}
                value={newTranslation}
                onChangeText={setNewTranslation}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Target Repetitions (0 for unlimited)</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g. 33, 100"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={newTarget}
                onChangeText={setNewTarget}
              />

              <Pressable
                onPress={handleAddCustom}
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.saveBtnText, { color: colors.background }]}>Add Supplication</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Confirmation Alert Modal: Reset */}
      <Modal
        transparent
        visible={confirmResetVisible}
        animationType="fade"
        onRequestClose={() => setConfirmResetVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.confirmIconContainer, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="refresh-outline" size={28} color={colors.error} />
            </View>
            
            <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>Reset Counter?</Text>
            <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>
              Are you sure you want to reset this supplication counter back to 0?
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                onPress={() => setConfirmResetVisible(false)}
                style={[styles.confirmBtn, styles.confirmBtnCancel, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.textPrimary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmReset}
                style={[styles.confirmBtn, { backgroundColor: colors.error }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.white }]}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Confirmation Alert Modal: Delete */}
      <Modal
        transparent
        visible={confirmDeleteVisible}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.confirmIconContainer, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="trash-outline" size={28} color={colors.error} />
            </View>

            <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>Delete Supplication?</Text>
            <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>
              This custom supplication and all its progress will be permanently deleted.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                onPress={() => setConfirmDeleteVisible(false)}
                style={[styles.confirmBtn, styles.confirmBtnCancel, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.textPrimary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmDelete}
                style={[styles.confirmBtn, { backgroundColor: colors.error }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.white }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  toastContainer: {
    position: 'absolute',
    top: 25,
    left: 20,
    right: 20,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  topActionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 8,
    zIndex: 10,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: '85%',
    gap: 8,
  },
  dropdownBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  displayArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  calligraphyCard: {
    width: '100%',
    top: -90,
    borderRadius: 24,
    borderWidth: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  arabicDisplay: {
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 6,
  },
  translationDisplay: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  circleContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  idleRipple: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 150,
    borderWidth: 1.5,
  },
  tapRipple: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 150,
    borderWidth: 3,
  },
  mainCircle: {
    width: 250,
    height: 250,
    borderRadius: 150,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  countDigit: {
    fontSize: 67,
    fontWeight: '900',
    lineHeight: 56,
  },
  targetLabel: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  percentLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tapInstructions: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    top: 25,
  },
  bottomDockContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 26,
    zIndex: 10,
  },
  controlDock: {
    flexDirection: 'row',
    borderRadius: 22,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dockBtn: {
    flex: 2.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 14,
    gap: 6,
    paddingHorizontal: 10,
  },
  dockBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dockActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  bottomSheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '75%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  bottomSheetList: {
    paddingBottom: 24,
  },
  itemRowWrapper: {
    borderBottomWidth: 1,
  },
  bottomSheetItemBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  itemTextLeft: {
    flex: 1,
    paddingRight: 10,
  },
  itemArabic: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'left',
  },
  itemTranslation: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'left',
  },
  itemProgressRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteMiniBtn: {
    padding: 6,
  },
  addCustomTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    marginTop: 18,
    gap: 6,
  },
  addCustomTriggerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  targetSheetBody: {
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  targetGridItem: {
    flex: 1,
    minWidth: '45%',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetGridText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customTargetTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
  },
  customTargetTriggerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customTargetInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  customTargetTextInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  customTargetSetBtn: {
    width: 70,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTargetSetBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalBody: {
    gap: 16,
  },
  validationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  validationText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: -8,
  },
  textInput: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  saveBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  confirmIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnCancel: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
