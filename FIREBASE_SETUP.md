# Firebase Setup Guide

To enable authentication and cloud sync in your Free Hand app, you need to set up a Firebase project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `free-hand-app` (or your preferred name)
4. Enable/disable Google Analytics as desired
5. Click "Create project"

## 2. Add Web App to Firebase

1. In your Firebase project dashboard, click the web icon (`</>`)
2. Enter app nickname: `free-hand-web`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## 3. Update Firebase Config

Replace the config in `src/config/firebase.ts` with your actual values:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 4. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password** ✅
   - **Anonymous** ✅ (for guest users)
3. Save changes

## 5. Set up Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select your preferred location
4. Click "Done"

## 6. Configure Firestore Rules (Optional but Recommended)

Update your Firestore rules for better security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user's habit records
      match /habits/{habitId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 7. Test the Setup

1. Start your app: `npm run web` or `npm start`
2. Try creating an account
3. Try anonymous sign-in
4. Check Firebase Console to see users and data

## Troubleshooting

- **"Firebase config not found"**: Make sure you replaced the placeholder config
- **"Auth domain not authorized"**: Add your domain to Firebase Auth settings
- **"Permission denied"**: Check Firestore rules
- **"Network error"**: Verify your internet connection and Firebase project is active

## Optional: Add Mobile Apps

To support iOS/Android:

1. Add iOS app in Firebase Console
2. Add Android app in Firebase Console  
3. Download config files and add to your project
4. Follow platform-specific setup guides

Your Firebase setup is now complete! 🎉
