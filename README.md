# Elevate Pay - Mobile App

**Elevate Pay** is a financial platform mobile application built with React Native and Expo, featuring a referral system, wallet management, and earnings tracking.

🚀 **Automatic APK Releases**: Push to main branch automatically builds and releases Android APKs via GitHub Actions. See [APK_RELEASE_GUIDE.md](APK_RELEASE_GUIDE.md) for setup.

## 📱 Mobile App Features

- **Dashboard**: Overview of earnings, chain progress, and recent activities
- **Referrals**: Manage your referral network and track commissions
- **Wallet**: View balance, transaction history, and withdrawal options
- **Notifications**: Real-time updates and notification preferences
- **Profile**: Account management and settings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Expo CLI (optional, for enhanced development experience)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd elevate-pay

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run start
```

### Available Scripts

```sh
# Start Expo development server
npm run start

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator (macOS only)
npm run ios

# Run in web browser
npm run mobile

# Build for web (legacy Vite build)
npm run build

# Lint code
npm run lint
```

## 🏗️ Project Structure

```
elevate-pay/
├── src/                    # React Native source code
│   ├── screens/           # Main app screens
│   │   ├── Dashboard.tsx  # Dashboard screen
│   │   ├── Referrals.tsx  # Referrals management
│   │   ├── Wallet.tsx     # Wallet and transactions
│   │   ├── Notifications.tsx # Notifications center
│   │   └── Profile.tsx    # User profile
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx # User authentication
│   └── lib/              # Utility functions
├── src-web/              # Original web app (backup)
├── assets/               # App icons and images
├── App.tsx              # Main app component
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## 🛠️ Technologies Used

### Mobile App (Current)
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build tools
- **React Navigation** - Navigation library
- **TypeScript** - Type-safe JavaScript
- **Ionicons** - Icon library
- **@tanstack/react-query** - Data fetching and caching

### Web App (Legacy - in src-web/)
- **Vite** - Build tool
- **React** - Web framework
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework

## 📱 Running on Devices

### Web Browser
```sh
npm run mobile
# Opens in browser at http://localhost:8081
```

### Android
```sh
npm run android
# Requires Android Studio and emulator or physical device
```

### iOS
```sh
npm run ios
# Requires Xcode (macOS only) and simulator or physical device
```

### Expo Go App
1. Install Expo Go on your mobile device
2. Run `npm run start`
3. Scan the QR code with Expo Go

## 🔧 Development

### Code Structure
- **Screens**: Individual app screens with React Native components
- **Navigation**: Bottom tab navigation with 5 main sections
- **Styling**: React Native StyleSheet with mobile-optimized layouts
- **State Management**: React Context for authentication and user data
- **Platform Support**: iOS, Android, and Web

### Key Features Implemented
- ✅ Cross-platform mobile navigation
- ✅ User authentication flow
- ✅ Dashboard with earnings and progress tracking
- ✅ Referral system management
- ✅ Wallet and transaction history
- ✅ Notification center
- ✅ User profile and settings
- ✅ Responsive mobile design
- ✅ Pull-to-refresh functionality

## 🚢 Deployment

### Expo Build Service
```sh
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Publish to Expo
expo publish
```

### Web Deployment
```sh
npm run build
# Deploy the dist/ folder to your web hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support, email support@elevatepay.com or create an issue in this repository.
