import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spiritualTimeTracker } from '../services/spiritualTimeTracker';

export function useSpiritualTimeTracker(screenName: string) {
  const navigation = useNavigation();
  const startTimeRef = useRef<number>(Date.now());
  const isFocusedRef = useRef<boolean>(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const flushTime = () => {
    if (!isFocusedRef.current || appStateRef.current !== 'active') {
      return;
    }
    const now = Date.now();
    const elapsedMs = now - startTimeRef.current;
    if (elapsedMs > 500) {
      const seconds = elapsedMs / 1000;
      spiritualTimeTracker.addActiveSeconds(seconds);
    }
    startTimeRef.current = now;
  };

  useEffect(() => {
    // Focus listener
    const unsubscribeFocus = navigation.addListener('focus', () => {
      isFocusedRef.current = true;
      startTimeRef.current = Date.now();
    });

    // Blur listener
    const unsubscribeBlur = navigation.addListener('blur', () => {
      flushTime();
      isFocusedRef.current = false;
    });

    // AppState listener to handle app backgrounding
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current === 'active' && nextAppState !== 'active') {
        // App is backgrounding/deactivating
        flushTime();
      } else if (appStateRef.current !== 'active' && nextAppState === 'active') {
        // App is returning to foreground
        startTimeRef.current = Date.now();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Periodical update (e.g. every 10 seconds to keep widget updated and avoid losing tracking data)
    const interval = setInterval(() => {
      flushTime();
    }, 10000);

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      subscription.remove();
      clearInterval(interval);
      flushTime();
    };
  }, [navigation]);
}
