import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bookmarkService } from '../services/bookmarkService';
import { BookmarkFolder } from '../models/types';
import { FONTS } from '../utils/constants';

interface BookmarkDrawerProps {
  visible: boolean;
  onClose: () => void;
  surahId: number;
  ayahNumber: number;
  juzNumber?: number;
  onBookmarkSaved: (savedType: 'separate' | 'replaced' | 'folder', folderName?: string) => void;
  colors: any;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  visible,
  onClose,
  surahId,
  ayahNumber,
  juzNumber,
  onBookmarkSaved,
  colors,
}) => {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    if (visible) {
      bookmarkService.load().then(() => {
        setFolders(bookmarkService.getFolders());
      });
      setShowNewFolderInput(false);
      setNewFolderName('');
    }
  }, [visible]);

  const handleAddSeparate = async () => {
    await bookmarkService.addBookmark(surahId, ayahNumber, juzNumber);
    onBookmarkSaved('separate');
    onClose();
  };

  const handleReplaceLast = async () => {
    await bookmarkService.replaceLastBookmark(surahId, ayahNumber, juzNumber);
    onBookmarkSaved('replaced');
    onClose();
  };

  const handleAddToFolder = async (folderId: string, folderName: string) => {
    try {
      await bookmarkService.addBookmark(surahId, ayahNumber, juzNumber, folderId);
      onBookmarkSaved('folder', folderName);
      onClose();
    } catch (err: any) {
      Alert.alert('Cannot Save Here', err?.message || 'This bookmark cannot be added to this folder');
    }
  };

  const handleCreateFolderAndAdd = async () => {
    if (!newFolderName.trim()) return;
    const newFolder = await bookmarkService.createFolder(newFolderName.trim());
    await bookmarkService.addBookmark(surahId, ayahNumber, juzNumber, newFolder.id);
    onBookmarkSaved('folder', newFolder.name);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        
        <View style={[styles.drawerCard, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {/* Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Bookmark Ayah {surahId}:{ayahNumber}
            </Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Quick Actions */}
            <View style={styles.section}>
              <Pressable
                onPress={handleReplaceLast}
                style={({ pressed }) => [
                  styles.optionCard,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>Replace Last Bookmark</Text>
                  <Text style={[styles.optionDesc, { color: colors.textMuted }]}>
                    Updates your last bookmark position to this Ayah. Great for tracking reading progress.
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleAddSeparate}
                style={({ pressed }) => [
                  styles.optionCard,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: colors.accent + '15' }]}>
                  <Ionicons name="bookmark-outline" size={20} color={colors.accent} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>Add Separately</Text>
                  <Text style={[styles.optionDesc, { color: colors.textMuted }]}>
                    Saves this as a separate general bookmark.
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Folders Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Save to Folder</Text>
                {!showNewFolderInput && (
                  <Pressable
                    onPress={() => setShowNewFolderInput(true)}
                    style={styles.newFolderBtn}
                  >
                    <Ionicons name="add" size={16} color={colors.primary} />
                    <Text style={[styles.newFolderBtnText, { color: colors.primary }]}>New Folder</Text>
                  </Pressable>
                )}
              </View>

              {/* Inline Create Folder */}
              {showNewFolderInput && (
                <View style={[styles.newFolderForm, { borderColor: colors.border }]}>
                  <TextInput
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    placeholder="Folder Name (e.g. Daily Ward)"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.folderInput, { color: colors.textPrimary, borderColor: colors.border }]}
                    maxLength={30}
                    autoFocus
                  />
                  <View style={styles.formButtons}>
                    <Pressable
                      onPress={() => setShowNewFolderInput(false)}
                      style={styles.formCancelBtn}
                    >
                      <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleCreateFolderAndAdd}
                      style={[styles.formConfirmBtn, { backgroundColor: colors.primary }]}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Folders List */}
              {folders.length > 0 ? (
                folders.map((folder) => {
                  const isCircleFolder = !!folder.circleRoomId;
                  const check = bookmarkService.canAddToFolder(folder.id, juzNumber);
                  const isDisabled = !check.allowed;
                  return (
                    <Pressable
                      key={folder.id}
                      onPress={() => {
                        if (isDisabled) {
                          Alert.alert('Juz Restricted', check.reason || 'Cannot add to this folder');
                        } else {
                          handleAddToFolder(folder.id, folder.name);
                        }
                      }}
                      style={({ pressed }) => [
                        styles.folderRow,
                        { borderBottomColor: colors.border + '33' },
                        pressed && !isDisabled && { backgroundColor: colors.background },
                        isDisabled && { opacity: 0.45 },
                      ]}
                    >
                      <View style={styles.folderRowLeft}>
                        <Ionicons
                          name={isCircleFolder ? 'shield-half-outline' : 'folder-outline'}
                          size={20}
                          color={isDisabled ? colors.textMuted : colors.primary}
                        />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={[styles.folderRowText, { color: isDisabled ? colors.textMuted : colors.textPrimary }]}>
                            {folder.name}
                          </Text>
                          {isCircleFolder && folder.restrictedJuzs && folder.restrictedJuzs.length > 0 && (
                            <Text style={{ fontSize: 10, color: isDisabled ? colors.textMuted : colors.primary, marginTop: 1 }}>
                              📿 Circle • Juz {folder.restrictedJuzs.join(', ')}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Ionicons
                        name={isDisabled ? 'lock-closed' : 'chevron-forward'}
                        size={16}
                        color={colors.textMuted}
                      />
                    </Pressable>
                  );
                })
              ) : (
                !showNewFolderInput && (
                  <Text style={[styles.noFoldersText, { color: colors.textMuted }]}>
                    No folders created yet. Tap "New Folder" above to organize.
                  </Text>
                )
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  drawerCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    maxHeight: SCREEN_HEIGHT * 0.75,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.english,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.english,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newFolderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  newFolderBtnText: {
    fontSize: 14,
    fontFamily: FONTS.english,
    fontWeight: '700',
    marginLeft: 2,
  },
  optionCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: FONTS.english,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  newFolderForm: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  folderInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  formCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  formConfirmBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  folderRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderRowText: {
    fontSize: 15,
    fontFamily: FONTS.english,
    marginLeft: 12,
  },
  noFoldersText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
    lineHeight: 18,
  },
});
