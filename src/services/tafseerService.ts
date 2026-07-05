/**
 * tafseerService.ts
 *
 * Storage  : expo-file-system flat JSON files (not AsyncStorage/SQLite → no 6MB limit)
 * Scraping : DawateIslami.net HTML pages for Siraat-ul-Jinan Urdu exegesis
 * Translation: MyMemory API (free, no API key, proper REST, Urdu→English)
 */

import * as FileSystem from 'expo-file-system/legacy';
import { quranService } from './quranService';


// ─────────────────────────────────────────────────────────────────────────────
// Surah URL slugs (DawateIslami.net) — 1-indexed via array position
// ─────────────────────────────────────────────────────────────────────────────
const SURAH_SLUGS: string[] = [
  'al-fatihah',    // 1
  'al-baqarah',    // 2
  'al-imran',      // 3
  'an-nisa',       // 4
  'al-maidah',     // 5
  'al-anam',       // 6
  'al-araf',       // 7
  'al-anfal',      // 8
  'al-taubah',     // 9
  'yunus',         // 10
  'hud',           // 11
  'yusf',          // 12
  'ar-rad',        // 13
  'ibrahim',       // 14
  'al-hijr',       // 15
  'an-nahl',       // 16
  'al-isra',       // 17
  'al-kahf',       // 18
  'maryam',        // 19
  'taha',          // 20
  'al-anbiya',     // 21
  'al-hajj',       // 22
  'al-muminun',    // 23
  'an-nur',        // 24
  'al-furqan',     // 25
  'ash-shuara',    // 26
  'an-naml',       // 27
  'al-qasas',      // 28
  'al-ankabut',    // 29
  'ar-rum',        // 30
  'luqman',        // 31
  'as-sajdah',     // 32
  'al-ahzab',      // 33
  'saba',          // 34
  'fatir',         // 35
  'yasin',         // 36
  'as-saffat',     // 37
  'sad',           // 38
  'az-zumar',      // 39
  'ghafir',        // 40
  'fussilat',      // 41
  'ash-shura',     // 42
  'az-zukhruf',    // 43
  'ad-dukhan',     // 44
  'al-jasia',      // 45
  'al-ahqaf',      // 46
  'muhammad',      // 47
  'al-fath',       // 48
  'al-hujurat',    // 49
  'qaf',           // 50
  'az-zariyat',    // 51
  'at-tur',        // 52
  'an-najm',       // 53
  'al-qamar',      // 54
  'ar-rahman',     // 55
  'al-waqiah',     // 56
  'al-hadid',      // 57
  'al-mujadilah',  // 58
  'al-hashr',      // 59
  'al-mumtahinah', // 60
  'as-saff',       // 61
  'al-jumuah',     // 62
  'al-munafiqun',  // 63
  'at-taghabun',   // 64
  'at-talaq',      // 65
  'at-tahrim',     // 66
  'al-mulk',       // 67
  'al-qalam',      // 68
  'al-haqqah',     // 69
  'al-maarij',     // 70
  'nuh',           // 71
  'al-jin',        // 72
  'al-muzzammil',  // 73
  'al-mudassir',   // 74
  'al-qiyamah',    // 75
  'ad-dahr',       // 76
  'al-mursalat',   // 77
  'an-naba',       // 78
  'an-naziat',     // 79
  'abasa',         // 80
  'at-takwir',     // 81
  'al-infitar',    // 82
  'al-mutaffifin', // 83
  'al-inshiqaq',   // 84
  'al-buruj',      // 85
  'at-tariq',      // 86
  'al-ala',        // 87
  'al-ghashiyah',  // 88
  'al-fajr',       // 89
  'al-balad',      // 90
  'ash-shams',     // 91
  'al-lail',       // 92
  'ad-duha',       // 93
  'alam-nashrah',  // 94
  'at-tin',        // 95
  'al-alaq',       // 96
  'al-qadr',       // 97
  'al-baiyinah',   // 98
  'az-zilzal',     // 99
  'al-adiyat',     // 100
  'al-qariah',     // 101
  'at-takasur',    // 102
  'al-asr',        // 103
  'al-humazah',    // 104
  'al-fil',        // 105
  'quraish',       // 106
  'al-maun',       // 107
  'al-kausar',     // 108
  'al-kafiroon',   // 109
  'an-nasr',       // 110
  'al-lahab',      // 111
  'al-ikhlas',     // 112
  'al-falaq',      // 113
  'an-nas',        // 114
];

