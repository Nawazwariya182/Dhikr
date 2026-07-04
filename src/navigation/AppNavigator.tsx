import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { SurahScreen } from '../screens/SurahScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
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
  Search: undefined;
  Bookmarks: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const tabIcons: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'book', default: 'book-outline' },
  Search: { focused: 'search', default: 'search-outline' },
  Bookmarks: { focused: 'bookmark', default: 'bookmark-outline' },
  Settings: { focused: 'settings', default: 'settings-outline' },
};

function TabNavigator() {
  const { colors } = useAppPreferences();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: FONTS.english,
          fontWeight: '600' as const,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: FONTS.english,
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconSet = tabIcons[route.name];
          const iconName = focused ? iconSet.focused : iconSet.default;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { colors } = useAppPreferences();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
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
        component={SurahScreen}
        options={() => ({
          title: '',
          headerShadowVisible: false,
          animation: 'slide_from_right',
        })}
      />
      <Stack.Screen
        name="PrayerTracker"
        component={PrayerTrackerScreen}
        options={() => ({
          title: 'Prayer Tracker',
          headerShadowVisible: false,
          animation: 'slide_from_right',
        })}
      />
    </Stack.Navigator>
  );
}
