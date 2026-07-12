import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { FONTS, BISMILLAH } from '../utils/constants';

import quranData from '../../assets/json/quran.json';
import surahMetaData from '../../assets/json/surah_meta.json';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────
type ContentType = 'ayah' | 'hadith' | 'dua';
type AspectRatio = 'square' | 'portrait' | 'story' | 'landscape';
type CardStyle = 'classic' | 'minimal' | 'bordered' | 'magazine' | 'calligraphy' | 'modern';

interface BackgroundOption {
  id: string;
  label: string;
  type: 'image' | 'gradient';
  source?: any;               // require() for image type
  colors?: [string, string, ...string[]]; // gradient colors for non-image type
  textLight: boolean;         // default light/dark mode preference
}

interface StyleOption {
  id: CardStyle;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface SurahMeta {
  id: number;
  name_ar: string;
  name_translit: string;
  name_en: string;
  ayahs: number;
}

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────
const ASPECT_RATIOS: { id: AspectRatio; label: string; w: number; h: number; icon: string }[] = [
  { id: 'square',    label: '1:1',  w: 360, h: 360,  icon: '⬜' },
  { id: 'portrait',  label: '4:5',  w: 360, h: 450,  icon: '▯' },
  { id: 'story',     label: '9:16', w: 360, h: 640,  icon: '▮' },
  { id: 'landscape', label: '16:9', w: 360, h: 202,  icon: '▬' },
];

const BACKGROUNDS: BackgroundOption[] = [
  // ── 16 generated image backgrounds ──
  {
    id: 'star_navy',
    label: 'Star Navy',
    type: 'image',
    source: require('../../assets/backgrounds/bg_islamic_star_navy.jpg'),
    textLight: true,
  },
  {
    id: 'arabesque',
    label: 'Arabesque',
    type: 'image',
    source: require('../../assets/backgrounds/bg_arabesque_emerald.jpg'),
    textLight: true,
  },
  {
    id: 'mosque_sky',
    label: 'Mosque Sky',
    type: 'image',
    source: require('../../assets/backgrounds/bg_mosque_night_sky.jpg'),
    textLight: true,
  },
  {
    id: 'desert_gold',
    label: 'Desert Gold',
    type: 'image',
    source: require('../../assets/backgrounds/bg_desert_gold.jpg'),
    textLight: true,
  },
  {
    id: 'burgundy',
    label: 'Burgundy',
    type: 'image',
    source: require('../../assets/backgrounds/bg_burgundy_floral.jpg'),
    textLight: true,
  },
  {
    id: 'marble_dark',
    label: 'Marble',
    type: 'image',
    source: require('../../assets/backgrounds/bg_marble_dark.jpg'),
    textLight: true,
  },
  {
    id: 'geom_teal',
    label: 'Teal Geometric',
    type: 'image',
    source: require('../../assets/backgrounds/bg_geom_teal.jpg'),
    textLight: true,
  },
  {
    id: 'gold_black',
    label: 'Gold Black',
    type: 'image',
    source: require('../../assets/backgrounds/bg_gold_black.jpg'),
    textLight: true,
  },
  {
    id: 'pastel_cloud',
    label: 'Pastel Clouds',
    type: 'image',
    source: require('../../assets/backgrounds/bg_pastel_cloud.jpg'),
    textLight: false,
  },
  {
    id: 'parchment',
    label: 'Parchment',
    type: 'image',
    source: require('../../assets/backgrounds/bg_parchment.jpg'),
    textLight: false,
  },
  {
    id: 'indigo_stars',
    label: 'Indigo Stars',
    type: 'image',
    source: require('../../assets/backgrounds/bg_indigo_stars.jpg'),
    textLight: true,
  },
  {
    id: 'olive_gold',
    label: 'Olive Watercolor',
    type: 'image',
    source: require('../../assets/backgrounds/bg_olive_gold.jpg'),
    textLight: false,
  },
  {
    id: 'morocco_tile',
    label: 'Moroccan Tile',
    type: 'image',
    source: require('../../assets/backgrounds/bg_morocco_tile.jpg'),
    textLight: true,
  },
  {
    id: 'rust_gold',
    label: 'Rust Gold',
    type: 'image',
    source: require('../../assets/backgrounds/bg_rust_gold.jpg'),
    textLight: true,
  },
  {
    id: 'charcoal_gold',
    label: 'Charcoal Minimal',
    type: 'image',
    source: require('../../assets/backgrounds/bg_charcoal_gold.jpg'),
    textLight: true,
  },
  {
    id: 'amethyst_gold',
    label: 'Amethyst Gold',
    type: 'image',
    source: require('../../assets/backgrounds/bg_amethyst_gold.jpg'),
    textLight: true,
  },

  // ── 20 vibrant gradient backgrounds ──
  { id: 'midnight',      label: 'Midnight Blue',type: 'gradient', colors: ['#050B1A', '#0F1E36', '#1A3254'], textLight: true },
  { id: 'forest',        label: 'Forest Green', type: 'gradient', colors: ['#05140B', '#0E2E1A', '#1C4E2D'], textLight: true },
  { id: 'ember',         label: 'Ember Amber',  type: 'gradient', colors: ['#1A0F03', '#3B240B', '#633E17'], textLight: true },
  { id: 'ocean',         label: 'Ocean Teal',   type: 'gradient', colors: ['#020F12', '#0A2D35', '#164E5B'], textLight: true },
  { id: 'violet',        label: 'Royal Violet', type: 'gradient', colors: ['#0E021A', '#240A3E', '#401763'], textLight: true },
  { id: 'ivory',         label: 'Ivory Light',  type: 'gradient', colors: ['#FCFBF7', '#F5F2E9', '#EAE4D3'], textLight: false },
  { id: 'sunset',        label: 'Crimson Dusk', type: 'gradient', colors: ['#140202', '#360909', '#5E1717'], textLight: true },
  { id: 'copper',        label: 'Warm Copper',  type: 'gradient', colors: ['#1C0E03', '#402410', '#6B4021'], textLight: true },
  { id: 'sapphire',      label: 'Sapphire Sky', type: 'gradient', colors: ['#000B21', '#0C204E', '#1D3E7D'], textLight: true },
  { id: 'jade',          label: 'Jade Garden',  type: 'gradient', colors: ['#031A0B', '#143C1F', '#2C6339'], textLight: true },
  { id: 'mystic',        label: 'Mystic Purple',type: 'gradient', colors: ['#17001C', '#3E0A4E', '#6B1B82'], textLight: true },
  { id: 'sunfire',       label: 'Sunfire',      type: 'gradient', colors: ['#140500', '#3D1500', '#702B03'], textLight: true },
  { id: 'slate',         label: 'Cool Slate',   type: 'gradient', colors: ['#0D1117', '#1F2937', '#374151'], textLight: true },
  { id: 'gold_shine',    label: 'Golden Glow',  type: 'gradient', colors: ['#1A1600', '#423A0B', '#70641A'], textLight: true },
  { id: 'rose_deep',     label: 'Rose Gold',    type: 'gradient', colors: ['#1F0E16', '#4E2436', '#7D405B'], textLight: true },
  { id: 'mint_emerald',  label: 'Mint Emerald', type: 'gradient', colors: ['#001C11', '#05472F', '#0E7350'], textLight: true },
  { id: 'velvet',        label: 'Dark Velvet',  type: 'gradient', colors: ['#05000C', '#120224', '#260B47'], textLight: true },
  { id: 'sahara',        label: 'Sahara Dawn',  type: 'gradient', colors: ['#2E1B00', '#613E0E', '#9E6D24'], textLight: true },
  { id: 'electric_teal', label: 'Electric Teal',type: 'gradient', colors: ['#001C24', '#004B5E', '#0083A3'], textLight: true },
  { id: 'sakura',        label: 'Sakura Pink',  type: 'gradient', colors: ['#FFF5F5', '#FFE3E3', '#FFC9C9'], textLight: false },
];

const STYLES: StyleOption[] = [
  { id: 'classic',      label: 'Classic',      icon: 'text-outline' },
  { id: 'minimal',      label: 'Minimal',      icon: 'remove-outline' },
  { id: 'bordered',     label: 'Bordered',     icon: 'square-outline' },
  { id: 'magazine',     label: 'Magazine',     icon: 'newspaper-outline' },
  { id: 'calligraphy',  label: 'Calligraphy',  icon: 'brush-outline' },
  { id: 'modern',       label: 'Modern',       icon: 'trending-up-outline' },
];

const TEXT_COLORS: ColorOption[] = [
  { id: 'white',      label: 'White',      hex: '#ffffff' },
  { id: 'cream',      label: 'Cream',      hex: '#fbf7ee' },
  { id: 'gold',       label: 'Gold',       hex: '#f59e0b' },
  { id: 'amber',      label: 'Amber',      hex: '#fbbf24' },
  { id: 'mint',       label: 'Mint',       hex: '#6ee7b7' },
  { id: 'rose',       label: 'Rose',       hex: '#fbcfe8' },
  { id: 'lavender',   label: 'Lavender',   hex: '#e9d5ff' },
  { id: 'charcoal',   label: 'Charcoal',   hex: '#111827' },
];

const ACCENT_COLORS: ColorOption[] = [
  { id: 'gold',       label: 'Gold',       hex: '#f59e0b' },
  { id: 'emerald',    label: 'Emerald',    hex: '#10b981' },
  { id: 'crimson',    label: 'Crimson',    hex: '#ef4444' },
  { id: 'cyan',       label: 'Cyan',       hex: '#06b6d4' },
  { id: 'rose_gold',  label: 'Rose Gold',  hex: '#fda4af' },
  { id: 'cream',      label: 'Cream',      hex: '#f5f2eb' },
  { id: 'charcoal',   label: 'Charcoal',   hex: '#1f2937' },
];

const surahs: SurahMeta[] = (surahMetaData as any[]).map((s: any) => ({
  id: s.id,
  name_ar: s.name_ar || '',
  name_translit: s.name_translit || '',
  name_en: s.name_en || '',
  ayahs: s.ayahs || 0,
}));

// ──────────────────────────────────────────────────────────────
// Helper: get Ayah data
// ──────────────────────────────────────────────────────────────
function getAyah(surahId: number, ayahNum: number): { arabic: string; english: string } | null {
  try {
    const flat = quranData as any[];
    const entry = flat.find((v: any) => v.surah === surahId && v.ayah === ayahNum);
    if (!entry) return null;
    return {
      arabic: entry.arabic || '',
      english: entry.english || '',
    };
  } catch {
    return null;
  }
}

// ── Native Gradient Detector & Safe JS Fallback ──
const hasNativeGradient = () => {
  if (Platform.OS === 'web') return false;
  try {
    return !!UIManager.getViewManagerConfig('ExpoLinearGradient');
  } catch {
    return false;
  }
};

function hexToRgb(hex: string): [number, number, number] {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0];
}

