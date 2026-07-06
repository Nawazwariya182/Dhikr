import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  initializeFirestore,
  persistentLocalCache,
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
// ─────────────────────────────────────────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "74884040959",
  appId: "",
  measurementId: ""
};

// ─────────────────────────────────────────────────────────────────────────────
// Initialization — gracefully falls back to offline-only mode if unconfigured
// ─────────────────────────────────────────────────────────────────────────────

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

// Stop using Firebase for now. Change to true to enable Firebase operations.
const ENABLE_FIREBASE = false;
const isConfigured = ENABLE_FIREBASE && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY_HERE';

if (isConfigured) {
  try {
    firebaseApp = getApps().length === 0
      ? initializeApp(FIREBASE_CONFIG)
      : getApp();

    try {
      const storage = (AsyncStorage as any).default || AsyncStorage;
      const { getReactNativePersistence } = require('firebase/auth');
      firebaseAuth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(storage),
      });
    } catch (authErr: any) {
      if (authErr && authErr.code === 'auth/already-initialized') {
        firebaseAuth = getAuth(firebaseApp);
      } else {
        console.warn('⚠ Firebase Auth initializeAuth error:', authErr);
        try {
          firebaseAuth = getAuth(firebaseApp);
        } catch (getAuthErr) {
          console.warn('⚠ Firebase Auth getAuth fallback error:', getAuthErr);
        }
      }
    }

    // 2. Initialize Firestore second with native local persistent cache
    try {
      firestoreDb = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({}),
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
    '  To enable cloud sync, edit src/services/firebaseConfig.ts\n' +
    '  and replace YOUR_... placeholders with your Firebase project credentials.'
  );
}

export { firebaseApp, firestoreDb, firebaseAuth };
export const isFirebaseEnabled = isConfigured && !!firestoreDb;
