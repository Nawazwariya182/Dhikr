import {
  Ayah,
  SurahMeta,
  JuzEntry,
  HizbEntry,
  RukuEntry,
  SajdaEntry,
  ManzilEntry,
} from '../models/types';

import quranData from '../../assets/json/quran.json';
import surahMetaData from '../../assets/json/surah_meta.json';
import juzData from '../../assets/json/juz.json';
import hizbData from '../../assets/json/hizb.json';
import rukuData from '../../assets/json/ruku.json';
import sajdaData from '../../assets/json/sajda.json';
import manzilData from '../../assets/json/manzil.json';

class QuranService {
  private quran: Ayah[] = [];
  private surahMeta: SurahMeta[] = [];
  private juz: JuzEntry[] = [];
  private hizb: HizbEntry[] = [];
  private ruku: RukuEntry[] = [];
  private sajda: SajdaEntry[] = [];
  private manzil: ManzilEntry[] = [];

  private juzMap: Map<string, number> = new Map();
  private rukuMap: Map<string, number> = new Map();
  private sajdaMap: Map<string, string> = new Map();
  private manzilMap: Map<string, number> = new Map();

  private loaded = false;
  private ayahIndexMap: Map<string, number> = new Map();

  load(): void {
    if (this.loaded) return;

    this.quran = quranData as Ayah[];
        for (let index = 0; index < this.quran.length; index += 1) {
          const ayah = this.quran[index];
          this.ayahIndexMap.set(`${ayah.surah}:${ayah.ayah}`, index);
        }

    this.surahMeta = surahMetaData as SurahMeta[];
    this.juz = juzData as JuzEntry[];
    this.hizb = hizbData as HizbEntry[];
    this.ruku = rukuData as RukuEntry[];
    this.sajda = sajdaData as SajdaEntry[];
    this.manzil = manzilData as ManzilEntry[];

    // Build lookup maps for markers
    for (const j of this.juz) {
      this.juzMap.set(`${j.surah}:${j.ayah}`, j.juz);
    }
    for (const r of this.ruku) {
      this.rukuMap.set(`${r.surah}:${r.ayah}`, r.ruku);
    }
    for (const s of this.sajda) {
      this.sajdaMap.set(`${s.surah}:${s.ayah}`, s.type);
    }
    for (const m of this.manzil) {
      this.manzilMap.set(`${m.surah}:${m.ayah}`, m.manzil);
    }

    this.loaded = true;
  }

  getSurahList(): SurahMeta[] {
    return this.surahMeta;
  }

  getSurahMeta(surahId: number): SurahMeta | undefined {
    return this.surahMeta.find((s) => s.id === surahId);
  }

  getAyahsForSurah(surahId: number): Ayah[] {
    return this.quran.filter((a) => a.surah === surahId);
  }

  getJuzList(): JuzEntry[] {
    return this.juz;
  }

  getAyahsForJuz(juzNumber: number): Ayah[] {
    const currentJuz = this.juz.find((j) => j.juz === juzNumber);
    if (!currentJuz) return [];

    const nextJuz = this.juz.find((j) => j.juz === juzNumber + 1);
    const startIndex = this.getAyahIndex(currentJuz.surah, currentJuz.ayah);

    if (startIndex < 0) return [];

    if (!nextJuz) {
      return this.quran.slice(startIndex);
    }

    const endIndex = this.getAyahIndex(nextJuz.surah, nextJuz.ayah);
    if (endIndex < 0) return this.quran.slice(startIndex);

    return this.quran.slice(startIndex, endIndex);
  }

  getRukuStartsForSurah(surahId: number): RukuEntry[] {
    return this.ruku.filter((item) => item.surah === surahId);
  }

  getRukuStartsForJuz(juzNumber: number): RukuEntry[] {
    const ayahs = this.getAyahsForJuz(juzNumber);
    if (ayahs.length === 0) return [];

    const keys = new Set(ayahs.map((a) => `${a.surah}:${a.ayah}`));
    return this.ruku.filter((item) => keys.has(`${item.surah}:${item.ayah}`));
  }

  getJuzMarker(surah: number, ayah: number): number | undefined {
    return this.juzMap.get(`${surah}:${ayah}`);
  }

  getRukuMarker(surah: number, ayah: number): number | undefined {
    return this.rukuMap.get(`${surah}:${ayah}`);
  }

  getSajdaMarker(surah: number, ayah: number): string | undefined {
    return this.sajdaMap.get(`${surah}:${ayah}`);
  }

  getManzilMarker(surah: number, ayah: number): number | undefined {
    return this.manzilMap.get(`${surah}:${ayah}`);
  }

  searchVerses(query: string): Ayah[] {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return this.quran.filter(
      (a) =>
        a.arabic.includes(query) ||
        a.english.toLowerCase().includes(lowerQuery)
    );
  }

  searchSurahs(query: string): SurahMeta[] {
    if (!query.trim()) {
      return this.surahMeta;
    }

    const normalized = query.toLowerCase().trim();
    return this.surahMeta.filter((s) => {
      return (
        s.id.toString().includes(normalized) ||
        s.name_ar.includes(query) ||
        s.name_translit.toLowerCase().includes(normalized) ||
        s.name_en.toLowerCase().includes(normalized)
      );
    });
  }

  private getAyahIndex(surah: number, ayah: number): number {
    const index = this.ayahIndexMap.get(`${surah}:${ayah}`);
    return index === undefined ? -1 : index;
  }

  getAllVerses(): Ayah[] {
    return this.quran;
  }
}

export const quranService = new QuranService();
