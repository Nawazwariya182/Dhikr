export interface Ayah {
  surah: number;
  ayah: number;
  arabic: string;
  urdu: string;
  english: string;
}

export interface SurahMeta {
  id: number;
  start: number;
  ayahs: number;
  revelation_order: number;
  rukus: number;
  name_ar: string;
  name_translit: string;
  name_en: string;
  type: string;
}

export interface JuzEntry {
  juz: number;
  surah: number;
  ayah: number;
}

export interface HizbEntry {
  hizbQuarter: number;
  surah: number;
  ayah: number;
}

export interface RukuEntry {
  ruku: number;
  surah: number;
  ayah: number;
}

export interface SajdaEntry {
  id: number;
  surah: number;
  ayah: number;
  type: string;
}

export interface ManzilEntry {
  manzil: number;
  surah: number;
  ayah: number;
}

export interface Bookmark {
  surah: number;
  ayah: number;
  timestamp: number;
  juzNumber?: number;
  folderId?: string; // Optional folder association
}

export interface BookmarkFolder {
  id: string;
  name: string;
  timestamp: number;
}
