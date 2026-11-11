import * as SecureStore from "expo-secure-store";
import { StateStorage } from "zustand/middleware";

export const secureStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return SecureStore.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    SecureStore.setItem(name, value);
  },
  removeItem: (name: string): void => {
    SecureStore.deleteItemAsync(name);
  },
};

export async function getStorageItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function setStorageItem(key: string, value: string): Promise<void> {
  return SecureStore.setItemAsync(key, value);
}

export async function removeStorageItem(key: string): Promise<void> {
  return SecureStore.deleteItemAsync(key);
}
