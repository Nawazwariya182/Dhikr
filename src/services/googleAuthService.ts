import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_DRIVE_CONFIG } from '../utils/constants';

export interface UserProfile {
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
}

const SECURE_KEYS = {
  ACCESS_TOKEN: 'gdrive_access_token',
};

const ASYNC_KEYS = {
  USER_PROFILE: '@gdrive_user_profile',
};

class GoogleAuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true,
  };

  private listeners: ((state: AuthState) => void)[] = [];
  public isNativeAvailable = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize native Google SDK and restore auth states
   */
  private async init() {
    try {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.appdata'],
        webClientId: GOOGLE_DRIVE_CONFIG.webClientId || GOOGLE_DRIVE_CONFIG.clientId,
        offlineAccess: true, // enables token refresh capabilities
      });
      this.isNativeAvailable = true;
    } catch (e) {
      console.warn('[Auth] Native Google Sign-In SDK configuration failed:', e);
      this.isNativeAvailable = false;
    }

    if (this.isNativeAvailable) {
      try {
        // Check if natively signed in
        const isSignedIn = await GoogleSignin.hasPreviousSignIn();
        if (isSignedIn) {
          console.log('[Auth] Natively signed in, performing silent sign-in...');
          const response = await GoogleSignin.signInSilently();
          
          if (response.type === 'success') {
            const nativeUser = response.data;
            const tokens = await GoogleSignin.getTokens();

            const profile: UserProfile = {
              email: nativeUser.user.email,
              name: nativeUser.user.name || undefined,
              picture: nativeUser.user.photo || undefined,
            };

            await SecureStore.setItemAsync(SECURE_KEYS.ACCESS_TOKEN, tokens.accessToken);
            await AsyncStorage.setItem(ASYNC_KEYS.USER_PROFILE, JSON.stringify(profile));

            this.authState.user = profile;
            this.authState.isAuthenticated = true;
          }
        } else {
          // Fallback: Check if manual token is stored
          const accessToken = await SecureStore.getItemAsync(SECURE_KEYS.ACCESS_TOKEN);
          const profileStr = await AsyncStorage.getItem(ASYNC_KEYS.USER_PROFILE);

          if (accessToken && profileStr) {
            this.authState.user = JSON.parse(profileStr);
            this.authState.isAuthenticated = true;
          }
        }
      } catch (e) {
        console.log('[Auth] Native silent check failed or no user signed in:', e);
        try {
          const accessToken = await SecureStore.getItemAsync(SECURE_KEYS.ACCESS_TOKEN);
          const profileStr = await AsyncStorage.getItem(ASYNC_KEYS.USER_PROFILE);
          if (accessToken && profileStr) {
            this.authState.user = JSON.parse(profileStr);
            this.authState.isAuthenticated = true;
          }
        } catch (err) {
          await this.clearAuthData();
        }
      }
    } else {
      // Fallback: Check if manual token is stored
      try {
        const accessToken = await SecureStore.getItemAsync(SECURE_KEYS.ACCESS_TOKEN);
        const profileStr = await AsyncStorage.getItem(ASYNC_KEYS.USER_PROFILE);
        if (accessToken && profileStr) {
          this.authState.user = JSON.parse(profileStr);
          this.authState.isAuthenticated = true;
        }
      } catch (err) {
        await this.clearAuthData();
      }
    }

    this.authState.loading = false;
    this.notifyListeners();
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener({ ...this.authState });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const stateCopy = { ...this.authState };
    this.listeners.forEach((listener) => listener(stateCopy));
  }

  /**
   * Get the current active access token. Refreshes token automatically via native SDK.
   */
  async getAccessToken(): Promise<string | null> {
    try {
      if (this.isNativeAvailable) {
        const isNativelySignedIn = await GoogleSignin.hasPreviousSignIn();
        if (isNativelySignedIn) {
          const tokens = await GoogleSignin.getTokens();
          await SecureStore.setItemAsync(SECURE_KEYS.ACCESS_TOKEN, tokens.accessToken);
          return tokens.accessToken;
        }
      }
    } catch (e) {
      console.error('[Auth] Error getting native access token:', e);
    }

    // Fallback manual token
    return await SecureStore.getItemAsync(SECURE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Performs native Google Sign-in dialog flow
   */
  async loginNatively(): Promise<boolean> {
    if (!this.isNativeAvailable) {
      throw new Error('Native Google Sign-In is not supported in this environment (e.g., Expo Go). Please use the Manual Token input on the settings screen, or compile a native build.');
    }
    this.authState.loading = true;
    this.notifyListeners();

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'success') {
        const nativeUser = response.data;
        const tokens = await GoogleSignin.getTokens();

        const profile: UserProfile = {
          email: nativeUser.user.email,
          name: nativeUser.user.name || undefined,
          picture: nativeUser.user.photo || undefined,
        };

        await SecureStore.setItemAsync(SECURE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        await AsyncStorage.setItem(ASYNC_KEYS.USER_PROFILE, JSON.stringify(profile));

        this.authState.user = profile;
        this.authState.isAuthenticated = true;
        this.notifyListeners();
        return true;
      } else {
        console.log('[Auth] Native sign-in did not succeed:', response.type);
        return false;
      }
    } catch (e) {
      console.error('[Auth] Native sign-in failed:', e);
      throw e;
    } finally {
      this.authState.loading = false;
      this.notifyListeners();
    }
  }

  /**
   * Helper: fetches Google user profile info
   */
  async fetchUserProfile(token: string): Promise<UserProfile | null> {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.email) {
          const profile: UserProfile = {
            email: data.email,
            name: data.name || undefined,
            picture: data.picture || undefined,
          };
          await AsyncStorage.setItem(ASYNC_KEYS.USER_PROFILE, JSON.stringify(profile));
          
          this.authState.user = profile;
          this.authState.isAuthenticated = true;
          this.notifyListeners();
          
          return profile;
        }
      } else {
        const err = await res.text();
        console.warn('[Auth] Failed to fetch user info:', res.status, err);
      }
    } catch (e) {
      console.warn('[Auth] Error fetching user profile:', e);
    }
    return null;
  }

  /**
   * Exchange an Authorization Code for Access & Refresh tokens
   */
  async exchangeCodeForTokens(code: string): Promise<boolean> {
    this.authState.loading = true;
    this.notifyListeners();

    try {
      const body = `client_id=${encodeURIComponent(GOOGLE_DRIVE_CONFIG.clientId)}` +
                   `&client_secret=${encodeURIComponent(GOOGLE_DRIVE_CONFIG.clientSecret || '')}` +
                   `&code=${encodeURIComponent(code)}` +
                   `&redirect_uri=${encodeURIComponent(GOOGLE_DRIVE_CONFIG.redirectUri)}` +
                   `&grant_type=authorization_code`;

      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Token exchange failed (${res.status}): ${errText}`);
      }

      const data = await res.json();
      if (data && data.access_token) {
        await SecureStore.setItemAsync(SECURE_KEYS.ACCESS_TOKEN, data.access_token);
        await this.fetchUserProfile(data.access_token);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[Auth] Error in exchangeCodeForTokens:', e);
      throw e;
    } finally {
      this.authState.loading = false;
      this.notifyListeners();
    }
  }

  /**
   * Login manually with an Access Token directly
   */
  async loginWithDirectToken(token: string): Promise<boolean> {
    this.authState.loading = true;
    this.notifyListeners();
    try {
      const profile = await this.fetchUserProfile(token);
      if (profile) {
        await SecureStore.setItemAsync(SECURE_KEYS.ACCESS_TOKEN, token);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[Auth] Direct token login error:', e);
      return false;
    } finally {
      this.authState.loading = false;
      this.notifyListeners();
    }
  }

  /**
   * Logout and clear all stored credentials
   */
  async logout(): Promise<void> {
    try {
      if (this.isNativeAvailable) {
        const isNativelySignedIn = await GoogleSignin.hasPreviousSignIn();
        if (isNativelySignedIn) {
          await GoogleSignin.signOut();
        }
      }
    } catch (e) {
      console.warn('[Auth] Native logout failed:', e);
    }
    await this.clearAuthData();
    this.notifyListeners();
  }

  private async clearAuthData() {
    try {
      await SecureStore.deleteItemAsync(SECURE_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(ASYNC_KEYS.USER_PROFILE);
    } catch (e) {
      console.error('[Auth] Error clearing auth data:', e);
    }
    this.authState.isAuthenticated = false;
    this.authState.user = null;
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }
}

export const googleAuthService = new GoogleAuthService();
