import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark, BookmarkFolder } from '../models/types';
import { requestWidgetUpdate } from 'react-native-android-widget';
import quranData from '../../assets/json/quran.json';
import surahMetaData from '../../assets/json/surah_meta.json';
import juzData from '../../assets/json/juz.json';

const BOOKMARKS_KEY = '@dikhr_bookmarks';
const FOLDERS_KEY = '@dikhr_bookmark_folders';
const PRIMARY_FOLDER_KEY = '@dikhr_primary_bookmark_folder';

class BookmarkService {
  private bookmarks: Bookmark[] = [];
  private folders: BookmarkFolder[] = [];
  private loaded = false;
  private syncListener: (() => void) | null = null;

  async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const rawBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (rawBookmarks) {
        this.bookmarks = JSON.parse(rawBookmarks);
      }
      const rawFolders = await AsyncStorage.getItem(FOLDERS_KEY);
      if (rawFolders) {
        this.folders = JSON.parse(rawFolders);
      }
    } catch (e) {
      console.warn('Failed to load bookmarks or folders:', e);
      this.bookmarks = [];
      this.folders = [];
    }
    this.loaded = true;
  }

  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(this.bookmarks));
      await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(this.folders));
      
      // Notify Firestore sync listener if active
      if (this.syncListener) {
        this.syncListener();
      }

      // Auto backup to Google Drive
      import('./backupService').then(({ backupService }) => {
        backupService.triggerAutoBackup();
      }).catch(err => console.warn('Auto backup trigger error:', err));
    } catch (e) {
      console.warn('Failed to save bookmarks or folders:', e);
    }
  }

  registerSyncListener(listener: () => void) {
    this.syncListener = listener;
  }

  getBookmarks(): Bookmark[] {
    return [...this.bookmarks];
  }

  getFolders(): BookmarkFolder[] {
    return [...this.folders];
  }

  isBookmarked(surah: number, ayah: number): boolean {
    return this.bookmarks.some((b) => b.surah === surah && b.ayah === ayah);
  }

  async toggleBookmark(
    surah: number,
    ayah: number,
    juzNumber?: number,
    folderId?: string
  ): Promise<boolean> {
    const index = this.bookmarks.findIndex(
      (b) => b.surah === surah && b.ayah === ayah
    );
    if (index >= 0) {
      this.bookmarks.splice(index, 1);
      await this.save();
      return false;
    } else {
      this.bookmarks.push({
        surah,
        ayah,
        timestamp: Date.now(),
        juzNumber,
        folderId,
      });
      await this.save();
      return true;
    }
  }

  async removeBookmark(surah: number, ayah: number): Promise<void> {
    this.bookmarks = this.bookmarks.filter(
      (b) => !(b.surah === surah && b.ayah === ayah)
    );
    await this.save();
  }

  // Folder Operations
  async createFolder(name: string): Promise<BookmarkFolder> {
    const newFolder: BookmarkFolder = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      name: name.trim(),
      timestamp: Date.now(),
    };
    this.folders.push(newFolder);
    await this.save();
    return newFolder;
  }

  async renameFolder(folderId: string, newName: string): Promise<void> {
    this.folders = this.folders.map((f) =>
      f.id === folderId ? { ...f, name: newName.trim() } : f
    );
    await this.save();
  }

  async deleteFolder(folderId: string): Promise<void> {
    // Delete the folder
    this.folders = this.folders.filter((f) => f.id !== folderId);
    
    // Move any bookmarks in this folder back to the root (normal bookmarks)
    this.bookmarks = this.bookmarks.map((b) =>
      b.folderId === folderId ? { ...b, folderId: undefined } : b
    );
    
    await this.save();
  }

  // Move Operations (normal <-> folder, folder <-> folder)
  async moveBookmark(
    surah: number,
    ayah: number,
    targetFolderId: string | null
  ): Promise<void> {
    this.bookmarks = this.bookmarks.map((b) => {
      if (b.surah === surah && b.ayah === ayah) {
        return {
          ...b,
          folderId: targetFolderId === null ? undefined : targetFolderId,
        };
      }
      return b;
    });
    await this.save();
  }

  // Cloud overwrite helper (used for Firestore sync and GDrive restore)
  async restoreData(bookmarks: Bookmark[], folders: BookmarkFolder[]): Promise<void> {
    this.bookmarks = bookmarks;
    this.folders = folders;
    await this.save();
    await this.updateLastReadWidgetsFromState();
  }

  // Add a bookmark directly
  async addBookmark(surah: number, ayah: number, juzNumber?: number, folderId?: string): Promise<void> {
    // Remove if already exists first
    this.bookmarks = this.bookmarks.filter(b => !(b.surah === surah && b.ayah === ayah));
    
    this.bookmarks.push({
      surah,
      ayah,
      timestamp: Date.now(),
      juzNumber,
      folderId,
    });
    await this.save();
    await this.updateLastReadWidgetsFromState();
  }

  // Replace the last bookmarked ayah with this one
  async replaceLastBookmark(surah: number, ayah: number, juzNumber?: number): Promise<void> {
    if (this.bookmarks.length > 0) {
      // Find the last bookmarked item (by timestamp or last index)
      let lastBookmarkIndex = -1;
      let maxTime = -1;
      for (let i = 0; i < this.bookmarks.length; i++) {
        if ((this.bookmarks[i].timestamp || 0) > maxTime) {
          maxTime = this.bookmarks[i].timestamp || 0;
          lastBookmarkIndex = i;
        }
      }
      
      if (lastBookmarkIndex >= 0) {
        // Keep the folder configuration of the last bookmark if possible
        const folderId = this.bookmarks[lastBookmarkIndex].folderId;
        this.bookmarks.splice(lastBookmarkIndex, 1);
        this.bookmarks.push({
          surah,
          ayah,
          timestamp: Date.now(),
          juzNumber,
          folderId,
        });
      } else {
        this.bookmarks.push({
          surah,
          ayah,
          timestamp: Date.now(),
          juzNumber,
        });
      }
    } else {
      this.bookmarks.push({
        surah,
        ayah,
        timestamp: Date.now(),
        juzNumber,
      });
    }
    await this.save();
    await this.updateLastReadWidgetsFromState();
  }

  async getPrimaryFolderId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PRIMARY_FOLDER_KEY);
    } catch {
      return null;
    }
  }

  async setPrimaryFolderId(folderId: string | null): Promise<void> {
    try {
      if (folderId === null) {
        await AsyncStorage.removeItem(PRIMARY_FOLDER_KEY);
      } else {
        await AsyncStorage.setItem(PRIMARY_FOLDER_KEY, folderId);
      }
      await this.updateLastReadWidgetsFromState();
    } catch (e) {
      console.warn('Failed to set primary bookmark folder:', e);
    }
  }

  async updateLastReadWidgetsFromState(): Promise<void> {
    try {
      let surahId = 1;
      let ayahNumber = 1;
      let hasHistory = false;
      let hasFolder = false;

      const primaryFolderId = await this.getPrimaryFolderId();

      if (primaryFolderId) {
        const folderBookmarks = this.bookmarks.filter(b => b.folderId === primaryFolderId);
        if (folderBookmarks.length > 0) {
          folderBookmarks.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          surahId = folderBookmarks[0].surah;
          ayahNumber = folderBookmarks[0].ayah;
          hasHistory = true;
          hasFolder = true;
        }
      } else {
        const lastReadRaw = await AsyncStorage.getItem('@dhikr_last_read');
        if (lastReadRaw) {
          const lastRead = JSON.parse(lastReadRaw);
          if (lastRead && lastRead.surahId && lastRead.ayahNumber) {
            surahId = lastRead.surahId;
            ayahNumber = lastRead.ayahNumber;
            hasHistory = true;
          }
        }
        hasFolder = true; // Show general history in the widget layout instead of the "NO PRIMARY FOLDER" view
      }

      const surah = surahMetaData.find((s) => s.id === surahId);
      const surahName = surah ? surah.name_translit : 'Al-Fatihah';

      // Import widgets dynamically to avoid circular dependencies
      const { LastReadWidget } = require('../widgets/components/LastReadWidget');
      const { JuzProgressWidget } = require('../widgets/components/JuzProgressWidget');

      requestWidgetUpdate({
        widgetName: 'LastRead',
        renderWidget: () => (
          <LastReadWidget
            surahName={surahName}
            surahId={surahId}
            ayahNumber={ayahNumber}
            hasHistory={hasHistory}
            hasFolder={hasFolder}
          />
        ),
      });

      const findAyahIndex = (sId: number, aNum: number) => {
        return quranData.findIndex((a: any) => a.surah === sId && a.ayah === aNum);
      };

      const currentIndex = findAyahIndex(surahId, ayahNumber);
      let juzNumber = 1;
      let startIndex = 0;
      let endIndex = quranData.length;

      for (let i = 0; i < juzData.length; i++) {
        const j = juzData[i];
        const jIndex = findAyahIndex(j.surah, j.ayah);
        if (jIndex >= 0 && currentIndex >= jIndex) {
          juzNumber = j.juz;
          startIndex = jIndex;
          if (i + 1 < juzData.length) {
            endIndex = findAyahIndex(juzData[i + 1].surah, juzData[i + 1].ayah);
          } else {
            endIndex = quranData.length;
          }
        }
      }

      const totalVerses = endIndex - startIndex;
      const versesRead = Math.max(1, currentIndex - startIndex + 1);
      const progressPercent = (versesRead / totalVerses) * 100;

      requestWidgetUpdate({
        widgetName: 'JuzProgress',
        renderWidget: () => (
          <JuzProgressWidget
            juzNumber={juzNumber}
            progressPercent={progressPercent}
            versesRead={versesRead}
            totalVerses={totalVerses}
            hasFolder={hasFolder}
          />
        ),
      });
    } catch (e) {
      console.warn('Failed to update widgets from bookmark state:', e);
    }
  }
}

export const bookmarkService = new BookmarkService();
