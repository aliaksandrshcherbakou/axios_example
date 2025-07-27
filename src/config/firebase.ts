import {initializeApp} from 'firebase/app';
import {Auth, getAuth, initializeAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {Platform} from 'react-native';

// Your Firebase config - Replace with your actual config
const firebaseConfig = {
  apiKey: 'AIzaSyAnjAgT1jgeC_e-7hyfWxPcQCHkdgM3FQA',
  authDomain: 'free-hand-app.firebaseapp.com',
  projectId: 'free-hand-app',
  storageBucket: 'free-hand-app.firebasestorage.app',
  messagingSenderId: '329950666461',
  appId: '1:329950666461:web:442f7ba2dc6deca52f4534',
  measurementId: 'G-VFZZ0WDKTF',
};
// const firebaseConfig1 = {
//   apiKey: 'your-api-key-here',
//   authDomain: 'free-hand-app.firebaseapp.com',
//   projectId: 'free-hand-app',
//   storageBucket: 'free-hand-app.appspot.com',
//   messagingSenderId: '123456789',
//   appId: '1:123456789:web:abcdef123456789',
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
let auth: Auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // For React Native, we'll use the default auth without custom persistence
  // as getReactNativePersistence is not available in all Firebase versions
  try {
    auth = getAuth(app);
  } catch (error) {
    // Fallback to initializeAuth if getAuth fails
    auth = initializeAuth(app);
  }
}

// Initialize Firestore
const db = getFirestore(app);

export {auth, db};
export default app;