function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

interface SafeLinearGradientProps {
  colors: [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: any;
  children?: React.ReactNode;
}

const SafeLinearGradient: React.FC<SafeLinearGradientProps> = ({ colors, start, end, style, children }) => {
  const [useFallback] = useState(() => !hasNativeGradient());

  if (useFallback) {
    const steps = 32;
    const strips = Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      if (colors.length < 2) return colors[0];
      if (colors.length === 2) return lerpColor(colors[0], colors[1], t);
      if (t <= 0.5) return lerpColor(colors[0], colors[1], t * 2);
      return lerpColor(colors[1], colors[2], (t - 0.5) * 2);
    });

    return (
      <View style={[style, { flexDirection: 'column' }]}>
        {strips.map((color, idx) => (
          <View key={idx} style={{ flex: 1, backgroundColor: color }} />
        ))}
        {children && (
          <View style={StyleSheet.absoluteFillObject}>
            {children}
          </View>
        )}
      </View>
    );
  }

  return (
    <LinearGradient colors={colors} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
};

// ──────────────────────────────────────────────────────────────
// Card Component (what gets captured by ViewShot)
// ──────────────────────────────────────────────────────────────
interface CardProps {
  bg: BackgroundOption;
  style: CardStyle;
  arabicText: string;
  translationText: string;
  referenceText: string;
  contentType: ContentType;
  width: number;
  height: number;
  customTextColor?: string;
  customAccentColor?: string;
  fontSizeModifier: number; // offset in px (-8 to +16)
}