// ─────────────────────────────────────────────────────────────────────────────
// Storage paths — per-surah JSON files in DocumentDirectory
// ─────────────────────────────────────────────────────────────────────────────
const TAFSEER_DIR = `${FileSystem.documentDirectory}tafseer/`;
// e.g.  .../tafseer/surah_1.json  →  { "1": { urdu, english, source }, "2": {...}, ... }

const getSurahFilePath = (surahId: number) =>
  `${TAFSEER_DIR}surah_${surahId}.json`;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface TafseerContent {
  urdu: string;
  english: string;
  source: string;
}

type SurahCache = Record<string, TafseerContent>; // key = ayahNumber as string

// ─────────────────────────────────────────────────────────────────────────────
// Progress callback type
// ─────────────────────────────────────────────────────────────────────────────
export type DownloadProgressCallback = (downloaded: number, total: number, surahId?: number) => void;

// ─────────────────────────────────────────────────────────────────────────────
// TafseerService
// ─────────────────────────────────────────────────────────────────────────────
class TafseerService {
  private isDownloading = false;
  private downloadedCount = 0;
  private totalCount = 0;
  private activeDownloadingSurahId?: number;
  private progressListeners: Set<DownloadProgressCallback> = new Set();

  // In-memory Surah cache (avoids repeated disk reads)
  private memCache: Map<number, SurahCache> = new Map();

  // ── Slug helper ────────────────────────────────────────────────────────────
  getSurahSlug(surahId: number): string {
    const idx = surahId - 1;
    return idx >= 0 && idx < SURAH_SLUGS.length ? SURAH_SLUGS[idx] : '';
  }

  // ── Progress subscription ──────────────────────────────────────────────────
  subscribeProgress(cb: DownloadProgressCallback): () => void {
    this.progressListeners.add(cb);
    return () => {
      this.progressListeners.delete(cb);
    };
  }

  private triggerProgress(downloaded: number, total: number, surahId?: number): void {
    for (const cb of this.progressListeners) {
      try {
        cb(downloaded, total, surahId);
      } catch (e) {
        // ignore callback errors
      }
    }
  }

  get isRunning(): boolean {
    return this.isDownloading;
  }

