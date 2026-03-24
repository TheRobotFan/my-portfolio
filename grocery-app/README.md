# Grocery Shopping App

A React Native mobile application built with Expo SDK 54 and EAS for managing grocery shopping lists.

## 🚀 Features

### Current Implementation
- **Dashboard**: Overview of shopping stats, recent lists, and insights
- **Cart**: Shopping cart management (placeholder)
- **Settings**: App configuration and preferences

### Tech Stack
- **React Native**: 0.81.5
- **Expo SDK**: 54.0.33
- **React Navigation**: Bottom tabs navigation
- **TypeScript**: Full type safety
- **EAS**: Build and deployment configuration

## 📱 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo Go app (for testing on physical devices)

### Installation

1. Navigate to the project directory:
```bash
cd grocery-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platforms:
```bash
npm run android  # Android
npm run ios      # iOS (macOS only)
npm run web      # Web browser
```

## 🏗️ Project Structure

```
grocery-app/
├── src/
│   └── screens/
│       ├── DashboardScreen.tsx
│       ├── CartScreen.tsx
│       └── SettingsScreen.tsx
├── assets/
├── App.tsx
├── app.json
├── eas.json
├── package.json
└── tsconfig.json
```

## 🔧 EAS Configuration

The project includes EAS (Expo Application Services) configuration for building and deploying:

### Setup EAS
1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

### Build Profiles
- **Development**: Internal distribution with development client
- **Preview**: APK builds for testing
- **Production**: Production builds with auto-increment

### Building
```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

## 📋 Roadmap

### Planned Features
- [ ] Add/remove items to cart
- [ ] Product categories and filtering
- [ ] Shopping list creation and management
- [ ] Price tracking and budget management
- [ ] Store location integration
- [ ] Barcode scanning
- [ ] Recipe integration
- [ ] Shopping history and analytics

## 🎨 Design

The app features a clean, modern design with:
- Material Design icons
- Card-based layouts
- Green accent color (#4CAF50)
- Responsive layouts for different screen sizes

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a placeholder application. Actual functionality will be implemented in future iterations.
