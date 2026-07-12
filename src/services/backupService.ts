import { bookmarkService } from './bookmarkService';
import { preferencesService } from './preferencesService';
import { prayerService } from './prayerService';
import { sajdahService } from './sajdahService';
import * as FileSystem from 'expo-file-system/legacy';
import { Share, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { googleAuthService } from './googleAuthService';
import CryptoJS from 'crypto-js';

export interface BackupPayload {
  version: number;
  appVersion?: string;
  createdAt: number;
  bookmarks: any[];
  folders: any[];
  settings: any;
  prayerTimes?: any;
  tasbihCount?: number;
  tasbihIndex?: number;
  lastRead?: any;
  dhikrList?: any[];
  sajdahLogs?: any;
  circleItems?: any[];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
}

class BackupService {
  private BACKUP_VERSION = 1;
  private FILE_NAME = 'dhikr_backup.json';

  /**
   * Helper: fetches the local backup payload representing all user data
   */
  async getBackupPayload(): Promise<BackupPayload> {
    // Force load/sync services to get fresh values from AsyncStorage
    await bookmarkService.load();
    const loadedPrefs = await preferencesService.load();
    const loadedPrayers = await prayerService.load();

    const bookmarks = bookmarkService.getBookmarks();
    const folders = bookmarkService.getFolders();

    let tasbihCount = null;
    let tasbihIndex = null;
    let lastRead = null;
    let dhikrList = null;
    let sajdahLogs = null;
    let circleItems = null;

    try {
      const tCount = await AsyncStorage.getItem('@dhikr_widget_tasbih_count');
      if (tCount) tasbihCount = Number(tCount);
      
      const tIndex = await AsyncStorage.getItem('@dhikr_widget_tasbih_index');
      if (tIndex) tasbihIndex = Number(tIndex);
      
      const lRead = await AsyncStorage.getItem('@dhikr_last_read');
      if (lRead) lastRead = JSON.parse(lRead);

      const dList = await AsyncStorage.getItem('@dhikr_app_list_v1');
      if (dList) dhikrList = JSON.parse(dList);

      const sLogs = await AsyncStorage.getItem('@dhikr_sajdah_logs');
      if (sLogs) sajdahLogs = JSON.parse(sLogs);

      const cItems = await AsyncStorage.getItem('@dhikr_circle_items');
      if (cItems) circleItems = JSON.parse(cItems);
    } catch (e) {
      console.warn('Error reading extra backup data:', e);
    }

    // Get current app version dynamically via Constants if possible
    let appVersion = '4.0.0';
    try {
      const Constants = require('expo-constants').default;
      appVersion = Constants.expoConfig?.version || Constants.manifest?.version || '4.0.0';
    } catch (_) {}

    return {
      version: this.BACKUP_VERSION,
      appVersion,
      createdAt: Date.now(),
      bookmarks,
      folders,
      settings: loadedPrefs,
      prayerTimes: loadedPrayers,
      tasbihCount: tasbihCount ?? undefined,
      tasbihIndex: tasbihIndex ?? undefined,
      lastRead,
      dhikrList: dhikrList ?? undefined,
      sajdahLogs: sajdahLogs ?? undefined,
      circleItems: circleItems ?? undefined,
    };
  }

  /**
   * Validates if a backup payload structure is valid and compatible
   */
  /**
   * Migrates older backup structures to the current standard structure.
   */
  public migrateBackup(payload: any): any {
    if (!payload || typeof payload !== 'object') {
      return payload;
    }

    console.log(`[Backup] Running migration. Original version: ${payload.version}, appVersion: ${payload.appVersion || 'legacy'}`);

    // Map V2 structure aliases to modern V3/V4 keys
    if (!payload.bookmarks && payload.bookmarksList) payload.bookmarks = payload.bookmarksList;
    if (!payload.bookmarks && payload.favoriteDuas) payload.bookmarks = payload.favoriteDuas;
    if (!payload.folders && payload.bookmarkFolders) payload.folders = payload.bookmarkFolders;
    
    if (!payload.settings && payload.preferences) payload.settings = payload.preferences;
    if (!payload.settings && payload.appSettings) payload.settings = payload.appSettings;
    
    if (!payload.prayerTimes && payload.prayer_times) payload.prayerTimes = payload.prayer_times;
    if (!payload.prayerTimes && payload.prayers) payload.prayerTimes = payload.prayers;
    
    if (payload.tasbihCount === undefined && payload.tasbih_count !== undefined) {
      payload.tasbihCount = payload.tasbih_count;
    }
    if (payload.tasbihIndex === undefined && payload.tasbih_index !== undefined) {
      payload.tasbihIndex = payload.tasbih_index;
    }
    if (!payload.dhikrList && payload.dhikrs) payload.dhikrList = payload.dhikrs;
    if (!payload.dhikrList && payload.dhikr_list) payload.dhikrList = payload.dhikr_list;
    if (!payload.sajdahLogs && payload.sajdah_logs) payload.sajdahLogs = payload.sajdah_logs;
    if (!payload.circleItems && payload.circles) payload.circleItems = payload.circles;

    // Core arrays initialization
    if (!payload.bookmarks) payload.bookmarks = [];
    if (!payload.folders) payload.folders = [];
    
    // settings (preferences) defaults
    if (!payload.settings || typeof payload.settings !== 'object') {
      payload.settings = {};
    }
    
    // Ensure all standard preference keys are present
    const defaultSettings = {
      themeMode: 'dark',
      translationLanguage: 'english',
      homeMode: 'surah',
      arabicFont: 'uthmani',
      enableHifzBlur: false,
    };
    payload.settings = { ...defaultSettings, ...payload.settings };

    // Extra fields migration & normalization
    if (payload.tasbihCount === undefined) payload.tasbihCount = 0;
    if (payload.tasbihIndex === undefined) payload.tasbihIndex = 0;
    if (!payload.dhikrList) payload.dhikrList = [];
    if (!payload.circleItems) payload.circleItems = [];

    // Upgrade the payload version to current backup version
    payload.version = this.BACKUP_VERSION;
    payload.migratedAt = Date.now();

    return payload;
  }

  validateBackup(payload: any): payload is BackupPayload {
    if (!payload || typeof payload !== 'object') {
      console.warn('[Backup] Validation failed: payload is not an object.');
      return false;
    }

    // If backup is missing a version or is from an older schema version, perform auto-migration
    if (!payload.version || payload.version < this.BACKUP_VERSION) {
      console.log(`[Backup] Legacy backup format detected (version ${payload.version || '0'}). Initiating migration...`);
      this.migrateBackup(payload);
    }

    if (payload.version > this.BACKUP_VERSION) {
      console.warn(`[Backup] Backup file is from a newer version (${payload.version}) than the current app (${this.BACKUP_VERSION}). Proceeding with caution.`);
    }

    // Check bookmarks and folders arrays after migration
    if (!Array.isArray(payload.bookmarks)) {
      console.warn('[Backup] Validation failed: bookmarks is not an array.');
      return false;
    }
    if (!Array.isArray(payload.folders)) {
      console.warn('[Backup] Validation failed: folders is not an array.');
      return false;
    }

    // Check settings (preferences)
    if (!payload.settings || typeof payload.settings !== 'object') {
      console.warn('[Backup] Validation failed: settings is missing or not an object.');
      return false;
    }

    return true;
  }

  /**
   * Restores user data from a backup JSON string
   * @param jsonString The backup JSON string to parse and restore
   */
  async importBackupLocal(jsonString: string, password?: string): Promise<'SUCCESS' | 'PASSWORD_REQUIRED' | 'DECRYPTION_FAILED' | 'VALIDATION_FAILED' | 'PARSE_ERROR'> {
    try {
      let payload = JSON.parse(jsonString);
      
      // Check if backup is encrypted
      if (payload && payload.encrypted === true) {
        if (!password) {
          return 'PASSWORD_REQUIRED';
        }
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(payload.ciphertext, password);
          const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
          if (!decrypted) {
            return 'DECRYPTION_FAILED';
          }
          payload = JSON.parse(decrypted);
        } catch (e) {
          return 'DECRYPTION_FAILED';
        }
      }
      
      if (!this.validateBackup(payload)) {
        return 'VALIDATION_FAILED';
      }

      // Restore to local services
      await bookmarkService.restoreData(payload.bookmarks, payload.folders);
      await preferencesService.save(payload.settings);
      if (payload.prayerTimes) {
        await prayerService.restoreData(payload.prayerTimes);
      }

      // Restore extra data
      try {
        if (payload.tasbihCount !== undefined) {
          await AsyncStorage.setItem('@dhikr_widget_tasbih_count', String(payload.tasbihCount));
        }
        if (payload.tasbihIndex !== undefined) {
          await AsyncStorage.setItem('@dhikr_widget_tasbih_index', String(payload.tasbihIndex));
        }
        if (payload.lastRead) {
          await AsyncStorage.setItem('@dhikr_last_read', JSON.stringify(payload.lastRead));
        }
        if (payload.dhikrList) {
          await AsyncStorage.setItem('@dhikr_app_list_v1', JSON.stringify(payload.dhikrList));
        }
        if (payload.sajdahLogs) {
          await sajdahService.restoreData(payload.sajdahLogs);
        }
        if (payload.circleItems) {
          await AsyncStorage.setItem('@dhikr_circle_items', JSON.stringify(payload.circleItems));
        }
      } catch (e) {
        console.warn('Error restoring extra backup data:', e);
      }

      // Save a local copy to DocumentDirectory too (unencrypted for triggerAutoBackup compatibility)
      const fileUri = `${FileSystem.documentDirectory}${this.FILE_NAME}`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
        encoding: 'utf8',
      });

      console.log('Successfully restored bookmarks and preferences locally.');
      return 'SUCCESS';
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return 'PARSE_ERROR';
    }
  }

  /**
   * Exports backup data to a shared text file or copies to clipboard via Share API
   */
  async exportBackupLocal(password?: string): Promise<boolean> {
    try {
      const payload = await this.getBackupPayload();
      let content = JSON.stringify(payload, null, 2);

      if (password) {
        const ciphertext = CryptoJS.AES.encrypt(content, password).toString();
        content = JSON.stringify({ encrypted: true, ciphertext });
      }

      // Save locally to DocumentDirectory as well for persistence
      const fileUri = `${FileSystem.documentDirectory}${this.FILE_NAME}`;
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: 'utf8',
      });

      // Share options
      const shareOptions = Platform.select({
        ios: {
          url: fileUri,
          subject: 'Dhikr Backup',
        },
        default: {
          message: content, // Share the JSON string directly on Android
          title: 'Dhikr Backup',
        },
      });

      await Share.share(shareOptions);
      return true;
    } catch (error) {
      console.error('Failed to export backup:', error);
      return false;
    }
  }

  /**
   * Google Drive: Authenticate and get valid access token
   */
  async authenticate(): Promise<string> {
    const token = await googleAuthService.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated. Please connect Google Drive first.');
    }
    return token;
  }

  /**
   * Google Drive: Search for the backup file in appDataFolder
   */
  async findBackup(accessToken: string): Promise<GoogleDriveFile | null> {
    const q = encodeURIComponent(`name = '${this.FILE_NAME}' and 'appDataFolder' in parents`);
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&spaces=appDataFolder&fields=files(id,name)`;
    
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) {
      const errBody = await searchRes.text();
      throw new Error(`Find backup failed (${searchRes.status}): ${errBody}`);
    }

    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files[0];
    return existingFile ? { id: existingFile.id, name: existingFile.name } : null;
  }

  /**
   * Google Drive: Create a new backup file inside appDataFolder
   */
  async createBackup(accessToken: string, content: string): Promise<{ id: string }> {
    const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const boundary = 'dikhr_backup_boundary_001';

    const metadata = JSON.stringify({
      name: this.FILE_NAME,
      parents: ['appDataFolder'],
      mimeType: 'application/json',
    });

    const multipartBody =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n` +
      `--${boundary}--`;

    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    if (!createRes.ok) {
      const errBody = await createRes.text();
      throw new Error(`Create backup failed (${createRes.status}): ${errBody}`);
    }

    const file = await createRes.json();
    return { id: file.id };
  }

  /**
   * Google Drive: Update an existing backup file
   */
  async updateBackup(accessToken: string, fileId: string, content: string): Promise<{ id: string }> {
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    
    const updateRes = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: content,
    });

    if (!updateRes.ok) {
      const errBody = await updateRes.text();
      throw new Error(`Update backup failed (${updateRes.status}): ${errBody}`);
    }

    return { id: fileId };
  }

  /**
   * Google Drive: Upload backup (handles create or update automatically)
   */
  async uploadBackup(accessToken: string, content: string): Promise<{ id: string }> {
    const existingFile = await this.findBackup(accessToken);
    if (existingFile) {
      return await this.updateBackup(accessToken, existingFile.id, content);
    } else {
      return await this.createBackup(accessToken, content);
    }
  }

  /**
   * Google Drive: Download a backup file
   */
  async downloadBackup(accessToken: string, fileId: string): Promise<string> {
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    
    const downloadRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!downloadRes.ok) {
      const errBody = await downloadRes.text();
      throw new Error(`Download backup failed (${downloadRes.status}): ${errBody}`);
    }

    return await downloadRes.text();
  }

  /**
   * Google Drive: Fetch the latest backup information and content
   */
  async getLatestBackup(accessToken: string): Promise<{ id: string; content: string } | null> {
    const file = await this.findBackup(accessToken);
    if (!file) return null;
    const content = await this.downloadBackup(accessToken, file.id);
    return { id: file.id, content };
  }

  /**
   * Google Drive: Delete the backup file
   */
  async deleteBackup(accessToken: string, fileId: string): Promise<boolean> {
    const deleteUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const res = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Delete backup failed (${res.status}): ${errBody}`);
    }
    return true;
  }

  /**
   * Google Drive: Perform a full backup of local state to Drive
   */
  async backupToDrive(accessToken: string, password?: string): Promise<string | null> {
    try {
      const payload = await this.getBackupPayload();
      let content = JSON.stringify(payload, null, 2);

      if (password) {
        const ciphertext = CryptoJS.AES.encrypt(content, password).toString();
        content = JSON.stringify({ encrypted: true, ciphertext });
      }

      await this.uploadBackup(accessToken, content);

      // Save last backup timestamp locally (SQLite/AsyncStorage)
      try {
        await AsyncStorage.setItem('@gdrive_last_backup', Date.now().toString());
      } catch (_) {}
      
      return null; // success
    } catch (e: any) {
      const msg = e?.message || String(e);
      console.error('[Backup] Failed to backup to Drive:', msg);
      return msg;
    }
  }

  /**
   * Google Drive: Perform a full restore from Drive to local state
   */
  async restoreFromDrive(accessToken: string, password?: string): Promise<string | null> {
    try {
      const latest = await this.getLatestBackup(accessToken);
      if (!latest) {
        return 'NO_BACKUP';
      }

      const res = await this.importBackupLocal(latest.content, password);
      if (res === 'SUCCESS') return null;
      return res; // Returns 'PASSWORD_REQUIRED', 'DECRYPTION_FAILED', etc.
    } catch (e: any) {
      const msg = e?.message || String(e);
      console.error('[Backup] Failed to restore from Drive:', msg);
      return msg;
    }
  }

  /**
   * Silent background auto-sync — saves locally only.
   * Does NOT auto-push to Google Drive to prevent accidental overwrites.
   * User must manually press "Export to Drive" to sync to cloud.
   */
  async triggerAutoBackup(): Promise<void> {
    try {
      const payload = await this.getBackupPayload();
      const content = JSON.stringify(payload, null, 2);
      const fileUri = `${FileSystem.documentDirectory}${this.FILE_NAME}`;
      await FileSystem.writeAsStringAsync(fileUri, content, { encoding: 'utf8' });
      console.log('✓ Local auto-snapshot saved.');
    } catch (e) {
      console.warn('Local auto-snapshot failed:', e);
    }
  }

  /**
   * Clears stale/cache keys from AsyncStorage to free SQLite space (SQLITE_FULL fix)
   */
  async clearStorageCache(): Promise<void> {
    const staleKeys = [
      '@dhikr_cache_surah_list',
      '@dhikr_cache_ayahs',
      '@dhikr_search_history',
      '@dhikr_temp',
    ];
    try {
      await AsyncStorage.multiRemove(staleKeys);
      console.log('Storage cache cleared.');
    } catch (e) {
      console.warn('Could not clear storage cache:', e);
    }
  }
}

export const backupService = new BackupService();
