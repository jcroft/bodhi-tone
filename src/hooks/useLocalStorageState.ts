import { useCallback, useEffect, useState } from 'react';
import {
  clearLocalStorageValue,
  getFromLocalStorage,
  persistToLocalStorage,
} from '../helpers/LocalStorage'

/**
 * A hook for data persistence with a signature similar to the default react `useState` hook
 * The hook takes a key under which data should be stored, and an initial value to use if no value is persisted and returns a tuple
 * with the current state value, and a function to update it.
 *
 * The watches for changes in key to update the stored data based on what is persisted under the new key, and also listens
 * for browser storage events being fired for the specified key, allowing the hook to be aware of changes made in other windows/tabs,
 * and also allowing for other code to modify the persisted value, and the hook update.
 *
 * @param key The key to persist data under
 * @param initialValue The initial value to use if no value is persisted, or local storage is unavailable (for example in a private browser tab)
 * @returns @type {[TData, (value: TData | (() => TData)) => void]}
 */
export const useLocalStorageState = <TData>(
  key: string,
  initialValue: TData | (() => TData),
): readonly [
  TData,
  (value: TData | (() => TData), emitEvent?: boolean) => void,
] => {
  // Use default react useState locally so we don't have to read from local storage every time
  const [hookState, setHookState] = useState<TData>(() =>
    getFromLocalStorage(key, initialValue),
  );

  // Listen for changes in key so we can reload our state accordingly
  useEffect(() => {
    //  Assign a closure so the same event listener gets unhooked
    const resetState = () => {
      setHookState(getFromLocalStorage(key, initialValue));
    };
    window.addEventListener('storage', (ev) => {
      // Ignore changes under any other key
      if (ev.key === key) {
        resetState();
      }
    });
    // Make sure we return a cleanup to remove the listener
    return () => window.removeEventListener('storage', resetState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: TData | (() => TData), emitEvent = false) => {
      try {
        const defaultValue =
          initialValue instanceof Function ? initialValue() : initialValue;
        const persistVal = value instanceof Function ? value() : value;
        // First update the local state, because persist to local storage might fail, i.e in private tabs
        setHookState(persistVal);

        if (persistVal === defaultValue) {
          clearLocalStorageValue(key, emitEvent);
          return;
        }

        persistToLocalStorage(key, persistVal, emitEvent);
      } catch (error) {
        console.error(error);
      }
    },
    [initialValue, key],
  );

  return [hookState, setValue] as const;
};
