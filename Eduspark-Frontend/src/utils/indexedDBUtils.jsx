// src/utils/indexedDBUtils.js

import { set, get, del } from 'idb-keyval';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;




// 🔐 Encrypt before storing
const encryptData = (data) => {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
};

// 🔓 Decrypt after loading
const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedJson);
};

// ✅ Save encrypted data
export const saveToIndexedDB = async (key, value) => {
  try {
    const encrypted = encryptData(value);
    await set(key, encrypted);
  } catch (error) {
    console.error("❌ Error saving to IndexedDB:", error);
  }
};

// ✅ Get and decrypt data
export const getFromIndexedDB = async (key) => {
  try {
    const encrypted = await get(key);
    if (!encrypted) return null;
    const decrypted = decryptData(encrypted);
    return decrypted;
  } catch (error) {
    console.error("❌ Error reading from IndexedDB:", error);
    return null;
  }
};

// ❌ Delete data
export const removeFromIndexedDB = async (key) => {
  try {
    await del(key);
  } catch (error) {
    console.error("❌ Error deleting from IndexedDB:", error);
  }
};
