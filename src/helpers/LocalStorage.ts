/**
 * A function which tries to retrieve a value stored under the specified key from local storage and deserialize it to type TData.
 * If there is no such value, a default, provided by the caller, is returned.
 *
 * @param key The key to retrieve the value from in local storage
 * @param defaultValue A value, or function returning a value, to return if the specified key does not exist in local storage
 * @returns The value stored in the browser local storage, deserialized to type TData, if a value exists, or the specified default value
 */
export const getFromLocalStorage = <TData>(
    key: string,
    defaultValue: TData | (() => TData),
  ): TData => {
    const defaultVal =
      defaultValue instanceof Function ? defaultValue() : defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (error) {
      console.error(error);
      return defaultVal;
    }
  };
  
  /**
   * A function which persists a provided value to local storage under the provided key.  The caller can optional trigger a browser storage event
   * which allows the useLocalStorage hook to be notified of the change, and update its state accordingly.
   * By default, the browser only automatically fires a storage event when a local storage key is modified **outside** of the current document,
   * i.e in another tab or window.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event.
   *
   * @param key The key to persist the value under
   * @param value A value, or function returning a value, to persist in local storage.  If the value is falsy, any currently stored value will be cleared
   * @param emitEvent A flag indicating if the window storage event should be manually invoked
   */
  export const persistToLocalStorage = <TData>(
    key: string,
    value: TData | (() => TData),
    emitEvent = false,
  ): void => {
    try {
      const persistVal = value instanceof Function ? value() : value;
  
      let oldValue = undefined;
      try {
        oldValue = window.localStorage.getItem(key);
      } catch (error) {}
  
      const newValue = JSON.stringify(persistVal);
      if (newValue) {
        window.localStorage.setItem(key, newValue);
      } else {
        window.localStorage.removeItem(key);
      }
  
      // Explicitly fire a window storage event if requested by the caller
      if (emitEvent) {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            storageArea: window.localStorage,
            newValue,
            oldValue,
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  /**
   *
   * @param key The key to persist the value under
   * @param emitEvent A flag indicating if the window storage event should be manually invoked
   */
  export const clearLocalStorageValue = (key: string, emitEvent = false) => {
    let oldValue = undefined;
    try {
      oldValue = window.localStorage.getItem(key);
    } catch (error) {}
  
    try {
      window.localStorage.removeItem(key);
  
      if (emitEvent) {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            storageArea: window.localStorage,
            newValue: null,
            oldValue: oldValue,
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  