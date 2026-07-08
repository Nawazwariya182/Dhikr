import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-expect-error: getReactNativePersistence is not exported in standard firebase/auth types but is present at runtime in React Native
import { initializeAuth, getAuth, Auth, getReactNativePersistence } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  initializeFirestore,
  memoryLocalCache,
} from 'firebase/firestore';


// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE CREDENTIALS
//
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (e.g. "Dikhr-App")
// 3. Click ⚙ Project Settings → Your Apps → Add App → Web (</>)
// 4. Copy the firebaseConfig object and paste your values below
// 5. In Firebase console: Build → Firestore Database → Create database
//    (start in "test mode" for development)
// 6. In Firebase console: Build → Authentication → Sign-in method → Google → Enable
//
// IMPORTANT: Set EXPO_PUBLIC_FIREBASE_APP_ID in your .env file to enable Firebase!
// ─────────────────────────────────────────────────────────────────────────────

// Read env values safely — process.env access can be undefined in some RN builds
const _apiKey = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_FIREBASE_API_KEY) || '';
const _authDomain = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN) || 'dhikr-9bdeb.firebaseapp.com';
const _projectId = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_FIREBASE_PROJECT_ID) || 'dhikr-9bdeb';
const _storageBucket = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET) || 'dhikr-9bdeb.firebasestorage.app';
const _messagingSenderId = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || '481773828965';
const _appId = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_FIREBASE_APP_ID) || '';
const _measurementId = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID) || '';

const FIREBASE_CONFIG = {
  apiKey: _apiKey,
  authDomain: _authDomain,
  projectId: _projectId,
  storageBucket: _storageBucket,
  messagingSenderId: _messagingSenderId,
  appId: _appId,
  measurementId: _measurementId,
};

// ─────────────────────────────────────────────────────────────────────────────
// Initialization — gracefully falls back to offline-only mode if unconfigured
// ─────────────────────────────────────────────────────────────────────────────

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

// Check that credentials are real (not empty or placeholder values)
const isConfigured =
  !!FIREBASE_CONFIG.apiKey &&
  FIREBASE_CONFIG.apiKey !== '' &&
  !!FIREBASE_CONFIG.appId &&
  FIREBASE_CONFIG.appId !== '' &&
  !FIREBASE_CONFIG.appId.includes('YOUR_APP_ID_HERE');

if (isConfigured) {
  try {
    firebaseApp = getApps().length === 0
      ? initializeApp(FIREBASE_CONFIG)
      : getApp();

    try {
      firebaseAuth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (authErr: any) {
      try {
        firebaseAuth = getAuth(firebaseApp);
      } catch (fallbackErr) {
        console.warn('⚠ Firebase Auth initialization error:', authErr);
      }
    }

    // 2. Initialize Firestore with memory cache (React Native has no IndexedDB for persistent cache)
    try {
      firestoreDb = initializeFirestore(firebaseApp, {
        localCache: memoryLocalCache({}),
      });
    } catch (dbErr) {
      firestoreDb = getFirestore(firebaseApp);
    }

    console.log('✓ Firebase initialized successfully.');
  } catch (error: any) {
    console.warn('Firebase init error:', error?.message ?? error);
  }
} else {
  console.log(
    '⚠ Firebase: Credentials not set — running in offline-only mode.\n' +
    '  To enable cloud sync, set EXPO_PUBLIC_FIREBASE_APP_ID in your .env file.\n' +
    '  Get your App ID from: Firebase Console → Project Settings → Your Apps → Web'
  );
}

export { firebaseApp, firestoreDb, firebaseAuth };
export const isFirebaseEnabled = isConfigured && !!firestoreDb;
