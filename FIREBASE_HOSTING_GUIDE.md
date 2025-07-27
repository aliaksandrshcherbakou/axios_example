# Firebase Hosting Deployment Guide

Deploy your Free Hand habit tracker to Firebase Hosting for free web hosting with global CDN.

## Prerequisites

- Firebase project already set up ✅
- Firebase CLI installed
- Web app built and tested locally ✅

## 1. Install Firebase CLI

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

## 2. Initialize Firebase Hosting

In your project root directory:

```bash
# Initialize Firebase in your project
firebase init hosting
```

When prompted, select:

- **Use an existing project** → Choose your `free-hand-app` project
- **Public directory** → Enter `dist`
- **Single-page app** → `y` (Yes)
- **Automatic builds** → `N` (No, we'll build manually)
- **Overwrite index.html** → `N` (No)

## 3. Configure Firebase Hosting

The init command creates `firebase.json`. Update it:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=7200"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  }
}
```

## 4. Build for Production

```bash
# Build the web version for production
npm run web:build

# This creates a 'dist' folder with optimized web assets
```

## 5. Deploy to Firebase Hosting

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or for first-time deployment
firebase deploy
```

## 6. Update package.json Scripts

Add hosting commands to your `package.json`:

```json
{
  "scripts": {
    "web:build": "expo export --platform web",
    "web:serve": "npx serve dist -s",
    "deploy:build": "npm run web:build",
    "deploy": "npm run deploy:build && firebase deploy --only hosting",
    "deploy:preview": "npm run deploy:build && firebase hosting:channel:deploy preview"
  }
}
```

## 7. Access Your Live App

After deployment, Firebase will provide URLs:

- **Hosting URL**: `https://free-hand-app.web.app`
- **Custom Domain**: `https://free-hand-app.firebaseapp.com`

## 8. Add Custom Domain (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Hosting**
3. Click **Add custom domain**
4. Follow the verification steps
5. Update DNS records as instructed

## 9. Environment Configuration

For production, update `src/config/firebase.ts` if needed:

```typescript
const firebaseConfig = {
  // Your production config
  apiKey: "your-api-key",
  authDomain: "free-hand-app.firebaseapp.com", // This should match your hosting domain
  projectId: "free-hand-app",
  // ... other config
};
```

## 10. Automatic Deployment (CI/CD)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build web app
        run: npm run web:build
        
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: free-hand-app
```

## 11. Security Configuration

### Update Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /habits/{habitId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Update Auth Settings

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your custom domain: `yourdomain.com`
3. Add Firebase domains (should be there by default):
   - `free-hand-app.web.app`
   - `free-hand-app.firebaseapp.com`

## 12. Performance Optimization

### Add Service Worker for PWA

Your app already has PWA support! The service worker in `web/sw.js` will:

- Cache app resources
- Enable offline functionality
- Improve loading performance

### Enable Compression

Firebase Hosting automatically provides:

- **Gzip compression** for text assets
- **Global CDN** for fast loading worldwide
- **SSL certificate** (HTTPS by default)

## 13. Monitoring & Analytics

### Add Firebase Analytics (Optional)

```typescript
// In src/config/firebase.ts
import { getAnalytics } from "firebase/analytics";

const analytics = getAnalytics(app);
export { auth, db, analytics };
```

### Monitor Performance

- **Firebase Console** → **Hosting** for deployment history
- **Performance tab** for loading metrics
- **Google Analytics** for user behavior

## 14. Troubleshooting

### Common Issues

**Build Fails:**

```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run web:build
```

**Routing Issues:**

- Ensure `rewrites` in `firebase.json` redirects all routes to `/index.html`

**Authentication Domain Errors:**

- Add your hosting domain to Firebase Auth authorized domains

**Assets Not Loading:**

- Check paths in `web/index.html`
- Verify assets are in the `dist` folder after build

## 15. Quick Deployment Commands

```bash
# One-command deployment
npm run deploy

# Preview deployment (doesn't affect live site)
npm run deploy:preview

# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:channel:deploy previous-version
```

## 🎉 Your Free Hand App is Now Live

After following this guide, your habit tracker will be:

- ✅ **Globally accessible** via Firebase Hosting
- ✅ **Fast loading** with CDN
- ✅ **Secure** with HTTPS
- ✅ **PWA-enabled** for app-like experience
- ✅ **Scalable** to millions of users

**Next Steps:**

1. Share your app URL with users
2. Set up analytics to track usage
3. Consider adding push notifications
4. Monitor performance and user feedback

Your Free Hand habit tracker is now production-ready! 🚀
