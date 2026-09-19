import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  Firestore,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';
import { StudentRecord } from '../types';

// Read config from Vite import.meta.env with fallback to process.env and firebase-applet-config.json
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

export const getFirebaseConfig = () => {
  const envApiKey = getEnvVar('VITE_FIREBASE_API_KEY');
  const envProjectId = getEnvVar('VITE_FIREBASE_PROJECT_ID');

  // Prefer environment variables if explicitly set, otherwise use provisioned appletConfig
  return {
    apiKey: envApiKey || appletConfig.apiKey || '',
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || appletConfig.authDomain || '',
    projectId: envProjectId || appletConfig.projectId || '',
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || appletConfig.storageBucket || '',
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || appletConfig.messagingSenderId || '',
    appId: getEnvVar('VITE_FIREBASE_APP_ID') || appletConfig.appId || '',
    firestoreDatabaseId: appletConfig.firestoreDatabaseId || '',
  };
};

export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
};

let firebaseAppInstance: FirebaseApp | null = null;
let firestoreDbInstance: Firestore | null = null;

export const getFirestoreClient = (): Firestore | null => {
  if (firestoreDbInstance) return firestoreDbInstance;

  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const config = getFirebaseConfig();
    const existingApps = getApps();
    firebaseAppInstance = existingApps.length > 0 ? existingApps[0] : initializeApp(config);

    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      firestoreDbInstance = getFirestore(firebaseAppInstance, config.firestoreDatabaseId);
    } else {
      firestoreDbInstance = getFirestore(firebaseAppInstance);
    }
    return firestoreDbInstance;
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
    return null;
  }
};

export interface SaveResult {
  success: boolean;
  docId: string | null;
  isLocalStorageOnly: boolean;
  message: string;
  timestamp: string;
}

/**
 * Saves correlation record to Firestore 'student_correlations' collection
 * Falls back safely to localStorage if Firebase credentials are not yet configured in env.
 */
export async function saveStudentCorrelation(
  record: Omit<StudentRecord, 'id'>
): Promise<SaveResult> {
  const nowIso = new Date().toISOString();
  const db = getFirestoreClient();
  const config = getFirebaseConfig();

  if (db && isFirebaseConfigured()) {
    try {
      // Ensure integer values for Firestore rules
      const valA = Math.round(Number(record.variableA_value));
      const valB = Math.round(Number(record.variableB_value));

      const docRef = await addDoc(collection(db, 'student_correlations'), {
        nickname: record.nickname,
        variableA_value: valA,
        variableB_value: valB,
        topicId: record.topicId,
        timestamp: serverTimestamp(),
      });

      return {
        success: true,
        docId: docRef.id,
        isLocalStorageOnly: false,
        message: `Firestore 'student_correlations'에 성공적으로 저장되었습니다. (문서 ID: ${docRef.id.slice(0, 8)}...)`,
        timestamp: nowIso,
      };
    } catch (error: any) {
      console.error('[Firebase] Save error:', error);
      // Save locally as backup on network or permission failure
      const localId = backupToLocalStorage(record, nowIso);
      return {
        success: false,
        docId: localId,
        isLocalStorageOnly: true,
        message: `Firestore 저장 중 알림 (${error?.message || '권한 또는 네트워크 오류'}). 로컬 백업 완료.`,
        timestamp: nowIso,
      };
    }
  }

  // Local storage mode when Firebase env vars/config are not present
  const localId = backupToLocalStorage(record, nowIso);
  return {
    success: true,
    docId: localId,
    isLocalStorageOnly: true,
    message: '로컬 브라우저 저장소에 안전하게 기록되었습니다.',
    timestamp: nowIso,
  };
}

function backupToLocalStorage(record: Omit<StudentRecord, 'id'>, timestamp: string): string {
  try {
    const key = 'student_correlations_local_records';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const localId = 'local_' + Math.random().toString(36).substring(2, 9);
    existing.push({
      id: localId,
      ...record,
      timestamp,
    });
    localStorage.setItem(key, JSON.stringify(existing));
    return localId;
  } catch (e) {
    return 'local_' + Date.now();
  }
}
