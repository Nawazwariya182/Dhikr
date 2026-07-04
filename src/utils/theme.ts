export type ThemeMode = 'dark' | 'light';

export interface AppColors {
  background: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  primaryDark: string;
  accent: string;
  white: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  sajdah: string;
  juz: string;
  ruku: string;
  manzil: string;
  error: string;
}

const darkColors: AppColors = {
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

const lightColors: AppColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceLight: '#e2e8f0',
  primary: '#1d4ed8',
  primaryDark: '#1e40af',
  accent: '#b45309',
  white: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  border: '#cbd5e1',
  sajdah: '#7c3aed',
  juz: '#2563eb',
  ruku: '#059669',
  manzil: '#b45309',
  error: '#dc2626',
};

export function getColors(mode: ThemeMode): AppColors {
  return mode === 'dark' ? darkColors : lightColors;
}
