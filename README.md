# Free Hand - Habit Tracker

A simple, effective habit tracking app that helps you build positive routines and break bad habits.

## 🚀 Features

- **Daily Check-ins** - Answer randomly generated questions about your habits
- **Streak Tracking** - Monitor your progress with visual streak counters
- **Statistics & Calendar** - View your progress over time with detailed analytics
- **Profile Management** - Customize your goals and track achievements
- **Multi-Platform** - Available on iOS, Android, and Web

## 📱 Platforms

### Mobile (React Native + Expo)
- iOS devices
- Android devices

### Web (Progressive Web App)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- PWA installation support
- Offline functionality

## 🛠 Development

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd free-hand

# Install dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g @expo/cli
```

### Running the App

#### Mobile Development
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

#### Web Development
```bash
# Start web development server
npm run web

# Start with dev client
npm run web:dev

# Build for production
npm run web:build

# Serve production build locally
npm run web:serve
```

## 🌐 Web Deployment

### Building for Production
```bash
# Build optimized web bundle
npm run web:build
```

This creates a `dist` folder with all the web assets ready for deployment.

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel, GitHub Pages)
Simply upload the contents of the `dist` folder to your hosting provider.

#### 2. Manual Server Deployment
```bash
# After building, copy dist folder to your server
scp -r dist/* user@yourserver:/var/www/html/
```

#### 3. Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables
Create a `.env` file for environment-specific configurations:
```
API_BASE=https://your-api-url.com
API_KEY=your-api-key
```

## 🎨 Features

### Progressive Web App (PWA)
- **Installable** - Users can install the app from their browser
- **Offline Support** - Core functionality works without internet
- **App-like Experience** - Runs in full-screen mode when installed
- **Push Notifications** - (Coming soon)

### Responsive Design
- **Mobile-First** - Optimized for mobile devices
- **Desktop Adaptation** - Scales beautifully on larger screens
- **Touch-Friendly** - Large buttons and intuitive gestures

### Performance
- **Fast Loading** - Optimized bundle size and lazy loading
- **Smooth Animations** - 60fps animations and transitions
- **Efficient Caching** - Smart caching strategy for quick access

## 🔧 Technical Stack

- **Framework**: React Native + Expo
- **Web**: Expo Web + React Native Web
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **Storage**: AsyncStorage (SQLite on mobile, LocalStorage on web)
- **UI Components**: UI Kitten + Custom Components
- **Styling**: StyleSheet + Custom Design System
- **Build Tool**: Metro (mobile) / Webpack (web)

## 📊 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari | ✅ Latest 2 versions |
| Edge | ✅ Latest 2 versions |
| Mobile Safari | ✅ iOS 12+ |
| Chrome Mobile | ✅ Android 7+ |

## 🚀 Performance Tips

### Web Optimization
- Uses code splitting for smaller initial bundle
- Implements lazy loading for non-critical components
- Optimized images and assets
- Service worker for offline caching
- Gzip compression support

### Mobile Optimization
- Native performance with Expo
- Optimized for 60fps animations
- Efficient memory usage
- Background sync capabilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please reach out via:
- GitHub Issues
- Email: support@freehand.app

---

Built with 💜 for your journey to better habits.
