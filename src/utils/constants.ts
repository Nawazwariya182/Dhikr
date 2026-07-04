export const COLORS = {
  background: '#0f172a',
  surface: '#1e293b',
  surfaceLight: '#334155',
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  accent: '#f59e0b',
  white: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  border: '#334155',
  sajdah: '#7c3aed',
  juz: '#3b82f6',
  ruku: '#10b981',
  manzil: '#f59e0b',
  error: '#ef4444',
};

export const FONTS = {
  arabic: 'UthmanicHafs',
  english: 'Figtree',
  ayahNumber: 'AyahNumber',
  surahName: 'SurahNames',
};

export const getArabicFontFamily = (fontPref?: 'uthmani' | 'indopak') => {
  return fontPref === 'indopak' ? 'IndoPak' : 'UthmanicHafs';
};

export const SIZES = {
  arabicFont: 32,
  translationFont: 16,
  verseSpacing: 32,
  screenPadding: 16,
};

export const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ';
