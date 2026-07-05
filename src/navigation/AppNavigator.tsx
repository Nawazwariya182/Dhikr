import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { SurahScreen } from '../screens/SurahScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DhikrScreen } from '../screens/DhikrScreen';
import { PrayerTrackerScreen } from '../screens/PrayerTrackerScreen';
import { FONTS } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';

export type RootStackParamList = {
  Main: undefined;
  Surah: { surahId?: number; juzNumber?: number; initialAyah?: number };
  PrayerTracker: undefined;
};

export type TabParamList = {
  Home: undefined;
  Quran: undefined;
  Dhikr: undefined;
  Bookmarks: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const tabIcons: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Quran: { focused: 'book', default: 'book-outline' },
  Dhikr: { focused: 'heart', default: 'heart-outline' },
  Bookmarks: { focused: 'bookmark', default: 'bookmark-outline' },
  Settings: { focused: 'settings', default: 'settings-outline' },
};

function TabNavigator() {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          const iconSet = tabIcons[route.name];
          const iconName = focused ? iconSet.focused : iconSet.default;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.english,
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quran" component={SearchScreen} />
      <Tab.Screen name="Dhikr" component={DhikrScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  const { colors } = useAppPreferences();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: FONTS.english,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Surah"
        component={SurahScreen as any}
        options={() => ({
          title: '',
          headerShadowVisible: false,
          animation: 'slide_from_right',
        })}
      />
      <Stack.Screen
        name="PrayerTracker"
        component={PrayerTrackerScreen as any}
        options={() => ({
          title: 'Prayer Tracker',
          headerShadowVisible: false,
          animation: 'slide_from_right',
        })}
      />
    </Stack.Navigator>
  );
};
