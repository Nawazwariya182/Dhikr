# Dhikr — Developer Log (v3.2.1)
## Version 3.2.1 "Circles of Knowledge"
**Date:** 2026-07-08  
**Platform:** Android (EAS APK Build)  
**Package:** `com.wariyanawaz786.dhikhrapp`

---

## 🚀 New Features & Capabilities

### 1. 🕋 Khatm Circles (Group Quran Rooms)
*   **Real-Time Collaboration**: Introduced shared spaces for group Quran completion (Khatm) where multiple users can coordinate reading efforts in real-time.
*   **Juz Assignments & Tracking**: Room creators and participants can claim specific Juz portions, with progress synchronized automatically across all members.
*   **Secure Coding & Invitation**: Unique room codes allow instant invitations, paired with localized encryption utilities (`codec.ts`) for data privacy.
*   **QR Code Sharing**: Integrated quick QR code generation and scanner interface (`QRScannerModal.tsx`) for fast onboarding into groups.

### 2. 📜 Islamic History Widget
*   **Rich Sunni History**: Added a new home widget that cycles through 100 curated facts from Islamic history, highlighting major events, scholars, and achievements from the early Hijra to modern times.
*   **Authentic References**: Each history entry includes a verified reference (such as *Siyar A'lam al-Nubala*, *Tarikh Ibn Khaldun*, and *Wafayat al-A'yan*).
*   **Widget Profile**: Configured as `IslamicHistory` in `app.json` (3x1 layout with a clean, low-profile 40dp min-height for clean homescreen integration).

### 3. 🌟 Prophets Stories Widget
*   **Narrative Snippets**: Adds a widget detailing key narrative moments in the lives of the Prophets (A.S.) to inspire daily reflection.
*   **Actionable Lessons**: Each story details a core moral or spiritual lesson (e.g. patience, repentance, steadfastness).
*   **Widget Profile**: Configured as `ProphetsStories` (3x2 layout, 110dp min-height).

### 4. 🤲 AI-Powered Dua Generator
*   **Personalized Supplications**: Connects to the Groq API to generate contextual, tailored Duas matching the user's specific spiritual state, mood, or circumstance.
*   **Multi-language Support**: Outputs the generated Dua in Arabic, Urdu translation, and English translation.
*   **Strict System Prompts**: System instructions align strictly with the creed of the Ahl-e-Sunnat wal Jama'at.

### 5. 🎛️ Home Widget Suite Expansion
*   The widget registry now hosts **15 active home widgets**, expanding the homescreen experience to cover virtually all aspects of a user's daily spiritual routine.

---

## 📊 Codebase & Feature Stats

### Expanded Widget Registry (`app.json`)
*   `AyahOfDay`, `TasbihCounter`, `QuickActions`, `DuaOfDay`, `WisdomQuote`, `LastRead`, `JuzProgress`, `PrayerTracker`, `NamesOfAllah`, `SunnahDaily`, `HadithOfDay`, `IslamicHistory`, `ProphetsStories`, `CharacterFocus`, `DigitalDetox`

### Widget Data Registries (`widget-data.ts`)
*   `ALLAH_NAMES`: 99 entries (Complete names, meanings, and benefits)
*   `HISTORY_FACTS`: 100 entries (Sunni Islamic history timeline)
*   `PROPHETS_STORIES`: 25+ entries (Prophetic narratives and lessons)
*   `SUNNAH_ENTRIES` & `HADITH_ENTRIES`: Full daily rotational content

---

# Dhikr v3.2.1 — Official Release Notes

### "Circles of Knowledge" 🌙

We are blessed to announce the release of **Dhikr v3.2.1**, introducing cooperative spiritual goals, brand-new widgets, and AI-assisted personalized supplications.

---

### ✨ Highlights

#### 🕋 Khatm Circles — Quran Together
Complete the Holy Quran together with family, friends, or study groups. Create a room, share the invitation QR code, claim Juz sections, and watch your collective progress update live.

#### 📜 Islamic History Widget
Keep the rich legacy of Islamic civilization visible on your home screen. A new rotating widget featuring 100 verified historical records spanning the Hijra, major scholarly works, and scientific achievements—all complete with classical citations.

#### 🌟 Prophets Stories Widget
Reflect on the noble lives of the Prophets (peace be upon them all). Displays daily narrative snippets and highlights the core moral lessons to carry into your day.

#### 🤲 AI Dua Generator
Generate personalized supplications based on your current feelings or situation. Provides authentic Arabic texts alongside dual Urdu and English translations, strictly aligned with classical Sunni tradition.

---

### 📱 Release Details

*   **Version**: `3.2.1`
*   **Build target**: Android (`.apk`)
*   **Theme**: Optimized Dark Mode
*   **Widgets**: 15 Home Screen Widgets available

*Built with dedication for the Ummah. All content is carefully structured in accordance with the Ahl-e-Sunnat wal Jama'at.*

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
