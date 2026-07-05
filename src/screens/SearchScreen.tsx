import React, { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { quranService } from '../services/quranService';
import { Ayah } from '../models/types';
import { FONTS, getArabicFontFamily } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { preferences, colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Ayah[]>([]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (text.length >= 2) {
      const found = quranService.searchVerses(text).slice(0, 50);
      setResults(found);
    } else {
      setResults([]);
    }
  }, []);

  const renderItem = ({ item }: { item: Ayah }) => {
    const surahMeta = quranService.getSurahMeta(item.surah);
    return (
      <Pressable
        style={({ pressed }) => [styles.resultItem, pressed && styles.pressed]}
        onPress={() => navigation.navigate('Surah', { surahId: item.surah, initialAyah: item.ayah })}
      >
        <View style={styles.resultHeader}>
          <Text style={[styles.resultSurah, { color: colors.primary }]}> 
            {surahMeta?.name_translit} {item.surah}:{item.ayah}
          </Text>
        </View>
        <Text style={[styles.resultArabic, { color: colors.textPrimary, fontFamily: getArabicFontFamily(preferences.arabicFont) }]} numberOfLines={1}>
          {item.arabic}
        </Text>
        <Text style={[styles.resultEnglish, { color: colors.textSecondary }, preferences.translationLanguage === 'urdu' ? styles.urduLine : null]} numberOfLines={2}>
          {preferences.translationLanguage === 'urdu' ? item.urdu : item.english}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}> 
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder="Search in Arabic or English..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {results.length === 0 && query.length >= 2 && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No results found</Text>
        </View>
      )}

      {results.length === 0 && query.length < 2 && (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Search the Quran by Arabic text or English translation
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.surah}:${item.ayah}`}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    flex: 1,
    fontFamily: FONTS.english,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
    paddingVertical: 0,
  },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  pressed: {
    backgroundColor: '#1e293b',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultSurah: {
    fontFamily: FONTS.english,
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '600',
  },
  resultArabic: {
    fontFamily: FONTS.arabic,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  resultEnglish: {
    fontFamily: FONTS.english,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  urduLine: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: FONTS.english,
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
