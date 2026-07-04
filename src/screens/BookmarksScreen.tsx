import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { bookmarkService } from '../services/bookmarkService';
import { quranService } from '../services/quranService';
import { Bookmark } from '../models/types';
import { FONTS } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const BookmarksScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppPreferences();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useFocusEffect(
    useCallback(() => {
      setBookmarks(bookmarkService.getBookmarks());
    }, [])
  );

  const handleRemove = async (surah: number, ayah: number) => {
    await bookmarkService.removeBookmark(surah, ayah);
    setBookmarks(bookmarkService.getBookmarks());
  };

  const renderItem = ({ item }: { item: Bookmark }) => {
    const surahMeta = quranService.getSurahMeta(item.surah);
    const isFromJuz = item.juzNumber !== undefined;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          { borderBottomColor: colors.border },
          pressed ? { backgroundColor: colors.surface } : null,
        ]}
        onPress={() => {
          if (isFromJuz) {
            navigation.navigate('Surah', { juzNumber: item.juzNumber, initialAyah: item.ayah });
          } else {
            navigation.navigate('Surah', { surahId: item.surah, initialAyah: item.ayah });
          }
        }}
      >
        <View style={styles.itemContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accent + '15' }]}>
            <Ionicons name="bookmark" size={20} color={colors.accent} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.surahName, { color: colors.textPrimary }]}>
              {surahMeta?.name_translit ?? `Surah ${item.surah}`}
            </Text>
            <Text style={[styles.ayahInfo, { color: colors.textMuted }]}>
              {isFromJuz ? `Juz ${item.juzNumber} • ` : ''}Surah {item.surah}, Ayah {item.ayah}
            </Text>
          </View>
          <Pressable onPress={() => handleRemove(item.surah, item.ayah)} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No bookmarks yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
            Tap the bookmark icon on any verse to save it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.surah}:${item.ayah}`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  surahName: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ayahInfo: {
    fontFamily: FONTS.english,
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.english,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontFamily: FONTS.english,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