  get activeSurahId(): number | undefined {
    return this.activeDownloadingSurahId;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FILE STORAGE HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  /** Ensure the tafseer directory exists */
  private async ensureDir(): Promise<void> {
    const info = await FileSystem.getInfoAsync(TAFSEER_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(TAFSEER_DIR, { intermediates: true });
    }
  }

  /** Load the full per-surah JSON into memory cache */
  private async loadSurahFile(surahId: number): Promise<SurahCache> {
    if (this.memCache.has(surahId)) {
      return this.memCache.get(surahId)!;
    }
    try {
      const path = getSurahFilePath(surahId);
      const info = await FileSystem.getInfoAsync(path);
      if (!info.exists) return {};
      const raw = await FileSystem.readAsStringAsync(path, { encoding: FileSystem.EncodingType.UTF8 });
      const parsed: SurahCache = JSON.parse(raw);
      this.memCache.set(surahId, parsed);
      return parsed;
    } catch {
      return {};
    }
  }

  /** Persist the surah cache to disk and update memory cache */
  private async saveSurahFile(surahId: number, cache: SurahCache): Promise<void> {
    await this.ensureDir();
    const path = getSurahFilePath(surahId);
    await FileSystem.writeAsStringAsync(path, JSON.stringify(cache), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    this.memCache.set(surahId, cache);
  }

  /** Read a single ayah entry */
  private async readEntry(surahId: number, ayahNumber: number): Promise<TafseerContent | null> {
    const cache = await this.loadSurahFile(surahId);
    return cache[String(ayahNumber)] ?? null;
  }

  /** Write a single ayah entry (loads the surah file first, merges, saves) */
  private async writeEntry(surahId: number, ayahNumber: number, content: TafseerContent): Promise<void> {
    const cache = await this.loadSurahFile(surahId);
    cache[String(ayahNumber)] = content;
    await this.saveSurahFile(surahId, cache);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HTML CLEANING
  // ─────────────────────────────────────────────────────────────────────────

  private cleanHtmlText(html: string): string {
    let text = html;

    text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n##$1##\n\n');
    text = text.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');
    text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n\n$1\n\n');
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '\n• $1');
    text = text.replace(/<[uo]l[^>]*>/gi, '\n');
    text = text.replace(/<\/[uo]l[^>]*>/gi, '\n');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<[^>]+>/g, '');

    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/ +\n/g, '\n')
      .replace(/\n +/g, '\n')
      .replace(/\*{2,}/g, '')
      .replace(/^\*\s*/gm, '')
      .replace(/[●★❁※⁕✦✧❋❊❃❂❇❈❉⁎]/g, '')
      .replace(/\n{3,}/g, '\n\n');

    return text.trim();
  }