function WisdomCard({
  bg,
  style,
  arabicText,
  translationText,
  referenceText,
  contentType,
  width,
  height,
  customTextColor,
  customAccentColor,
  fontSizeModifier,
}: CardProps) {
  const textColor    = customTextColor || (bg.textLight ? '#ffffff' : '#1a1a1a');
  const accentColor  = customAccentColor || (bg.textLight ? '#f59e0b' : '#92400e');
  const mutedColor   = bg.textLight ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)';
  const borderColor  = bg.textLight ? 'rgba(255,215,0,0.4)' : 'rgba(92,64,14,0.4)';

  const content = (
    <View style={[cardStyles.base, { width, height }]}>
      {/* Background */}
      {bg.type === 'image' ? (
        <ImageBackground
          source={bg.source}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : (
        <SafeLinearGradient
          colors={bg.colors!}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Overlay for better text readability */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: bg.textLight ? 'rgba(0,0,0,0.42)' : 'rgba(255,255,255,0.18)' }]} />

      {/* Card Content by style */}
      {style === 'classic' && (
        <ClassicLayout
          arabic={arabicText} translation={translationText} reference={referenceText}
          textColor={textColor} accentColor={accentColor} mutedColor={mutedColor}
          contentType={contentType} width={width} height={height} fontSizeModifier={fontSizeModifier}
        />
      )}
      {style === 'minimal' && (
        <MinimalLayout
          arabic={arabicText} translation={translationText} reference={referenceText}
          textColor={textColor} accentColor={accentColor} mutedColor={mutedColor}
          contentType={contentType} width={width} height={height} fontSizeModifier={fontSizeModifier}
        />
      )}
      {style === 'bordered' && (
        <BorderedLayout
          arabic={arabicText} translation={translationText} reference={referenceText}
          textColor={textColor} accentColor={accentColor} mutedColor={mutedColor}
          borderColor={borderColor} contentType={contentType} width={width} height={height} fontSizeModifier={fontSizeModifier}
        />
      )}
      {style === 'magazine' && (
        <MagazineLayout
          arabic={arabicText} translation={translationText} reference={referenceText}
          textColor={textColor} accentColor={accentColor} mutedColor={mutedColor}
          contentType={contentType} width={width} height={height} fontSizeModifier={fontSizeModifier}
        />
      )}
      {style === 'calligraphy' && (
        <CalligraphyLayout
          arabic={arabicText} translation={translationText} reference={referenceText}
          textColor={textColor} accentColor={accentColor} mutedColor={mutedColor}
          contentType={contentType} width={width} height={height} fontSizeModifier={fontSizeModifier}
        />
      )}
      {style === 'modern' && (
        <ModernLayout
          arabic={arabicText} translation={translationText} reference={referenceText}
          textColor={textColor} accentColor={accentColor} mutedColor={mutedColor}
          contentType={contentType} width={width} height={height} fontSizeModifier={fontSizeModifier}
        />
      )}

      {/* App watermark */}
      <View style={cardStyles.watermark}>
        <Text style={[cardStyles.watermarkText, { color: mutedColor }]}>✦ Dikhr App</Text>
      </View>
    </View>
  );

  return content;
}

// ──────────────────────────────────────────────────────────────
// Card Layout Components
// ──────────────────────────────────────────────────────────────
interface LayoutProps {
  arabic: string;
  translation: string;
  reference: string;
  textColor: string;
  accentColor: string;
  mutedColor: string;
  borderColor?: string;
  contentType: ContentType;
  width: number;
  height: number;
  fontSizeModifier: number;
}

