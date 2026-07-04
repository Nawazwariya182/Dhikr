import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable, TextInput, Image } from 'react-native';
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

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { preferences, setHomeMode, colors } = useAppPreferences();
  const [query, setQuery] = useState('');
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Pressable
            onPress={() => setHomeMode('surah')}
            style={[
              styles.modeButton,
              preferences.homeMode === 'surah' ? { backgroundColor: colors.primary } : null,
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: preferences.homeMode === 'surah' ? colors.white : colors.textSecondary },
              ]}
            >
              Surah
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setHomeMode('juz')}
            style={[
              styles.modeButton,
              preferences.homeMode === 'juz' ? { backgroundColor: colors.primary } : null,
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: preferences.homeMode === 'juz' ? colors.white : colors.textSecondary },
              ]}
            >
              Juz
            </Text>
          </Pressable>
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
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          scrollEventThrottle={16}
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          windowSize={10}
        />
      ) : (
        <FlatList
          data={allJuz}
          renderItem={renderJuzItem}
          keyExtractor={(item) => `juz-${item.juz}`}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          scrollEventThrottle={16}
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          windowSize={10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerImage: {
    width: 390,
    height: 170,
    alignSelf: 'center',
    marginBottom: 8,
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
    top: 20,
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
  },
});
