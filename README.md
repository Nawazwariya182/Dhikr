# Dhikr (ذكر) Mobile App 🌙

Dhikr is a premium, distraction-free spiritual companion application built with **React Native** and **Expo**. It provides a beautiful interface for reading the Quran, tracking prayers (Salah), managing daily remembrance (Dhikr), and pinning customized dark-theme widgets to your home screen.

---

## 🌟 Key Features

### 1. 📖 Distraction-Free Quran
*   **Multiple Scripts**: Toggle between high-fidelity **Uthmani** and **IndoPak** scripts.
*   **Translations**: Dual translations (English & Urdu by Ahmed Raza Khan).
*   **Surah Historical Context**: Detailed backgrounds, revelation details (Makki/Madani), and themes for all 114 Surahs.
*   **Reading Progress & Bookmarks**: Dynamic bookmarking with folder organizations.

### 2. 📿 Interactive Dhikr Section
*   **Azkar Counter**: Custom counters with targets (33, 99, 100, or unlimited) and haptic feedback.
*   **Dedicated Widgets**: Perform tasbih directly from your Android home screen.

### 3. 🕌 Advanced Prayer Log System
*   Track obligatory daily Salah and voluntary prayers.
*   Log history, maintain streaks, and log stats using the interactive home screen widget.

### 4. 📂 Organized Bookmark Folders
*   Group bookmarks by categories (e.g. Daily Recitation, Study, Duas).
*   Customize folder colors and designate a folder as the "Primary Folder" to feed data directly into the Juz Progress and Resume Reading widgets.

### 5. ☁️ Private Google Drive Sync
*   Secure, manually triggered backups.
*   Uses a hidden application sandbox directory inside Google Drive to keep your backups private.

### 6. 📱 Premium Widget Suite (15 Widgets)
*   **Quran & Remembrance**: Last Read, Juz Progress, Ayah of the Day, Digital Detox.
*   **Daily Inspiration**: Hadith of the Day, Names of Allah, Prophets Stories, Sunnah of the Day, Islamic History Facts, Character Focus.
*   **Utilities**: Quick Actions, Tasbih Counter, Prayer Tracker, Backup Status.

---

## 🛠️ Technology Stack
*   **Framework**: Expo (React Native) SDK ~54
*   **Language**: TypeScript
*   **Natives**: `react-native-android-widget` for home screen widgets
*   **Storage**: `@react-native-async-storage/async-storage` & `expo-secure-store`
*   **Auth**: `@react-native-google-signin/google-signin`

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS version)
*   Java Development Kit (JDK 17)
*   Android SDK / Android Studio (for native widget support)

### Installation
1.  Clone/open the project directory.
2.  Navigate to the app folder:
    ```bash
    cd dikhr-app
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally
*   **Start Expo Go Development Server**:
    ```bash
    npm run start
    ```
*   **Run on Android (Native/Emulator with Widget Support)**:
    *Note: Widgets require a native dev client build.*
    ```bash
    npm run android
    ```

---

## 📁 Project Structure
```
dikhr-app/
├── assets/             # Static assets, local JSON data (Quran, Hadith), fonts
├── src/
│   ├── components/     # UI Components (headers, drawers, modals)
│   ├── context/        # Theme & App Preferences Providers
│   ├── models/         # TypeScript Type definitions
│   ├── navigation/     # React Navigation stacks & structures
│   ├── screens/        # Screen Views (Quran, Dhikr, Home, Prayer logs)
│   ├── services/       # Services (Auth, backup, tracking, prayer log)
│   ├── utils/          # Helpers & custom hooks (time tracker, constants)
│   └── widgets/        # React Native Android Widget views & handlers
├── app.json            # Expo configuration (including registered native widgets & fonts)
└── package.json        # Project dependencies & scripts
```

---

## 🔒 Privacy & Security
All user data remains entirely on-device. Credentials and OAuth access tokens are stored securely in the device's hardware keychain via `expo-secure-store`. Backups uploaded to Google Drive are sandboxed and completely private to the Dhikr application.