function ClassicLayout({ arabic, translation, reference, textColor, accentColor, mutedColor, width, height, fontSizeModifier }: LayoutProps) {
  const isSmall = height < 300;
  const arabicBaseSize = isSmall ? 18 : 26;
  const translationBaseSize = isSmall ? 10 : 13;
  
  return (
    <View style={[cardStyles.padded, { width, height, justifyContent: 'center', alignItems: 'center' }]}>
      {/* Top ornament */}
      <Text style={[cardStyles.ornament, { color: accentColor, fontSize: isSmall ? 14 : 18 }]}>﷽</Text>

      {/* Gold divider */}
      <View style={[cardStyles.dividerLine, { backgroundColor: accentColor, marginVertical: isSmall ? 4 : 8 }]} />

      {/* Arabic */}
      {arabic.trim() !== '' && (
        <Text
          style={[cardStyles.arabicText, { color: textColor, fontSize: arabicBaseSize + fontSizeModifier, lineHeight: (arabicBaseSize + fontSizeModifier) * 1.6 }]}
          adjustsFontSizeToFit
          numberOfLines={isSmall ? 4 : 6}
          minimumFontScale={0.4}
        >
          {arabic}
        </Text>
      )}

      {/* Divider */}
      {translation.trim() !== '' && arabic.trim() !== '' && (
        <View style={[cardStyles.dividerLine, { backgroundColor: accentColor, marginVertical: isSmall ? 4 : 8, opacity: 0.5 }]} />
      )}

      {/* Translation */}
      {translation.trim() !== '' && (
        <Text
          style={[cardStyles.translationText, { color: textColor, fontSize: translationBaseSize + Math.round(fontSizeModifier * 0.5) }]}
          adjustsFontSizeToFit
          numberOfLines={isSmall ? 3 : 5}
          minimumFontScale={0.5}
        >
          {translation}
        </Text>
      )}

      {/* Reference */}
      {reference.trim() !== '' && (
        <Text style={[cardStyles.referenceText, { color: accentColor, fontSize: isSmall ? 9 : 11, marginTop: isSmall ? 6 : 10 }]}>
          — {reference}
        </Text>
      )}
    </View>
  );
}

function MinimalLayout({ arabic, translation, reference, textColor, accentColor, mutedColor, width, height, fontSizeModifier }: LayoutProps) {
  const isSmall = height < 300;
  const arabicBaseSize = isSmall ? 20 : 30;
  const translationBaseSize = isSmall ? 10 : 13;

  return (
    <View style={[{ width, height, justifyContent: 'center', alignItems: 'center', padding: isSmall ? 16 : 28 }]}>
      {arabic.trim() !== '' && (
        <Text
          style={[cardStyles.arabicText, { color: textColor, fontSize: arabicBaseSize + fontSizeModifier, lineHeight: (arabicBaseSize + fontSizeModifier) * 1.6, textAlign: 'center' }]}
          adjustsFontSizeToFit
          numberOfLines={isSmall ? 4 : 7}
          minimumFontScale={0.35}
        >
          {arabic}
        </Text>
      )}
      {translation.trim() !== '' && (
        <Text
          style={[cardStyles.translationText, { color: mutedColor, fontSize: translationBaseSize + Math.round(fontSizeModifier * 0.5), marginTop: 10, fontStyle: 'italic' }]}
          adjustsFontSizeToFit
          numberOfLines={isSmall ? 3 : 4}
          minimumFontScale={0.5}
        >
          {translation}
        </Text>
      )}
      {reference.trim() !== '' && (
        <Text style={[cardStyles.referenceText, { color: accentColor, fontSize: isSmall ? 9 : 11, marginTop: 8 }]}>
          {reference}
        </Text>
      )}
    </View>
  );
}

