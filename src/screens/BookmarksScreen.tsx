import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { bookmarkService } from '../services/bookmarkService';
import { quranService } from '../services/quranService';
import { Bookmark, BookmarkFolder } from '../models/types';
import { FONTS, SIZES } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const BookmarksScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null); // null = root/normal
  const [primaryFolderId, setPrimaryFolderId] = useState<string | null>(null);

  // Folder modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState('');
  const [renameFolderName, setRenameFolderName] = useState('');

  // Move action sheet state
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [activeBookmarkToMove, setActiveBookmarkToMove] = useState<Bookmark | null>(null);

  const loadData = useCallback(() => {
    bookmarkService.load().then(async () => {
      setBookmarks(bookmarkService.getBookmarks());
      setFolders(bookmarkService.getFolders());
      const pId = await bookmarkService.getPrimaryFolderId();
      setPrimaryFolderId(pId);
    });
  }, []);

  const handleTogglePrimaryFolder = async (folderId: string) => {
    const isPrimary = primaryFolderId === folderId;
    const nextId = isPrimary ? null : folderId;
    await bookmarkService.setPrimaryFolderId(nextId);
    setPrimaryFolderId(nextId);
    
    // Find active folder name
    const folder = folders.find(f => f.id === folderId);
    Alert.alert(
      isPrimary ? 'Widget Tracking Cleared' : 'Primary Widget Folder',
      isPrimary
        ? 'Resume Reading and Juz Progress widgets will now track your general reading history.'
        : `"${folder?.name || 'Folder'}" is set as the primary widget folder. The Resume Reading and Juz Progress widgets will now track bookmarks in this folder.`
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await bookmarkService.createFolder(newFolderName.trim());
    setNewFolderName('');
    setCreateModalVisible(false);
    loadData();
  };

  const handleRenameFolder = async () => {
    if (!renameFolderName.trim() || !renameFolderId) return;
    await bookmarkService.renameFolder(renameFolderId, renameFolderName.trim());
    setRenameFolderName('');
    setRenameFolderId('');
    setRenameModalVisible(false);
    loadData();
  };

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    Alert.alert(
      'Delete Folder',
      `Are you sure you want to delete the folder "${folderName}"? Bookmarks inside will be moved back to the root list.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await bookmarkService.deleteFolder(folderId);
            if (selectedFolderId === folderId) {
              setSelectedFolderId(null);
            }
            loadData();
          },
        },
      ]
    );
  };

  const handleRemoveBookmark = async (surah: number, ayah: number) => {
    await bookmarkService.removeBookmark(surah, ayah);
    loadData();
  };

  const handleMoveBookmark = async (targetFolderId: string | null) => {
    if (!activeBookmarkToMove) return;
    await bookmarkService.moveBookmark(
      activeBookmarkToMove.surah,
      activeBookmarkToMove.ayah,
      targetFolderId
    );
    setMoveModalVisible(false);
    setActiveBookmarkToMove(null);
    loadData();
  };

  // Filter bookmarks by currently opened folder
  const currentBookmarks = bookmarks.filter((b) =>
    selectedFolderId === null ? b.folderId === undefined : b.folderId === selectedFolderId
  );

  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  const renderFolderItem = ({ item }: { item: BookmarkFolder }) => {
    const count = bookmarks.filter((b) => b.folderId === item.id).length;
    const isPrimary = item.id === primaryFolderId;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.folderCard,
          { backgroundColor: colors.surface, borderColor: isPrimary ? '#f59e0b' : colors.border },
          pressed ? { opacity: 0.8 } : null,
        ]}
        onPress={() => setSelectedFolderId(item.id)}
      >
        <View style={styles.folderHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="folder" size={42} color={colors.primary} />
            {isPrimary && (
              <Ionicons name="star" size={18} color="#f59e0b" style={{ marginLeft: 6 }} />
            )}
          </View>
          <View style={styles.folderActions}>
            <Pressable
              onPress={() => {
                setRenameFolderId(item.id);
                setRenameFolderName(item.name);
                setRenameModalVisible(true);
              }}
              hitSlop={6}
              style={styles.folderActionBtn}
            >
              <Ionicons name="pencil-outline" size={16} color={colors.textMuted} />
            </Pressable>
            <Pressable
              onPress={() => handleDeleteFolder(item.id, item.name)}
              hitSlop={6}
              style={styles.folderActionBtn}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
            </Pressable>
          </View>
        </View>
        <Text style={[styles.folderName, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.folderCount, { color: colors.textMuted }]}>
          {count} {count === 1 ? 'verse' : 'verses'}
        </Text>
      </Pressable>
    );
  };

  const renderBookmarkItem = ({ item }: { item: Bookmark }) => {
    const surahMeta = quranService.getSurahMeta(item.surah);
    const isFromJuz = item.juzNumber !== undefined;
    return (
      <View style={[styles.bookmarkRow, { borderBottomColor: colors.border }]}>
        <Pressable
          style={styles.bookmarkMainPressable}
          onPress={() => {
            if (isFromJuz) {
              navigation.navigate('Surah', { juzNumber: item.juzNumber, initialAyah: item.ayah });
            } else {
              navigation.navigate('Surah', { surahId: item.surah, initialAyah: item.ayah });
            }
          }}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.accent + '15' }]}>
            <Ionicons name="bookmark" size={18} color={colors.accent} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.surahName, { color: colors.textPrimary }]}>
              {surahMeta?.name_translit ?? `Surah ${item.surah}`}
            </Text>
            <Text style={[styles.ayahInfo, { color: colors.textMuted }]}>
              {isFromJuz ? `Juz ${item.juzNumber} • ` : ''}Surah {item.surah}, Ayah {item.ayah}
            </Text>
          </View>
        </Pressable>

        <View style={styles.rowActions}>
          <Pressable
            onPress={() => {
              setActiveBookmarkToMove(item);
              setMoveModalVisible(true);
            }}
            hitSlop={8}
            style={styles.rowActionBtn}
          >
            <Ionicons name="folder-open-outline" size={18} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => handleRemoveBookmark(item.surah, item.ayah)}
            hitSlop={8}
            style={styles.rowActionBtn}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      {/* Root View: Folders grid + normal bookmarks */}
      {selectedFolderId === null ? (
        <View style={styles.flexOne}>
          {/* Folders Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Folders</Text>
            <Pressable
              onPress={() => setCreateModalVisible(true)}
              style={[styles.createFolderBtn, { borderColor: colors.primary }]}
            >
              <Ionicons name="folder-outline" size={16} color={colors.primary} />
              <Text style={[styles.createFolderText, { color: colors.primary }]}>New Folder</Text>
            </Pressable>
          </View>

          {folders.length > 0 ? (
            <View style={styles.foldersContainer}>
              <FlatList
                data={folders}
                renderItem={renderFolderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.foldersList}
              />
            </View>
          ) : (
            <View style={[styles.noFoldersBox, { backgroundColor: colors.surface + '40', borderColor: colors.border }]}>
              <Text style={[styles.noFoldersText, { color: colors.textMuted }]}>
                No folders created. Group bookmarks for organized reading.
              </Text>
            </View>
          )}

          {/* Root Bookmarks Section */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, paddingHorizontal: 16, marginTop: 12 }]}>
            General Bookmarks
          </Text>

          {currentBookmarks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No general bookmarks</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                Tap the bookmark icon in Quran reader. Move them to folders above to stay organized.
              </Text>
            </View>
          ) : (
            <FlatList
              data={currentBookmarks}
              renderItem={renderBookmarkItem}
              keyExtractor={(item) => `${item.surah}:${item.ayah}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.bookmarksList}
            />
          )}
        </View>
      ) : (
        /* Inside Folder View */
        <View style={styles.flexOne}>
          {/* Folder Header Banner */}
          <View style={[styles.folderViewHeader, { borderBottomColor: colors.border }]}>
            <Pressable
              onPress={() => setSelectedFolderId(null)}
              style={styles.backButton}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.folderViewInfo}>
              <Text style={[styles.folderViewTitle, { color: colors.textPrimary }]}>
                {activeFolder?.name}
              </Text>
              <Text style={[styles.folderViewSubtitle, { color: colors.textMuted }]}>
                {currentBookmarks.length} {currentBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
              </Text>
            </View>
            <View style={styles.folderViewActions}>
              <Pressable
                onPress={() => handleTogglePrimaryFolder(activeFolder!.id)}
                style={styles.folderViewActionBtn}
                hitSlop={8}
              >
                <Ionicons
                  name={primaryFolderId === activeFolder?.id ? "star" : "star-outline"}
                  size={20}
                  color={primaryFolderId === activeFolder?.id ? "#f59e0b" : colors.textPrimary}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  if (activeFolder) {
                    setRenameFolderId(activeFolder.id);
                    setRenameFolderName(activeFolder.name);
                    setRenameModalVisible(true);
                  }
                }}
                style={styles.folderViewActionBtn}
                hitSlop={8}
              >
                <Ionicons name="pencil-outline" size={20} color={colors.textPrimary} />
              </Pressable>
              <Pressable
                onPress={() => {
                  if (activeFolder) {
                    handleDeleteFolder(activeFolder.id, activeFolder.name);
                  }
                }}
                style={styles.folderViewActionBtn}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </Pressable>
            </View>
          </View>

          {/* Bookmarks inside Folder */}
          {currentBookmarks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Folder is empty</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                Go back to General Bookmarks and tap the folder icon on any verse to move it here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={currentBookmarks}
              renderItem={renderBookmarkItem}
              keyExtractor={(item) => `${item.surah}:${item.ayah}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.bookmarksList}
            />
          )}
        </View>
      )}

      {/* CREATE FOLDER MODAL */}
      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create New Folder</Text>
            <TextInput
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="e.g. Daily Recitations, Hifz Revision"
              placeholderTextColor={colors.textMuted}
              style={[styles.modalInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
              maxLength={30}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setCreateModalVisible(false)} style={styles.modalCancelBtn}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleCreateFolder} style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* RENAME FOLDER MODAL */}
      <Modal visible={renameModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Rename Folder</Text>
            <TextInput
              value={renameFolderName}
              onChangeText={setRenameFolderName}
              style={[styles.modalInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
              maxLength={30}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setRenameModalVisible(false)} style={styles.modalCancelBtn}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleRenameFolder} style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MOVE BOOKMARK MODAL */}
      <Modal visible={moveModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border, maxHeight: '60%' }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary, marginBottom: 12 }]}>Move Bookmark To...</Text>
            <ScrollView style={{ width: '100%' }}>
              {/* Root folder option */}
              <Pressable
                onPress={() => handleMoveBookmark(null)}
                style={[
                  styles.moveOption,
                  { borderBottomColor: colors.border },
                  activeBookmarkToMove?.folderId === undefined
                    ? { backgroundColor: colors.primary + '15' }
                    : null,
                ]}
              >
                <Ionicons name="folder-outline" size={20} color={colors.textPrimary} />
                <Text style={[styles.moveOptionText, { color: colors.textPrimary }]}>Root (General Bookmarks)</Text>
                {activeBookmarkToMove?.folderId === undefined && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} style={{ marginLeft: 'auto' }} />
                )}
              </Pressable>

              {/* Other folders */}
              {folders.map((f) => (
                <Pressable
                  key={f.id}
                  onPress={() => handleMoveBookmark(f.id)}
                  style={[
                    styles.moveOption,
                    { borderBottomColor: colors.border },
                    activeBookmarkToMove?.folderId === f.id
                      ? { backgroundColor: colors.primary + '15' }
                      : null,
                  ]}
                >
                  <Ionicons name="folder" size={20} color={colors.primary} />
                  <Text style={[styles.moveOptionText, { color: colors.textPrimary }]}>{f.name}</Text>
                  {activeBookmarkToMove?.folderId === f.id && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} style={{ marginLeft: 'auto' }} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              onPress={() => {
                setMoveModalVisible(false);
                setActiveBookmarkToMove(null);
              }}
              style={[styles.modalCancelBtn, { width: '100%', marginTop: 16 }]}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Quiz Floating Action Button */}
      <Pressable
        onPress={() => navigation.navigate('Quiz')}
        style={({ pressed }) => [
          styles.quizFab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Ionicons name="sparkles-outline" size={24} color="#fff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '800',
  },
  createFolderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  createFolderText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '700',
  },
  foldersContainer: {
    height: 145,
    marginBottom: 8,
  },
  foldersList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  folderCard: {
    width: 180,
    height: 130,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderActions: {
    flexDirection: 'row',
    gap: 6,
  },
  folderActionBtn: {
    padding: 4,
  },
  folderName: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  folderCount: {
    fontFamily: FONTS.english,
    fontSize: 12,
  },
  noFoldersBox: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 8,
  },
  noFoldersText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    textAlign: 'center',
  },
  bookmarksList: {
    paddingBottom: 30,
  },
  bookmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bookmarkMainPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  surahName: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  ayahInfo: {
    fontFamily: FONTS.english,
    fontSize: 13,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowActionBtn: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
  },
  // Inside Folder header styling
  folderViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  folderViewInfo: {
    flex: 1,
  },
  folderViewTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '800',
  },
  folderViewSubtitle: {
    fontFamily: FONTS.english,
    fontSize: 12,
    marginTop: 2,
  },
  folderViewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  folderViewActionBtn: {
    padding: 2,
  },
  // Modal dialog styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: FONTS.english,
    fontSize: 14,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
    gap: 12,
  },
  moveOptionText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '600',
  },
  quizFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
});
