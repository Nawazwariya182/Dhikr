import React, { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, FlatList, StyleSheet, Text, Pressable, TextInput, Image, Animated } from 'react-native';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SurahTile } from '../components/SurahTile';
import { JuzTile } from '../components/JuzTile';
import { quranService } from '../services/quranService';
import { SurahMeta } from '../models/types';
import { FONTS } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';

const lightImage = require('../../assets/quran-kareem-light.png');
const darkImage = require('../../assets/quran-kareem-dark.png');

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const AnimatedModeButton: React.FC<{
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
      style={styles.modeButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
          styles.modeButtonText,
          { zIndex: 1, color: textColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { preferences, setHomeMode, colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const handleToggleMode = (mode: 'surah' | 'juz') => {
    setHomeMode(mode);
  };
  const allJuz = useMemo(() => quranService.getJuzList(), []);

  const surahs = useMemo(() => quranService.searchSurahs(query), [query]);

  const renderSurahItem = ({ item }: { item: SurahMeta }) => {
    return <SurahTile surah={item} onPress={() => navigation.navigate('Surah', { surahId: item.id })} colors={colors} />;
  };

  const renderJuzItem = ({ item }: { item: { juz: number; surah: number; ayah: number } }) => {
    const startSurah = quranService.getSurahMeta(item.surah);
    const label = `${startSurah?.name_translit ?? `Surah ${item.surah}`} ${item.surah}:${item.ayah}`;
    return <JuzTile juz={item.juz} startLabel={label} onPress={() => navigation.navigate('Surah', { juzNumber: item.juz })} colors={colors} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}> 
        <Image
          source={preferences.themeMode === 'light' ? lightImage : darkImage}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>The Noble Quran</Text>

        {/* Quick Prayer Tracker Floating Button */}
        <Pressable
          onPress={() => navigation.navigate('PrayerTracker')}
          style={({ pressed }) => [
            styles.prayerTrackerCircleButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed ? { opacity: 0.8 } : null
          ]}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.accent} />
        </Pressable>

        <View style={[styles.modeRow, { backgroundColor: colors.surface }]}> 
          <AnimatedModeButton
            active={preferences.homeMode === 'surah'}
            onPress={() => handleToggleMode('surah')}
            label="Surah"
            colors={colors}
          />
          <AnimatedModeButton
            active={preferences.homeMode === 'juz'}
            onPress={() => handleToggleMode('juz')}
            label="Juz"
            colors={colors}
          />
        </View>
      </View>

      {preferences.homeMode === 'surah' && (
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search surah by name or number"
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
          />
        </View>
      )}

      {preferences.homeMode === 'surah' ? (
        <FlatList
          data={surahs}
          renderItem={renderSurahItem}
          keyExtractor={(item) => `surah-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <FlatList
          data={allJuz}
          renderItem={renderJuzItem}
          keyExtractor={(item) => `juz-${item.juz}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  headerImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 400 / 200,
    maxHeight: 400,
    alignSelf: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontFamily: FONTS.english,
    fontSize: 14,
  },
  modeRow: {
    marginTop: 14,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    width: '100%',
    maxWidth: 280,
    zIndex: 5,
  },
  modeButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modeButtonText: {
    fontFamily: FONTS.english,
    fontWeight: '600',
  },
  searchBar: {
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontFamily: FONTS.english,
    fontSize: 15,
  },
  prayerTrackerCircleButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 44,
    height: 44,
    
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 20,
  },
});