function BorderedLayout({
  arabic,
  translation,
  reference,
  textColor,
  accentColor,
  mutedColor,
  borderColor,
  width,
  height,
  fontSizeModifier,
}: LayoutProps) {
  const isSmall = height < 300;
  const pad = isSmall ? 8 : 16;
  const inner = isSmall ? 6 : 10;
  const arabicBaseSize = isSmall ? 16 : 24;
  const translationBaseSize = isSmall ? 9 : 12;

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center', padding: pad }}>
      {/* Outer border */}
      <View style={{
        width: '100%', flex: 1,
        borderWidth: 2, borderColor: accentColor,
        borderRadius: 4,
        justifyContent: 'center', alignItems: 'center',
        padding: inner,
      }}>
        {/* Inner border */}
        <View style={{
          width: '100%', flex: 1,
          borderWidth: 1, borderColor: borderColor || accentColor + '60',
          borderRadius: 2,
          justifyContent: 'center', alignItems: 'center',
          padding: isSmall ? 6 : 12,
        }}>
          {/* Corner diamonds */}
          {['tl','tr','bl','br'].map(c => (
            <Text key={c} style={[cardStyles.cornerDiamond, {
              color: accentColor,
              top: c.startsWith('t') ? -8 : undefined,
              bottom: c.startsWith('b') ? -8 : undefined,
              left: c.endsWith('l') ? -8 : undefined,
              right: c.endsWith('r') ? -8 : undefined,
              fontSize: isSmall ? 10 : 14,
            }]}>✦</Text>
          ))}

          {arabic.trim() !== '' && (
            <Text
              style={[cardStyles.arabicText, { color: textColor, fontSize: arabicBaseSize + fontSizeModifier, lineHeight: (arabicBaseSize + fontSizeModifier) * 1.5, textAlign: 'center' }]}
              adjustsFontSizeToFit
              numberOfLines={isSmall ? 4 : 6}
              minimumFontScale={0.4}
            >
              {arabic}
            </Text>
          )}
          {translation.trim() !== '' && (
            <Text
              style={[cardStyles.translationText, { color: textColor, fontSize: translationBaseSize + Math.round(fontSizeModifier * 0.5), marginTop: 8 }]}
              adjustsFontSizeToFit
              numberOfLines={isSmall ? 2 : 4}
              minimumFontScale={0.5}
            >
              {translation}
            </Text>
          )}
          {reference.trim() !== '' && (
            <Text style={[cardStyles.referenceText, { color: accentColor, fontSize: isSmall ? 8 : 11, marginTop: 8 }]}>
              — {reference}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

function MagazineLayout({ arabic, translation, reference, textColor, accentColor, mutedColor, width, height, fontSizeModifier }: LayoutProps) {
  const isSmall = height < 300;
  const arabicBaseSize = isSmall ? 16 : 24;
  
  return (
    <View style={{ width, height, flexDirection: 'column' }}>
      {/* Top label badge */}
      <View style={{ backgroundColor: accentColor, paddingVertical: isSmall ? 4 : 8, paddingHorizontal: 16, alignItems: 'center' }}>
        <Text style={{ color: '#000', fontFamily: FONTS.english, fontWeight: '800', fontSize: isSmall ? 9 : 11, letterSpacing: 3 }}>
          PROPHETIC WISDOM
        </Text>
      </View>

      {/* Main content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 10 }}>
        {arabic.trim() !== '' && (
          <Text
            style={[cardStyles.arabicText, { color: textColor, fontSize: arabicBaseSize + fontSizeModifier, lineHeight: (arabicBaseSize + fontSizeModifier) * 1.6, textAlign: 'right', width: '100%' }]}
            adjustsFontSizeToFit
            numberOfLines={isSmall ? 4 : 6}
            minimumFontScale={0.4}
          >
            {arabic}
          </Text>
        )}
      </View>

      {/* Bottom strip */}
      <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: isSmall ? 4 : 8, paddingHorizontal: 12 }}>
        {translation.trim() !== '' && (
          <Text
            style={{ color: '#fff', fontFamily: FONTS.english, fontSize: (isSmall ? 8 : 10) + Math.round(fontSizeModifier * 0.3), lineHeight: isSmall ? 12 : 16, marginBottom: 2 }}
            adjustsFontSizeToFit
            numberOfLines={isSmall ? 2 : 3}
          >
            {translation}
          </Text>
        )}
        {reference.trim() !== '' && (
          <Text style={{ color: accentColor, fontFamily: FONTS.english, fontSize: isSmall ? 8 : 10, fontWeight: '700' }}>
            {reference}
          </Text>
        )}
      </View>
    </View>
  );
}

function CalligraphyLayout({ arabic, translation, reference, textColor, accentColor, mutedColor, width, height, fontSizeModifier }: LayoutProps) {
  const isSmall = height < 300;
  const arabicBaseSize = isSmall ? 22 : 32;
  const translationBaseSize = isSmall ? 9 : 12;

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center', padding: isSmall ? 16 : 24 }}>
      {/* Bismillah header */}
      {!isSmall && (
        <Text style={{ fontFamily: FONTS.arabic, fontSize: 16, color: accentColor, marginBottom: 12, textAlign: 'center' }}>
          {BISMILLAH}
        </Text>
      )}

      {/* Large Arabic */}
      {arabic.trim() !== '' && (
        <Text
          style={[cardStyles.arabicText, {
            color: textColor,
            fontSize: arabicBaseSize + fontSizeModifier,
            lineHeight: (arabicBaseSize + fontSizeModifier) * 1.6,
            textAlign: 'center',
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }]}
          adjustsFontSizeToFit
          numberOfLines={isSmall ? 4 : 7}
          minimumFontScale={0.35}
        >
          {arabic}
        </Text>
      )}

      {/* Decorative dots */}
      {!isSmall && (
        <Text style={{ color: accentColor, fontSize: 12, marginVertical: 8, letterSpacing: 6 }}>• • •</Text>
      )}

      {/* Italic translation */}
      {translation.trim() !== '' && (
        <Text
          style={[cardStyles.translationText, { color: mutedColor, fontSize: translationBaseSize + Math.round(fontSizeModifier * 0.4), fontStyle: 'italic', textAlign: 'center' }]}
          adjustsFontSizeToFit
          numberOfLines={isSmall ? 2 : 4}
          minimumFontScale={0.5}
        >
          "{translation}"
        </Text>
      )}
      {reference.trim() !== '' && (
        <Text style={[cardStyles.referenceText, { color: accentColor, fontSize: isSmall ? 8 : 11, marginTop: 8 }]}>
          — {reference}
        </Text>
      )}
    </View>
  );
}