  private extractTafseerDiv(html: string): string {
    const startMarker = 'class="tafseer-font-size';
    const startIdx = html.indexOf(startMarker);
    if (startIdx === -1) return '';

    const openTagIdx = html.lastIndexOf('<div', startIdx);
    if (openTagIdx === -1) return '';

    let openCount = 0;
    let currentIndex = openTagIdx;

    while (currentIndex < html.length) {
      const nextOpen = html.indexOf('<div', currentIndex);
      const nextClose = html.indexOf('</div>', currentIndex);
      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        openCount++;
        currentIndex = nextOpen + 4;
      } else {
        openCount--;
        if (openCount === 0) {
          return html.substring(openTagIdx, nextClose + 6);
        }
        currentIndex = nextClose + 6;
      }
    }
    return '';
  }

  private cleanTafseerWatermarks(text: string): string {
    const UNWANTED = [
      'دعوتِ اسلامی', 'دعوت اسلامی', 'تبلیغِ قرآن', 'تبلیغ قرآن',
      'مکتبۃ المدینہ', 'مکتبہ المدینہ', 'اصلاح کی کوشش',
      'ڈاؤن لوڈ کریں', 'شیئر کریں', 'موبائل ایپ', 'سافٹ ویئر',
      'ایپلی کیشن', 'مفت حاصل کریں',
      'Normal', 'false', 'true', 'EN-US', 'X-NONE', 'AR-SA',
    ];

    let result = text
      .split('\n')
      .filter(line => {
        const t = line.trim();
        if (!t) return true;
        if (/^[\*0-9\s]+$/.test(t)) return false;
        if (/^[A-Z]{2,3}-[A-Z]{2,3}$/.test(t)) return false;
        return !UNWANTED.some(k => t.includes(k));
      })
      .join('\n');

    result = result
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)(?=\s|$)/gm, '')
      .replace(/[\u06d4]{3,}\s*$/g, '')
      .replace(/^\d+\s*$/gm, '')
      .replace(/\n{3,}/g, '\n\n');

    return result.trim();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSLATION  (Google Translate API — free, client-based, fast & accurate)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Translate Urdu → English using the Google Translate Single Client API.
   * Offloads neural translation to cloud, ensuring speed, accuracy, and efficiency
   * on low-end devices. Splits text by paragraph/blocks to keep formatting.
   */
  private async translateToEnglish(urduText: string): Promise<string> {
    const lines = urduText.split('\n');
    const translatedLines: string[] = [];
    let pendingNormalLines: string[] = [];

    const flushPending = async () => {
      if (pendingNormalLines.length === 0) return;
      const combined = pendingNormalLines.join(' ');
      try {
        const translated = await this.translateSingleChunk(combined);
        translatedLines.push(translated);
        await new Promise(r => setTimeout(r, 150)); // polite delay
      } catch (err) {
        translatedLines.push(combined);
      }
      pendingNormalLines = [];
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        await flushPending();
        translatedLines.push('');
        continue;
      }

      // Check if it is a heading, bullet, or numbered point
      const isHeading = trimmed.startsWith('##') && trimmed.endsWith('##');
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ');
      const isNumbered = /^\d+\)/.test(trimmed);

      if (isHeading || isBullet || isNumbered) {
        await flushPending();
        
        let prefix = '';
        let content = trimmed;
        
        if (isHeading) {
          const match = trimmed.match(/^##(.*)##$/);
          prefix = '## ';
          content = match ? match[1].trim() : trimmed;
        } else if (isBullet) {
          prefix = trimmed.startsWith('•') ? '• ' : '- ';
          content = trimmed.replace(/^[•\-]\s*/, '');
        } else if (isNumbered) {
          const match = trimmed.match(/^(\d+\))\s*(.+)$/s);
          prefix = match ? `${match[1]} ` : '';
          content = match ? match[2] : trimmed;
        }

        try {
          const translatedContent = await this.translateSingleChunk(content);
          translatedLines.push(isHeading ? `## ${translatedContent} ##` : `${prefix}${translatedContent}`);
          await new Promise(r => setTimeout(r, 150)); // polite delay
        } catch (err) {
          translatedLines.push(trimmed);
        }
      } else {
        pendingNormalLines.push(trimmed);
      }
    }

    await flushPending();

    return translatedLines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private async translateSingleChunk(text: string, retryCount = 0): Promise<string> {
    if (!text.trim()) return '';
    try {
      const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ur&tl=en&dt=t';
      const body = `q=${encodeURIComponent(text.trim())}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: body,
      });

      if (res.status === 429 && retryCount < 5) {
        const backoff = 3000 * Math.pow(2, retryCount);
        console.warn(`Google Translate: HTTP 429 rate limit hit. Retrying in ${backoff / 1000}s... (Attempt ${retryCount + 1}/5)`);
        await new Promise(r => setTimeout(r, backoff));
        return this.translateSingleChunk(text, retryCount + 1);
      }

      if (!res.ok) {
        throw new Error(`Google Translate returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (Array.isArray(json?.[0])) {
        // Join all translated parts of this chunk
        return json[0]
          .map((part: any) => part[0])
          .join('')
          .replace(/\s+/g, ' ')
          .trim();
      }
      throw new Error('Invalid Google Translate response format');
    } catch (err: any) {
      console.warn('Google Translate error:', err?.message ?? err);
      throw err;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get Tafseer for a single Ayah.
   * Reads from file-system cache first; falls back to live scrape.
   */
  async getTafseer(surahId: number, ayahNumber: number, fetchEnglish = false): Promise<TafseerContent> {
    // 1. Check disk cache
    const cached = await this.readEntry(surahId, ayahNumber);
    if (cached) {
      const isEnglishMissing = !cached.english ||
                               cached.english.includes('QUERY LENGTH LIMIT EXCEEDED') ||
                               cached.english.includes('MAX ALLOWED QUERY') ||
                               cached.english.trim() === cached.urdu.trim() ||
                               /[\u0600-\u06FF]/.test(cached.english);

      if (fetchEnglish && isEnglishMissing) {
        // Translate on-demand and persist
        try {
          cached.english = await this.translateToEnglish(cached.urdu);
          await this.writeEntry(surahId, ayahNumber, cached);
        } catch (err) {
          console.warn('On-demand translation failed:', err);
        }
      }
      return cached;
    }

    // 2. Live scrape
    const slug = this.getSurahSlug(surahId);
    if (!slug) throw new Error(`Invalid Surah ID: ${surahId}`);

    const url = `https://www.dawateislami.net/quran/surah-${slug}/ayat-${ayahNumber}/translation-1/tafseer`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Tafseer (HTTP ${response.status})`);
    }

    const html = await response.text();
    const tafseerDiv = this.extractTafseerDiv(html);
    if (!tafseerDiv) throw new Error('Tafseer container not found in page.');

    let cleanUrdu = this.cleanTafseerWatermarks(this.cleanHtmlText(tafseerDiv));
    if (!cleanUrdu) throw new Error('Tafseer content parsed as empty.');

    let cleanEnglish = '';
    if (fetchEnglish) {
      try {
        cleanEnglish = await this.translateToEnglish(cleanUrdu);
      } catch (err) {
        console.warn('Translation failed for live fetch:', err);
      }
    }

    const result: TafseerContent = {
      urdu: cleanUrdu,
      english: cleanEnglish,
      source: 'Siraat-ul-Jinan Tafseer (Dawat-e-Islami)',
    };

    await this.writeEntry(surahId, ayahNumber, result);
    return result;
  }

  /**
   * Translate Tafseer to English on-demand (called from UI when user taps English tab)
   */
  async translateTafseerEnglish(surahId: number, ayahNumber: number, urduText: string): Promise<string> {
    const cleanEnglish = await this.translateToEnglish(urduText);

    const existing = await this.readEntry(surahId, ayahNumber);
    const updated: TafseerContent = {
      urdu: urduText,
      english: cleanEnglish,
      source: existing?.source ?? 'Siraat-ul-Jinan Tafseer (Dawat-e-Islami)',
    };
    await this.writeEntry(surahId, ayahNumber, updated);
    return cleanEnglish;
  }

  startSurahDownload(surahId: number): void {
    // Background downloads disabled at user's request
    return;

    (async () => {
      try {
        await this.ensureDir();
        console.log(`📖 Tafseer: Starting background download for Surah ${surahId}...`);

        const ayahs = quranService.getAyahsForSurah(surahId);
        this.totalCount = ayahs.length;

        const cache = await this.loadSurahFile(surahId);
        const pending: { surahId: number; ayahNumber: number }[] = [];
        const needsTranslation: { surahId: number; ayahNumber: number; urdu: string }[] = [];

        for (const ayah of ayahs) {
          const entry = cache[String(ayah.ayah)];
          if (!entry) {
            pending.push({ surahId, ayahNumber: ayah.ayah });
          } else {
            // Check if English translation is missing or broken (e.g. rate limit error or cached urdu text)
            const isEnglishMissing = !entry.english ||
                                     entry.english.includes('QUERY LENGTH LIMIT EXCEEDED') ||
                                     entry.english.includes('MAX ALLOWED QUERY') ||
                                     entry.english.trim() === entry.urdu.trim() ||
                                     /[\u0600-\u06FF]/.test(entry.english);
            if (isEnglishMissing) {
              needsTranslation.push({ surahId, ayahNumber: ayah.ayah, urdu: entry.urdu });
            }
          }
        }

        this.downloadedCount = this.totalCount - pending.length - needsTranslation.length;
        console.log(`📖 Tafseer Surah ${surahId}: ${pending.length} missing, ${needsTranslation.length} need translation. Already done: ${this.downloadedCount}`);

        if (pending.length === 0 && needsTranslation.length === 0) {
          console.log(`📖 Tafseer Surah ${surahId}: All content already offline ✓`);
          this.isDownloading = false;
          this.activeDownloadingSurahId = undefined;
          this.triggerProgress(this.totalCount, this.totalCount, surahId);
          return;
        }

        this.triggerProgress(this.downloadedCount, this.totalCount, surahId);

        // ── PHASE 1: Fetch missing Urdu content ─────────────────────────────
        const CONCURRENCY = 2; // Polite
        let taskIndex = 0;

        const worker = async () => {
          while (taskIndex < pending.length) {
            const task = pending[taskIndex++];
            if (!task) continue;

            try {
              const slug = this.getSurahSlug(task.surahId);
              if (!slug) continue;

              const url = `https://www.dawateislami.net/quran/surah-${slug}/ayat-${task.ayahNumber}/translation-1/tafseer`;
              const res = await fetch(url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36',
                  'Accept': 'text/html',
                },
              });

              if (!res.ok) continue;

              const html = await res.text();
              const div = this.extractTafseerDiv(html);
              if (!div) continue;

              const urdu = this.cleanTafseerWatermarks(this.cleanHtmlText(div));
              if (!urdu) continue;

              await this.writeEntry(task.surahId, task.ayahNumber, {
                urdu,
                english: '',
                source: 'Siraat-ul-Jinan Tafseer (Dawat-e-Islami)',
              });

              needsTranslation.push({ surahId: task.surahId, ayahNumber: task.ayahNumber, urdu });

              this.downloadedCount++;
              this.triggerProgress(this.downloadedCount, this.totalCount, surahId);

              await new Promise(r => setTimeout(r, 100));
            } catch (err: any) {
              console.warn(`⚠ Tafseer fetch ${task.surahId}:${task.ayahNumber}:`, err?.message ?? err);
            }
          }
        };

        const workers = Array.from({ length: CONCURRENCY }, () => worker());
        await Promise.all(workers);
        console.log(`📖 Tafseer Surah ${surahId} Phase 1 (Urdu) complete.`);

        // ── PHASE 2: Translate Urdu → English (Google Translate API) ────────
        console.log(`📖 Tafseer Surah ${surahId} Phase 2: Translating ${needsTranslation.length} entries to English...`);
        for (const item of needsTranslation) {
          try {
            const english = await this.translateToEnglish(item.urdu);
            if (english && english !== item.urdu) {
              await this.writeEntry(item.surahId, item.ayahNumber, {
                urdu: item.urdu,
                english,
                source: 'Siraat-ul-Jinan Tafseer (Dawat-e-Islami)',
              });
            }
            this.downloadedCount++;
            this.triggerProgress(this.downloadedCount, this.totalCount, surahId);
            await new Promise(r => setTimeout(r, 800));
          } catch (err: any) {
            console.warn(`⚠ Translation ${item.surahId}:${item.ayahNumber}:`, err?.message ?? err);
            this.downloadedCount++;
            this.triggerProgress(this.downloadedCount, this.totalCount, surahId);
          }
        }

        console.log(`📖 Tafseer Surah ${surahId}: Full offline download complete ✓`);
      } catch (err) {
        console.warn(`📖 Tafseer Surah ${surahId} downloader error:`, err);
      } finally {
        this.isDownloading = false;
        this.activeDownloadingSurahId = undefined;
      }
    })();
  }

  /**
   * Returns download progress (0–1) for display in UI
   */
  getProgress(): number {
    if (this.totalCount === 0) return 0;
    return Math.min(1, this.downloadedCount / this.totalCount);
  }

  /**
   * Check if a specific ayah's Tafseer is already cached offline
   */
  async isCached(surahId: number, ayahNumber: number): Promise<boolean> {
    const entry = await this.readEntry(surahId, ayahNumber);
    return !!entry?.urdu;
  }

  /**
   * Clear all cached Tafseer data (for debugging / reset)
   */
  async clearCache(): Promise<void> {
    this.memCache.clear();
    try {
      const info = await FileSystem.getInfoAsync(TAFSEER_DIR);
      if (info.exists) {
        await FileSystem.deleteAsync(TAFSEER_DIR, { idempotent: true });
      }
    } catch (e) {
      console.warn('Failed to clear Tafseer cache:', e);
    }
  }
}

export const tafseerService = new TafseerService();
