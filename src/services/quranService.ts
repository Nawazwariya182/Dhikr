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

const SEMANTIC_CONCEPTS: Record<string, string[]> = {
  patience: ['patience', 'patient', 'sabr', 'steadfast', 'endure', 'enduring', 'persevere', 'perseverance'],
  sabr: ['patience', 'patient', 'sabr', 'steadfast', 'endure', 'enduring', 'persevere', 'perseverance'],
  steadfast: ['patience', 'patient', 'sabr', 'steadfast', 'endure', 'enduring', 'persevere', 'perseverance'],
  parents: ['parents', 'parent', 'mother', 'father', 'begetter', 'begetting', 'validayn', 'parental'],
  mother: ['mother', 'parents', 'parent', 'ummi'],
  father: ['father', 'parents', 'parent', 'ab'],
  charity: ['charity', 'zakat', 'alms', 'spend', 'sadaqah', 'sadqah', 'poor', 'needy', 'infak'],
  zakat: ['charity', 'zakat', 'alms', 'spend', 'sadaqah', 'sadqah', 'poor', 'needy', 'infak'],
  alms: ['charity', 'zakat', 'alms', 'spend', 'sadaqah', 'sadqah', 'poor', 'needy', 'infak'],
  sadaqah: ['charity', 'zakat', 'alms', 'spend', 'sadaqah', 'sadqah', 'poor', 'needy', 'infak'],
  prayer: ['prayer', 'prayers', 'pray', 'salah', 'salat', 'bow', 'prostrate', 'sujud', 'ruku', 'worship'],
  salah: ['prayer', 'prayers', 'pray', 'salah', 'salat', 'bow', 'prostrate', 'sujud', 'ruku', 'worship'],
  salat: ['prayer', 'prayers', 'pray', 'salah', 'salat', 'bow', 'prostrate', 'sujud', 'ruku', 'worship'],
  paradise: ['paradise', 'heaven', 'jannah', 'gardens', 'garden', 'bliss', 'eden'],
  jannah: ['paradise', 'heaven', 'jannah', 'gardens', 'garden', 'bliss', 'eden'],
  heaven: ['paradise', 'heaven', 'jannah', 'gardens', 'garden', 'bliss', 'eden'],
  hell: ['hell', 'fire', 'jahannam', 'blaze', 'punishment', 'doom', 'burning', 'abyss'],
  jahannam: ['hell', 'fire', 'jahannam', 'blaze', 'punishment', 'doom', 'burning', 'abyss'],
  fire: ['hell', 'fire', 'jahannam', 'blaze', 'punishment', 'doom', 'burning', 'abyss'],
  faith: ['faith', 'belief', 'believe', 'believers', 'believer', 'iman', 'mumin', 'mu\'min'],
  belief: ['faith', 'belief', 'believe', 'believers', 'believer', 'iman', 'mumin', 'mu\'min'],
  iman: ['faith', 'belief', 'believe', 'believers', 'believer', 'iman', 'mumin', 'mu\'min'],
  forgiveness: ['forgiveness', 'forgive', 'pardon', 'merciful', 'tawbah', 'repent', 'gofur', 'maghfirah'],
  forgive: ['forgiveness', 'forgive', 'pardon', 'merciful', 'tawbah', 'repent', 'gofur', 'maghfirah'],
  repent: ['forgiveness', 'forgive', 'pardon', 'merciful', 'tawbah', 'repent', 'gofur', 'maghfirah'],
  tawbah: ['forgiveness', 'forgive', 'pardon', 'merciful', 'tawbah', 'repent', 'gofur', 'maghfirah'],
  knowledge: ['knowledge', 'know', 'wise', 'wisdom', 'learn', 'ilm', 'alim', 'hakeem'],
  wisdom: ['knowledge', 'know', 'wise', 'wisdom', 'learn', 'ilm', 'alim', 'hakeem'],
  ilm: ['knowledge', 'know', 'wise', 'wisdom', 'learn', 'ilm', 'alim', 'hakeem'],
  creation: ['creation', 'create', 'created', 'earth', 'heavens', 'sky', 'stars', 'universe', 'khalq'],
  creator: ['creation', 'create', 'created', 'earth', 'heavens', 'sky', 'stars', 'universe', 'khalq'],
  fasting: ['fasting', 'fast', 'sawm', 'ramadan', 'siyaam'],
  ramadan: ['fasting', 'fast', 'sawm', 'ramadan', 'siyaam'],
  pilgrimage: ['pilgrimage', 'hajj', 'umrah', 'kaaba', 'ka\'bah', 'makkah', 'mecca'],
  hajj: ['pilgrimage', 'hajj', 'umrah', 'kaaba', 'ka\'bah', 'makkah', 'mecca'],
  angels: ['angels', 'angel', 'gabriel', 'jibreel', 'mikaeel', 'malak', 'malaikah'],
  angel: ['angels', 'angel', 'gabriel', 'jibreel', 'mikaeel', 'malak', 'malaikah'],
  death: ['death', 'die', 'grave', 'resurrection', 'hereafter', 'mowt', 'qiyamah', 'judgment'],
  grave: ['death', 'die', 'grave', 'resurrection', 'hereafter', 'mowt', 'qiyamah', 'judgment'],
  resurrection: ['death', 'die', 'grave', 'resurrection', 'hereafter', 'mowt', 'qiyamah', 'judgment'],
  hereafter: ['death', 'die', 'grave', 'resurrection', 'hereafter', 'mowt', 'qiyamah', 'judgment'],
  merciful: ['merciful', 'mercy', 'compassion', 'rahman', 'raheem', 'beneficent'],
  mercy: ['merciful', 'mercy', 'compassion', 'rahman', 'raheem', 'beneficent'],
  justice: ['justice', 'fairness', 'equity', 'adl', 'scale', 'scales', 'balance'],
  truth: ['truth', 'haqq', 'true', 'verity', 'certainty'],
  peace: ['peace', 'tranquility', 'salam', 'secure', 'security', 'calm'],
  gratitude: ['gratitude', 'thankful', 'thanks', 'shukr', 'grateful'],
  thankful: ['gratitude', 'thankful', 'thanks', 'shukr', 'grateful'],
  shukr: ['gratitude', 'thankful', 'thanks', 'shukr', 'grateful']
};

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
    
    const lowerQuery = query.toLowerCase().trim();
    
    // Arabic search check: if it contains Arabic characters, do a simple substring match
    const isArabic = /[\u0600-\u06FF]/.test(query);
    if (isArabic) {
      return this.quran.filter((a) => a.arabic.includes(query));
    }

    // Tokenize query words
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length >= 2);
    if (queryWords.length === 0) return [];

    // Expand search terms using semantic dictionary
    const expandedTermsMap = new Map<string, Set<string>>();
    for (const word of queryWords) {
      const termsSet = new Set<string>([word]);
      // Look up in concept dictionary
      for (const conceptKey in SEMANTIC_CONCEPTS) {
        const synonyms = SEMANTIC_CONCEPTS[conceptKey];
        if (word === conceptKey || synonyms.includes(word)) {
          synonyms.forEach(syn => termsSet.add(syn));
        }
      }
      expandedTermsMap.set(word, termsSet);
    }

    const scoredAyahs: { ayah: Ayah; score: number }[] = [];

    for (const a of this.quran) {
      const englishLower = a.english.toLowerCase();
      let score = 0;

      // 1. Exact phrase match: highest weight
      if (englishLower.includes(lowerQuery)) {
        score += 100;
      }

      // 2. Original word match: check if original query words are in the text
      let originalWordsMatched = 0;
      for (const word of queryWords) {
        if (englishLower.includes(word)) {
          originalWordsMatched += 1;
        }
      }
      if (originalWordsMatched === queryWords.length) {
        score += 50;
      } else {
        score += originalWordsMatched * 10;
      }

      // 3. Semantic match: check if synonyms match
      let semanticMatches = 0;
      expandedTermsMap.forEach((synonyms) => {
        let matchedSynonym = false;
        for (const syn of synonyms) {
          if (englishLower.includes(syn)) {
            matchedSynonym = true;
            break;
          }
        }
        if (matchedSynonym) {
          semanticMatches += 1;
        }
      });

      if (semanticMatches > 0) {
        score += semanticMatches * 15;
      }

      if (score > 0) {
        scoredAyahs.push({ ayah: a, score });
      }
    }

    // Sort descending by score, then limit or return
    return scoredAyahs
      .sort((x, y) => y.score - x.score)
      .map(item => item.ayah);
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