function ModernLayout({ arabic, translation, reference, textColor, accentColor, mutedColor, width, height, fontSizeModifier }: LayoutProps) {
  const isSmall = height < 300;
  const arabicBaseSize = isSmall ? 16 : 24;
  const translationBaseSize = isSmall ? 9 : 12;

  return (
    <View style={{ width, height, flexDirection: 'row' }}>
      {/* Left accent bar */}
      <View style={{ width: 4, backgroundColor: accentColor, borderRadius: 2, marginVertical: isSmall ? 10 : 20, marginLeft: 12 }} />

      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 12, paddingVertical: isSmall ? 10 : 16 }}>
        {/* Type label */}
        <Text style={{ color: accentColor, fontFamily: FONTS.english, fontSize: isSmall ? 8 : 10, fontWeight: '800', letterSpacing: 3, marginBottom: 6 }}>
          WISDOM CARD
        </Text>

        {arabic.trim() !== '' && (
          <Text
            style={[cardStyles.arabicText, { color: textColor, fontSize: arabicBaseSize + fontSizeModifier, lineHeight: (arabicBaseSize + fontSizeModifier) * 1.5, textAlign: 'right' }]}
            adjustsFontSizeToFit
            numberOfLines={isSmall ? 4 : 6}
            minimumFontScale={0.4}
          >
            {arabic}
          </Text>
        )}

        {translation.trim() !== '' && (
          <Text
            style={[cardStyles.translationText, { color: textColor, fontSize: translationBaseSize + Math.round(fontSizeModifier * 0.4), marginTop: 8, textAlign: 'left' }]}
            adjustsFontSizeToFit
            numberOfLines={isSmall ? 2 : 4}
            minimumFontScale={0.5}
          >
            {translation}
          </Text>
        )}
        {reference.trim() !== '' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={{ width: 14, height: 1, backgroundColor: accentColor, marginRight: 4 }} />
            <Text style={[cardStyles.referenceText, { color: accentColor, fontSize: isSmall ? 8 : 10 }]}>
              {reference}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: '#0a0e2a',
  },
  padded: {
    padding: 24,
  },
  arabicText: {
    fontFamily: 'UthmanicHafs',
    textAlign: 'center',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 8,
  },
  translationText: {
    fontFamily: FONTS.english,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  referenceText: {
    fontFamily: FONTS.english,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ornament: {
    fontFamily: 'UthmanicHafs',
    textAlign: 'center',
  },
  dividerLine: {
    height: 1.5,
    width: '60%',
    borderRadius: 1,
  },
  watermark: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  watermarkText: {
    fontFamily: FONTS.english,
    fontSize: 10,
  },
  cornerDiamond: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

// ──────────────────────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────────────────────
export const WisdomCardScreen: React.FC = () => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const viewShotRef = useRef<ViewShot>(null);

  // States
  const [contentType, setContentType] = useState<ContentType>('ayah');
  const [selectedBgId, setSelectedBgId] = useState('star_navy');
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('classic');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('square');

  // Custom Colors & Font Size overrides
  const [customTextColor, setCustomTextColor] = useState<string | undefined>(undefined);
  const [customAccentColor, setCustomAccentColor] = useState<string | undefined>(undefined);
  const [fontSizeModifier, setFontSizeModifier] = useState<number>(0);

  // Ayah tab state
  const [surahModalVisible, setSurahModalVisible] = useState(false);
  const [selectedSurahId, setSelectedSurahId] = useState(1);
  const [ayahInput, setAyahInput] = useState('1');
  const [surahSearch, setSurahSearch] = useState('');

  // Card text state
  const [arabicText, setArabicText] = useState('ٱلْحَمْدُ Lِلَّٰهِ رَبِّ ٱلْعَٰلَمِينَ');
  const [translationText, setTranslationText] = useState('All praise is due to Allah, Lord of all the worlds.');
  const [referenceText, setReferenceText] = useState('Surah Al-Fatiha — 1:2');

  // Hadith/Dua free inputs
  const [hadithArabic, setHadithArabic] = useState('');
  const [hadithTranslation, setHadithTranslation] = useState('');
  const [hadithReference, setHadithReference] = useState('');
  const [duaArabic, setDuaArabic] = useState('');
  const [duaTranslation, setDuaTranslation] = useState('');
  const [duaReference, setDuaReference] = useState('');

  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  // ── Derived ──
  const activeBg   = BACKGROUNDS.find(b => b.id === selectedBgId) ?? BACKGROUNDS[0];
  const activeRatio = ASPECT_RATIOS.find(r => r.id === selectedRatio) ?? ASPECT_RATIOS[0];
  const cardW = activeRatio.w;
  const cardH = activeRatio.h;

  const displayArabic      = contentType === 'ayah' ? arabicText : contentType === 'hadith' ? hadithArabic : duaArabic;
  const displayTranslation = contentType === 'ayah' ? translationText : contentType === 'hadith' ? hadithTranslation : duaTranslation;
  const displayReference   = contentType === 'ayah' ? referenceText : contentType === 'hadith' ? hadithReference : duaReference;

  // Reset colors on background change so they match the background default palette first
  const handleBgSelect = (bgId: string) => {
    setSelectedBgId(bgId);
    setCustomTextColor(undefined);
    setCustomAccentColor(undefined);
  };

  // ── Load Ayah ──
  const loadAyah = useCallback(() => {
    const num = parseInt(ayahInput, 10);
    if (isNaN(num) || num < 1) return;
    const surah = surahs.find(s => s.id === selectedSurahId);
    if (!surah) return;
    const ayah = getAyah(selectedSurahId, num);
    if (!ayah) {
      Alert.alert('Not found', `Ayah ${num} not found in Surah ${surah.name_en}`);
      return;
    }
    setArabicText(ayah.arabic);
    setTranslationText(ayah.english);
    setReferenceText(`${surah.name_en} — ${selectedSurahId}:${num}`);
  }, [selectedSurahId, ayahInput]);

  // ── Capture ──
  const captureCard = async (): Promise<string | null> => {
    try {
      const uri = await (viewShotRef.current as any)?.capture?.();
      return uri ?? null;
    } catch (e) {
      console.warn('Capture error:', e);
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to save images to your gallery.');
        return;
      }
      const uri = await captureCard();
      if (!uri) { Alert.alert('Error', 'Could not capture card.'); return; }
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved!', 'Your Wisdom Card has been saved to the gallery.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save card.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const uri = await captureCard();
      if (!uri) { Alert.alert('Error', 'Could not capture card.'); return; }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Wisdom Card',
        UTI: 'public.png',
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to share card.');
    } finally {
      setSharing(false);
    }
  };

  // ── Surah dropdown filtered ──
  const filteredSurahs = surahSearch.trim()
    ? surahs.filter(s =>
        (s.name_en || '').toLowerCase().includes(surahSearch.toLowerCase()) ||
        (s.name_translit || '').toLowerCase().includes(surahSearch.toLowerCase()) ||
        (s.id || '').toString().includes(surahSearch)
      )
    : surahs;

  const selectedSurah = surahs.find(s => s.id === selectedSurahId) ?? surahs[0];

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>

      {/* ── ScrollView: everything scrollable ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Card Preview (ViewShot wraps only the WisdomCard) ── */}
        <View style={styles.previewWrapper}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1.0 }}
            style={{ borderRadius: 16, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }}
          >
            <WisdomCard
              bg={activeBg}
              style={selectedStyle}
              arabicText={displayArabic}
              translationText={displayTranslation}
              referenceText={displayReference}
              contentType={contentType}
              width={cardW}
              height={cardH}
              customTextColor={customTextColor}
              customAccentColor={customAccentColor}
              fontSizeModifier={fontSizeModifier}
            />
          </ViewShot>
        </View>

        {/* ── Content Type Tabs ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.tabs}>
            {(['ayah', 'hadith', 'dua'] as ContentType[]).map(t => (
              <Pressable
                key={t}
                onPress={() => setContentType(t)}
                style={[styles.tab, contentType === t && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.tabText, { color: contentType === t ? '#fff' : colors.textSecondary }]}>
                  {t === 'ayah' ? 'Quran Ayah' : t === 'hadith' ? 'Hadith' : 'Dua'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ── Ayah Tab ── */}
          {contentType === 'ayah' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Surah</Text>
              <Pressable
                onPress={() => setSurahModalVisible(true)}
                style={[styles.dropdownBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
                  {selectedSurah.id}. {selectedSurah.name_en}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </Pressable>

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Ayah Number</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, flex: 1, marginRight: 8 }]}
                  value={ayahInput}
                  onChangeText={setAyahInput}
                  keyboardType="number-pad"
                  placeholder={`1 – ${selectedSurah.ayahs}`}
                  placeholderTextColor={colors.textMuted}
                />
                <Pressable onPress={loadAyah} style={[styles.loadBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.loadBtnText}>Load</Text>
                </Pressable>
              </View>

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Arabic (editable)</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, textAlign: 'right' }]}
                value={arabicText}
                onChangeText={setArabicText}
                multiline
                placeholder="Arabic text..."
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Translation (editable)</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={translationText}
                onChangeText={setTranslationText}
                multiline
                placeholder="Translation..."
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Reference</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={referenceText}
                onChangeText={setReferenceText}
                placeholder="e.g. Surah Al-Fatiha — 1:1"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          )}

          {/* ── Hadith Tab ── */}
          {contentType === 'hadith' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Arabic Hadith</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, textAlign: 'right' }]}
                value={hadithArabic}
                onChangeText={setHadithArabic}
                multiline
                placeholder="Enter Arabic Hadith text..."
                placeholderTextColor={colors.textMuted}
              />
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>English Translation</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={hadithTranslation}
                onChangeText={setHadithTranslation}
                multiline
                placeholder="Enter Hadith translation..."
                placeholderTextColor={colors.textMuted}
              />
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Reference</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={hadithReference}
                onChangeText={setHadithReference}
                placeholder="e.g. Sahih al-Bukhari 7430"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          )}

          {/* ── Dua Tab ── */}
          {contentType === 'dua' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Arabic Dua</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, textAlign: 'right' }]}
                value={duaArabic}
                onChangeText={setDuaArabic}
                multiline
                placeholder="Enter Arabic Dua..."
                placeholderTextColor={colors.textMuted}
              />
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Translation (optional)</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={duaTranslation}
                onChangeText={setDuaTranslation}
                multiline
                placeholder="Enter translation..."
                placeholderTextColor={colors.textMuted}
              />
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Reference (optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={duaReference}
                onChangeText={setDuaReference}
                placeholder="e.g. Surah Al-Baqarah 2:286"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          )}
        </View>

        {/* ── Background Selector ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Background</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {BACKGROUNDS.map(bg => (
              <Pressable
                key={bg.id}
                onPress={() => handleBgSelect(bg.id)}
                style={[styles.bgChip, selectedBgId === bg.id && { borderColor: colors.primary, borderWidth: 2.5 }]}
              >
                {bg.type === 'image' ? (
                  <Image source={bg.source} style={styles.bgChipImage} />
                ) : (
                  <SafeLinearGradient
                    colors={bg.colors!}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.bgChipImage, { borderRadius: 8, overflow: 'hidden' }]}
                  />
                )}
                <Text style={[styles.bgChipLabel, { color: colors.textSecondary }]} numberOfLines={1}>{bg.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── Custom Font Color & Size Customization ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Color & Font Adjustments</Text>
          
          {/* Font Color */}
          <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Font Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPalette}>
            <Pressable
              onPress={() => setCustomTextColor(undefined)}
              style={[styles.colorBubble, { backgroundColor: colors.background, borderColor: customTextColor === undefined ? colors.primary : colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: '700' }}>Auto</Text>
            </Pressable>
            {TEXT_COLORS.map(c => (
              <Pressable
                key={c.id}
                onPress={() => setCustomTextColor(c.hex)}
                style={[styles.colorBubble, { backgroundColor: c.hex, borderColor: customTextColor === c.hex ? colors.primary : 'transparent', borderWidth: customTextColor === c.hex ? 2.5 : 0 }]}
              >
                <View style={{ width: 20, height: 2, backgroundColor: c.hex === '#ffffff' ? '#ddd' : '#111', opacity: 0.1 }} />
              </Pressable>
            ))}
          </ScrollView>

          {/* Accent Color */}
          <Text style={[styles.subLabel, { color: colors.textSecondary, marginTop: 10 }]}>Accent/Border Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPalette}>
            <Pressable
              onPress={() => setCustomAccentColor(undefined)}
              style={[styles.colorBubble, { backgroundColor: colors.background, borderColor: customAccentColor === undefined ? colors.primary : colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: '700' }}>Auto</Text>
            </Pressable>
            {ACCENT_COLORS.map(c => (
              <Pressable
                key={c.id}
                onPress={() => setCustomAccentColor(c.hex)}
                style={[styles.colorBubble, { backgroundColor: c.hex, borderColor: customAccentColor === c.hex ? colors.primary : 'transparent', borderWidth: customAccentColor === c.hex ? 2.5 : 0 }]}
              />
            ))}
          </ScrollView>

          {/* Font Size Adjuster */}
          <Text style={[styles.subLabel, { color: colors.textSecondary, marginTop: 14 }]}>Arabic Font Size Offset</Text>
          <View style={styles.sizeControlRow}>
            <Pressable
              onPress={() => setFontSizeModifier(m => Math.max(-8, m - 2))}
              style={[styles.sizeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <Ionicons name="remove" size={18} color={colors.textPrimary} />
            </Pressable>
            
            <View style={styles.sizeValueContainer}>
              <Text style={{ color: colors.textPrimary, fontWeight: 'bold', fontSize: 14 }}>
                {fontSizeModifier > 0 ? `+${fontSizeModifier}` : fontSizeModifier} px
              </Text>
            </View>

            <Pressable
              onPress={() => setFontSizeModifier(m => Math.min(16, m + 2))}
              style={[styles.sizeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <Ionicons name="add" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* ── Style Selector ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Typography Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {STYLES.map(s => (
              <Pressable
                key={s.id}
                onPress={() => setSelectedStyle(s.id)}
                style={[styles.styleChip, { backgroundColor: colors.background, borderColor: selectedStyle === s.id ? colors.primary : colors.border }]}
              >
                <Ionicons name={s.icon} size={20} color={selectedStyle === s.id ? colors.primary : colors.textSecondary} />
                <Text style={[styles.styleChipText, { color: selectedStyle === s.id ? colors.primary : colors.textSecondary }]}>
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── Aspect Ratio ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Aspect Ratio</Text>
          <View style={styles.ratioRow}>
            {ASPECT_RATIOS.map(r => (
              <Pressable
                key={r.id}
                onPress={() => setSelectedRatio(r.id)}
                style={[styles.ratioBtn, { borderColor: selectedRatio === r.id ? colors.primary : colors.border, backgroundColor: selectedRatio === r.id ? colors.primary + '20' : colors.background }]}
              >
                <Text style={{ fontSize: 18 }}>{r.icon}</Text>
                <Text style={[styles.ratioBtnLabel, { color: selectedRatio === r.id ? colors.primary : colors.textSecondary }]}>
                  {r.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Action Buttons ── */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border, flex: 1, marginRight: 8 }]}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color={colors.primary} />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>Save to Gallery</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={handleShare}
            disabled={sharing}
            style={[styles.actionBtn, { backgroundColor: colors.primary, flex: 1 }]}
          >
            {sharing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="share-outline" size={20} color="#fff" />
                <Text style={[styles.actionBtnText, { color: '#fff' }]}>Share Card</Text>
              </>
            )}
          </Pressable>
        </View>

      </ScrollView>

      {/* ── Surah Picker Modal ── */}
      <Modal
        visible={surahModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSurahModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Surah</Text>
              <Pressable onPress={() => setSurahModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={surahSearch}
              onChangeText={setSurahSearch}
              placeholder="Search surah..."
              placeholderTextColor={colors.textMuted}
            />
            <FlatList
              data={filteredSurahs}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedSurahId(item.id);
                    setAyahInput('1');
                    setSurahModalVisible(false);
                    setSurahSearch('');
                  }}
                  style={[styles.surahRow, { borderBottomColor: colors.border, backgroundColor: item.id === selectedSurahId ? colors.primary + '15' : 'transparent' }]}
                >
                  <View style={[styles.surahNumBadge, { backgroundColor: item.id === selectedSurahId ? colors.primary : colors.background }]}>
                    <Text style={[styles.surahNum, { color: item.id === selectedSurahId ? '#fff' : colors.textMuted }]}>{item.id}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.surahName, { color: colors.textPrimary }]}>{item.name_en}</Text>
                    <Text style={[styles.surahVerses, { color: colors.textMuted }]}>{item.ayahs} verses</Text>
                  </View>
                  <Text style={[styles.surahArabicName, { color: item.id === selectedSurahId ? colors.primary : colors.textSecondary }]}>{item.name_ar}</Text>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ──────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },

  previewWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginBottom: 12,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
  },

  inputGroup: { gap: 4 },
  label: { fontFamily: FONTS.english, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  subLabel: { fontFamily: FONTS.english, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.english,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.english,
    fontSize: 14,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: { fontFamily: FONTS.english, fontSize: 14 },
  loadBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadBtnText: { color: '#fff', fontFamily: FONTS.english, fontWeight: '700', fontSize: 14 },

  sectionTitle: { fontFamily: FONTS.english, fontSize: 14, fontWeight: '700', marginBottom: 10 },

  hScroll: { marginHorizontal: -4 },
  bgChip: {
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  bgChipImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  bgChipLabel: {
    fontFamily: FONTS.english,
    fontSize: 10,
    marginTop: 4,
    width: 60,
    textAlign: 'center',
  },

  colorPalette: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  colorBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  sizeControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  sizeBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeValueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  styleChip: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 4,
    minWidth: 80,
  },
  styleChipText: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '600',
  },

  ratioRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratioBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 4,
  },
  ratioBtnLabel: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '700',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  actionBtnText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    height: '82%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '700',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.english,
    fontSize: 14,
    marginBottom: 8,
  },
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    gap: 10,
  },
  surahNumBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahNum: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '700',
  },
  surahName: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '600',
  },
  surahVerses: {
    fontFamily: FONTS.english,
    fontSize: 11,
    marginTop: 1,
  },
  surahArabicName: {
    fontFamily: 'UthmanicHafs',
    fontSize: 18,
  },
});
