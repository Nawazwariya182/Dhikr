import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark } from '../models/types';

const BOOKMARKS_KEY = '@dikhr_bookmarks';

class BookmarkService {
  private bookmarks: Bookmark[] = [];
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (raw) {
        this.bookmarks = JSON.parse(raw);
      }
    } catch {
      this.bookmarks = [];
    }
    this.loaded = true;
  }

  private async save(): Promise<void> {
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(this.bookmarks));
  }

  getBookmarks(): Bookmark[] {
    return [...this.bookmarks];
  }

  isBookmarked(surah: number, ayah: number): boolean {
    return this.bookmarks.some((b) => b.surah === surah && b.ayah === ayah);
  }

  async toggleBookmark(surah: number, ayah: number, juzNumber?: number): Promise<boolean> {
    const index = this.bookmarks.findIndex(
      (b) => b.surah === surah && b.ayah === ayah
    );
    if (index >= 0) {
      this.bookmarks.splice(index, 1);
      await this.save();
      return false;
    } else {
      this.bookmarks.push({ surah, ayah, timestamp: Date.now(), juzNumber });
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
}

export const bookmarkService = new BookmarkService();
