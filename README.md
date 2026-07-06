# Dhikr (ذكر) Mobile App 🌙

Dhikr is a premium, distraction-free spiritual companion application built with **React Native** and **Expo**. It provides a beautiful interface for reading the Quran, tracking prayers (Salah), managing daily remembrance (Dhikr), and pinning customized dark-theme widgets to your home screen.

---

## 🌟 Key Features

### 1. 📖 Distraction-Free Quran
*   **Multiple Scripts**: Toggle between high-fidelity **Uthmani** and **IndoPak** scripts.
*   **Translations**: Dual translations (English & Urdu by Ahmed Raza Khan).
*   **Surah Historical Context**: Detailed backgrounds, revelation details (Makki/Madani), and themes for all 114 Surahs.
*   **Reading Progress & Bookmarks**: Dynamic bookmarking with folder organizations.

### 2. 📿 Interactive Dhikr & Tasbih Sync
*   **Azkar Counter**: Custom counters with targets (33, 99, 100, or unlimited) and haptic feedback.
*   **Real-time Widget Sync**: Seamless synchronization between the app and the home screen Tasbih Counter widget. Selecting or counting a Dhikr in either updates the other instantly.

### 3. 🕌 Prayer & Sajdah Tracker
*   **Daily Prayer Log**: Track obligatory daily Salah and voluntary prayers, maintaining streaks and logging stats via the home screen widget.
*   **Sajdah al-Tilawah Tracker**: A dedicated screen to log and track all 15 prostrations of recitation in the Quran, complete with verse references, progress indicators, and an educational performance guide.

### 4. 🧠 Groq AI Quranic Quiz Generator
*   **Custom Verse Range Quizzes**: Generate customized quizzes based on user-selected Surah and Ayah ranges.
*   **10-Question Difficulty Distribution**: Tests users with a structured set of 3 Easy (high-level moral lessons), 3 Medium (theology/history), and 4 Hard (Asbab al-Nuzul and complex Sunni Aqeedah concepts) questions.
*   **Creed-Aligned Tafsir Lessons**: System prompt is strictly aligned with the creed of the Ahl-e-Sunnat wal Jama'at, featuring detailed explanations that act as educational mini-lessons.
*   **Resilient Fallback Chain & Rate Limit**: Implements a sequential retry loop over 5 Groq models, with a 1-time-a-day rate limit (bypassed in development mode).

### 5. 📂 Organized Bookmark Folders
*   Group bookmarks by categories (e.g. Daily Recitation, Study, Duas).
*   Designate a folder as the "Primary Folder" to feed data directly into the Juz Progress and Resume Reading widgets, locking widget tracking to your active folder.

### 6. ☁️ Private Google Drive Sync
*   Secure, manually triggered backups.
*   Uses a hidden application sandbox directory inside Google Drive to keep your backups private.

### 7. 📱 Premium Widget Suite (15 Widgets)
*   **Quran & Remembrance**: Last Read, Juz Progress, Ayah of the Day, Digital Detox.
*   **Daily Inspiration**: Hadith of the Day, Names of Allah, Prophets Stories, Sunnah of the Day (40 detailed guides on how the Prophet ﷺ practiced them), Islamic History Facts, Character Focus.
*   **Utilities**: Quick Actions (with direct deep links to Search/Quran), Tasbih Counter, Prayer Tracker, Backup Status.

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
