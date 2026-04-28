import admin from 'firebase-admin';

let firebaseApp = null;
let firestore = null;
let initAttempted = false;

export function getFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;
  if (initAttempted) return null;

  initAttempted = true;

  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    return null;
  }

  try {
    firebaseApp = admin.apps.length
      ? admin.app()
      : admin.initializeApp({
          credential: admin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: FIREBASE_CLIENT_EMAIL
          })
        });
    return firebaseApp;
  } catch (error) {
    console.warn('Firebase Admin disabled:', error.message);
    return null;
  }
}

export function getFirestore() {
  if (firestore) return firestore;
  const app = getFirebaseAdmin();
  if (!app) return null;
  firestore = admin.firestore();
  return firestore;
}

export async function saveDocument(collection, id, data) {
  const db = getFirestore();
  if (!db) return false;
  try {
    await db.collection(collection).doc(id).set(data, { merge: true });
    return true;
  } catch (error) {
    console.warn(`Firestore save skipped for ${collection}/${id}:`, error.message);
    return false;
  }
}

export async function getDocument(collection, id) {
  const db = getFirestore();
  if (!db) return null;
  try {
    const snapshot = await db.collection(collection).doc(id).get();
    return snapshot.exists ? snapshot.data() : null;
  } catch (error) {
    console.warn(`Firestore read skipped for ${collection}/${id}:`, error.message);
    return null;
  }
}

export default admin;
