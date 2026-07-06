// Structured database for all Dhikr app widgets
// Strictly adhering to Ahl-e-Sunnat wal Jama'at (Maslak-e-Ala Hazrat) creed and classical Sunni references.

export interface AllahName {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  benefit: string;
}

export interface HadithEntry {
  id: number;
  text: string;
  reference: string;
  grading: string;
}

export interface SunnahEntry {
  id: number;
  title: string;
  detail: string;
  reference: string;
}

export interface HistoryFact {
  id: number;
  topic: string;
  fact: string;
  reference: string;
}

export interface ProphetStory {
  id: number;
  prophet: string;
  snippet: string;
  lesson: string;
}

export interface AkhlaqTheme {
  week: number;
  topic: string;
  action: string;
}

export const ALLAH_NAMES: AllahName[] = [
  {
    "id": 1,
    "name": "Ar-Rahman",
    "arabic": "الرَّحْمَنُ",
    "meaning": "The Most Gracious",
    "benefit": "Reciting 100 times after Salat brings focus and clarity."
  },
  {
    "id": 2,
    "name": "Ar-Rahim",
    "arabic": "الرَّحِيمُ",
    "meaning": "The Most Merciful",
    "benefit": "Reciting after Fajr prayer keeps one safe from calamities."
  },
  {
    "id": 3,
    "name": "Al-Malik",
    "arabic": "الْمَلِكُ",
    "meaning": "The Sovereign Lord",
    "benefit": "Reciting regularly grants self-sufficiency and respect."
  },
  {
    "id": 4,
    "name": "Al-Quddus",
    "arabic": "الْقُدُّوسُ",
    "meaning": "The Pure / Holy",
    "benefit": "Reciting daily purifies the heart from doubts and anxieties."
  },
  {
    "id": 5,
    "name": "As-Salam",
    "arabic": "السَّلَامُ",
    "meaning": "The Giver of Peace",
    "benefit": "Reciting 160 times over a sick person aids in their recovery."
  },
  {
    "id": 6,
    "name": "Al-Mu'min",
    "arabic": "الْمُؤْمِنُ",
    "meaning": "The Infuser of Faith",
    "benefit": "Reciting protects against the evil of enemies and fear."
  },
  {
    "id": 7,
    "name": "Al-Muhaymin",
    "arabic": "الْمُهَيْمِنُ",
    "meaning": "The Guardian / Protector",
    "benefit": "Reciting after wudu illuminates the inner soul."
  },
  {
    "id": 8,
    "name": "Al-Aziz",
    "arabic": "الْعَزِيزُ",
    "meaning": "The All-Mighty",
    "benefit": "Reciting 40 times for 40 days grants honor and independence."
  },
  {
    "id": 9,
    "name": "Al-Jabbar",
    "arabic": "الْجَبَّارُ",
    "meaning": "The Compeller / Restorer",
    "benefit": "Reciting protects against tyranny and oppression."
  },
  {
    "id": 10,
    "name": "Al-Mutakabbir",
    "arabic": "الْمُتَكَبِّرُ",
    "meaning": "The Supreme / Majestic",
    "benefit": "Reciting before sleeping blessed one with righteous children."
  },
  {
    "id": 11,
    "name": "Al-Khaliq",
    "arabic": "الْخَالِقُ",
    "meaning": "The Creator",
    "benefit": "Allah appoints an angel to pray for whoever recites this at night."
  },
  {
    "id": 12,
    "name": "Al-Bari",
    "arabic": "الْبَارِئُ",
    "meaning": "The Maker of Order",
    "benefit": "Reciting aids in curing physical ailments and sickness."
  },
  {
    "id": 13,
    "name": "Al-Musawwir",
    "arabic": "الْمُصَوِّرُ",
    "meaning": "The Fashioner of Shapes",
    "benefit": "Fast for 7 days, recite this 21 times over water to break fast for children."
  },
  {
    "id": 14,
    "name": "Al-Ghaffar",
    "arabic": "الْغَفَّارُ",
    "meaning": "The All-Forgiving",
    "benefit": "Reciting daily after Asr Salat forgives sins of that day."
  },
  {
    "id": 15,
    "name": "Al-Qahhar",
    "arabic": "الْقَهَّارُ",
    "meaning": "The Subduer",
    "benefit": "Reciting liberates the soul from worldly attachments."
  },
  {
    "id": 16,
    "name": "Al-Wahhab",
    "arabic": "الْوَهَّابُ",
    "meaning": "The Giver of All",
    "benefit": "Recite 7 times in Sajdah of Duha prayer for financial ease."
  },
  {
    "id": 17,
    "name": "Ar-Razzaq",
    "arabic": "الرَّزَّاقُ",
    "meaning": "The Provider",
    "benefit": "Recite in four corners of house before Fajr for abundance."
  },
  {
    "id": 18,
    "name": "Al-Fattah",
    "arabic": "الْفَتَّاحُ",
    "meaning": "The Opener",
    "benefit": "Recite 70 times with hands on chest after Fajr for inner light."
  },
  {
    "id": 19,
    "name": "Al-Alim",
    "arabic": "الْعَلِيمُ",
    "meaning": "The All-Knowing",
    "benefit": "Reciting regularly opens the gates of wisdom and knowledge."
  },
  {
    "id": 20,
    "name": "Al-Qabid",
    "arabic": "الْقَابِضُ",
    "meaning": "The Restrainer",
    "benefit": "Reciting keeps one safe from hunger, pain, and enemies."
  },
  {
    "id": 21,
    "name": "Al-Basit",
    "arabic": "الْبَاسِطُ",
    "meaning": "The Extender",
    "benefit": "Recite 10 times in Duha with raised hands for self-reliance."
  },
  {
    "id": 22,
    "name": "Al-Khafid",
    "arabic": "الْخَافِضُ",
    "meaning": "The Abaser",
    "benefit": "Fast 3 days and recite 500 times in congregation to defeat tyrants."
  },
  {
    "id": 23,
    "name": "Ar-Rafi",
    "arabic": "الرَّافِعُ",
    "meaning": "The Exalter",
    "benefit": "Recite 100 times day and night to elevate status and wealth."
  },
  {
    "id": 24,
    "name": "Al-Mu'izz",
    "arabic": "الْمُعِزُّ",
    "meaning": "The Giver of Honor",
    "benefit": "Recite 140 times after Maghrib on Friday night for fearlessness."
  },
  {
    "id": 25,
    "name": "Al-Mudhill",
    "arabic": "الْمُذِلُّ",
    "meaning": "The Giver of Dishonor",
    "benefit": "Recite 75 times in Sajdah to remain safe from oppressors."
  },
  {
    "id": 26,
    "name": "As-Sami",
    "arabic": "السَّمِيعُ",
    "meaning": "The All-Hearing",
    "benefit": "Recite 100 times on Thursday after Duha to have prayers answered."
  },
  {
    "id": 27,
    "name": "Al-Basir",
    "arabic": "الْبَصِيرُ",
    "meaning": "The All-Seeing",
    "benefit": "Recite 100 times after Jumu'ah prayer to illuminate eyesight."
  },
  {
    "id": 28,
    "name": "Al-Hakam",
    "arabic": "الْحَكَمُ",
    "meaning": "The Judge",
    "benefit": "Reciting at night reveals the secrets of the unseen worlds."
  },
  {
    "id": 29,
    "name": "Al-Adl",
    "arabic": "الْعَدْلُ",
    "meaning": "The Utterly Just",
    "benefit": "Write on bread on Friday night to make family obedient."
  },
  {
    "id": 30,
    "name": "Al-Latif",
    "arabic": "اللَّطِيفُ",
    "meaning": "The Subtle / Gentle",
    "benefit": "Recite 133 times for ease in business and daily affairs."
  },
  {
    "id": 31,
    "name": "Al-Khabir",
    "arabic": "الْخَبِيرُ",
    "meaning": "The All-Aware",
    "benefit": "Recite daily to overcome bad habits and find truth."
  },
  {
    "id": 32,
    "name": "Al-Halim",
    "arabic": "الْحَلِيمُ",
    "meaning": "The Forbearing",
    "benefit": "Write on paper, wash with water and sprinkle over crops to protect them."
  },
  {
    "id": 33,
    "name": "Al-Azim",
    "arabic": "الْعَظِيمُ",
    "meaning": "The Magnificent",
    "benefit": "Recite regularly to gain respect, dignity, and authority."
  },
  {
    "id": 34,
    "name": "Al-Ghafur",
    "arabic": "الْغَفُورُ",
    "meaning": "The All-Forgiving",
    "benefit": "Reciting cures headaches and relieves inner grief."
  },
  {
    "id": 35,
    "name": "Ash-Shakur",
    "arabic": "الشَّكُورُ",
    "meaning": "The Most Appreciative",
    "benefit": "Recite 41 times over water and wash eyes to cure dim sight."
  },
  {
    "id": 36,
    "name": "Al-Ali",
    "arabic": "الْعَلِيُّ",
    "meaning": "The Highest",
    "benefit": "Recite daily and keep written on person for success and travel safety."
  },
  {
    "id": 37,
    "name": "Al-Kabir",
    "arabic": "الْكَبِيرُ",
    "meaning": "The Greatest",
    "benefit": "Recite 100 times daily to achieve high social status."
  },
  {
    "id": 38,
    "name": "Al-Hafiz",
    "arabic": "الْحَفِيظُ",
    "meaning": "The Preserver",
    "benefit": "Recite 16 times daily to protect from all dangers and evil."
  },
  {
    "id": 39,
    "name": "Al-Muqit",
    "arabic": "الْمُقِيتُ",
    "meaning": "The Sustainer",
    "benefit": "Recite over water and give to a bad-tempered child to calm them."
  },
  {
    "id": 40,
    "name": "Al-Hasib",
    "arabic": "الْحَسِيبُ",
    "meaning": "The Reckoner",
    "benefit": "Recite 77 times before sunrise and sunset to guard against theft."
  },
  {
    "id": 41,
    "name": "Al-Jalil",
    "arabic": "الْجَلِيلُ",
    "meaning": "The Mighty / Majestic",
    "benefit": "Write with saffron on paper and keep for respect among people."
  },
  {
    "id": 42,
    "name": "Al-Karim",
    "arabic": "الْكَرِيمُ",
    "meaning": "The Most Generous",
    "benefit": "Recite before sleeping to gain honor and blessings of scholars."
  },
  {
    "id": 43,
    "name": "Ar-Raqib",
    "arabic": "الرَّقِيبُ",
    "meaning": "The Watchful",
    "benefit": "Recite 7 times over family and wealth to secure them daily."
  },
  {
    "id": 44,
    "name": "Al-Mujib",
    "arabic": "الْمُجِيبُ",
    "meaning": "The Responsive",
    "benefit": "Reciting regularly ensures all supplications are accepted."
  },
  {
    "id": 45,
    "name": "Al-Wasi",
    "arabic": "الْوَاسِعُ",
    "meaning": "The All-Encompassing",
    "benefit": "Recite daily for spiritual growth and financial expansion."
  },
  {
    "id": 46,
    "name": "Al-Hakim",
    "arabic": "الْحَكِيمُ",
    "meaning": "The Wise",
    "benefit": "Reciting regularly removes difficulties in work and studies."
  },
  {
    "id": 47,
    "name": "Al-Wadud",
    "arabic": "الْوَدُودُ",
    "meaning": "The Loving One",
    "benefit": "Recite 1000 times over food and eat with spouse to resolve fights."
  },
  {
    "id": 48,
    "name": "Al-Majid",
    "arabic": "الْمَجِيدُ",
    "meaning": "The Glorious",
    "benefit": "Reciting in isolation brings spiritual enlightenment."
  },
  {
    "id": 49,
    "name": "Al-Ba'ith",
    "arabic": "الْبَاعِثُ",
    "meaning": "The Resurrector",
    "benefit": "Recite 100 times with hand on chest before sleep for fear of Allah."
  },
  {
    "id": 50,
    "name": "Ash-Shahid",
    "arabic": "الشَّهِيدُ",
    "meaning": "The Witness",
    "benefit": "Recite 21 times over a rebellious child's forehead to guide them."
  },
  {
    "id": 51,
    "name": "Al-Haqq",
    "arabic": "الْحَقُّ",
    "meaning": "The Truth",
    "benefit": "Write on square paper, raise to sky at Sahar for recovery of lost items."
  },
  {
    "id": 52,
    "name": "Al-Wakil",
    "arabic": "الْوَكِيلُ",
    "meaning": "The Trustee",
    "benefit": "Recite daily during calamities to seek divine intervention."
  },
  {
    "id": 53,
    "name": "Al-Qawi",
    "arabic": "الْقَوِيُّ",
    "meaning": "The Most Strong",
    "benefit": "Recite to overcome weakness, fatigue, and defeat oppressors."
  },
  {
    "id": 54,
    "name": "Al-Matin",
    "arabic": "الْمَتِينُ",
    "meaning": "The Firm One",
    "benefit": "Recite to calm rebellious nature and cure bodily ailments."
  },
  {
    "id": 55,
    "name": "Al-Wali",
    "arabic": "الْوَلِيُّ",
    "meaning": "The Protecting Associate",
    "benefit": "Reciting makes one a close friend of Allah (Wali)."
  },
  {
    "id": 56,
    "name": "Al-Hamid",
    "arabic": "الْحَمِيدُ",
    "meaning": "The Praiseworthy",
    "benefit": "Recite 100 times daily to earn love and praise of creation."
  },
  {
    "id": 57,
    "name": "Al-Muhsi",
    "arabic": "الْمُحْصِي",
    "meaning": "The Appraiser",
    "benefit": "Recite 20 times daily over bread to gain mental sharpness."
  },
  {
    "id": 58,
    "name": "Al-Mubdi",
    "arabic": "الْمُبْدِئُ",
    "meaning": "The Originator",
    "benefit": "Recite over a pregnant woman's stomach to prevent miscarriage."
  },
  {
    "id": 59,
    "name": "Al-Mu'id",
    "arabic": "الْمُعِيدُ",
    "meaning": "The Restorer",
    "benefit": "Recite 70 times for the safe return of a missing family member."
  },
  {
    "id": 60,
    "name": "Al-Muhyi",
    "arabic": "الْمُحْيِي",
    "meaning": "The Giver of Life",
    "benefit": "Recite daily to cure chronic heart and lung sickness."
  },
  {
    "id": 61,
    "name": "Al-Mumit",
    "arabic": "الْمُمِيتُ",
    "meaning": "The Creator of Death",
    "benefit": "Recite to control and defeat corrupt desires of the Nafs."
  },
  {
    "id": 62,
    "name": "Al-Hayy",
    "arabic": "الْحَيُّ",
    "meaning": "The Ever-Living",
    "benefit": "Recite 3000 times daily for long healthy life and curing sickness."
  },
  {
    "id": 63,
    "name": "Al-Qayyum",
    "arabic": "الْقَيُّومُ",
    "meaning": "The Self-Sustaining",
    "benefit": "Recite between Sunnah and Fard of Fajr to gain spiritual wealth."
  },
  {
    "id": 64,
    "name": "Al-Wajid",
    "arabic": "الْوَاجِدُ",
    "meaning": "The Finder",
    "benefit": "Recite while eating food to cultivate spiritual strength."
  },
  {
    "id": 65,
    "name": "Al-Majid",
    "arabic": "الْمَاجِدُ",
    "meaning": "The Illustrious",
    "benefit": "Recite in private for light of faith inside the heart."
  },
  {
    "id": 66,
    "name": "Al-Wahid",
    "arabic": "الْوَاحِدُ",
    "meaning": "The Unique One",
    "benefit": "Recite 1000 times in isolation to remove fear of creations."
  },
  {
    "id": 67,
    "name": "Al-Ahad",
    "arabic": "الْأَحَدُ",
    "meaning": "The Only One",
    "benefit": "Recite 1000 times to have spiritual secrets revealed."
  },
  {
    "id": 68,
    "name": "As-Samad",
    "arabic": "الصَّمَدُ",
    "meaning": "The Eternal / Self-Sufficient",
    "benefit": "Recite after wudu to have all needs fulfilled by Allah."
  },
  {
    "id": 69,
    "name": "Al-Qadir",
    "arabic": "الْقَادِرُ",
    "meaning": "The Capable / Powerful",
    "benefit": "Recite when facing difficult obstacles to find success."
  },
  {
    "id": 70,
    "name": "Al-Muqtadir",
    "arabic": "الْمُقتَدِرُ",
    "meaning": "The All-Powerful",
    "benefit": "Reciting on waking up ensures tasks are accomplished smoothly."
  },
  {
    "id": 71,
    "name": "Al-Muqaddim",
    "arabic": "الْمُقَدِّمُ",
    "meaning": "The Expediter",
    "benefit": "Recite in battlefield or exams to gain courage and priority."
  },
  {
    "id": 72,
    "name": "Al-Mu'akhkhir",
    "arabic": "الْمُؤَخِّرُ",
    "meaning": "The Delayer",
    "benefit": "Recite 100 times daily to stay humble and focused on Akhirah."
  },
  {
    "id": 73,
    "name": "Al-Awwal",
    "arabic": "الْأَوَّلُ",
    "meaning": "The First",
    "benefit": "Recite 1000 times for 40 Fridays to have child requests answered."
  },
  {
    "id": 74,
    "name": "Al-Akhir",
    "arabic": "الْآخِرُ",
    "meaning": "The Last",
    "benefit": "Recite 100 times daily to die with Iman (faith) intact."
  },
  {
    "id": 75,
    "name": "Az-Zahir",
    "arabic": "الظَّاهِرُ",
    "meaning": "The Manifest",
    "benefit": "Recite 15 times after Jumu'ah for spiritual illumination."
  },
  {
    "id": 76,
    "name": "Al-Batin",
    "arabic": "الْبَاطِنُ",
    "meaning": "The Hidden",
    "benefit": "Recite 30 times daily to cultivate divine love and peace."
  },
  {
    "id": 77,
    "name": "Al-Wali",
    "arabic": "الْوَالِي",
    "meaning": "The Governor",
    "benefit": "Recite in house to protect it from fire, wind, and lightning."
  },
  {
    "id": 78,
    "name": "Al-Muta'ali",
    "arabic": "الْمُتَعَالِي",
    "meaning": "The Self-Exalted",
    "benefit": "Reciting regularly ensures quick relief from pain."
  },
  {
    "id": 79,
    "name": "Al-Barr",
    "arabic": "الْبَرُّ",
    "meaning": "The Source of All Goodness",
    "benefit": "Recite over newborn children to protect them from bad fate."
  },
  {
    "id": 80,
    "name": "At-Tawwab",
    "arabic": "التَّوَّابُ",
    "meaning": "The Acceptor of Repentance",
    "benefit": "Recite 360 times after Duha Salat to have repentance accepted."
  },
  {
    "id": 81,
    "name": "Al-Muntaqim",
    "arabic": "الْمُنْتَقِمُ",
    "meaning": "The Avenger",
    "benefit": "Reciting regularly protects from enemies and deceit."
  },
  {
    "id": 82,
    "name": "Al-Afu",
    "arabic": "الْعَفُوُّ",
    "meaning": "The Pardoner",
    "benefit": "Recite daily for forgiveness of major transgressions."
  },
  {
    "id": 83,
    "name": "Ar-Ra'uf",
    "arabic": "الرَّؤُوفُ",
    "meaning": "The Kind / Compassionate",
    "benefit": "Recite 10 times to calm anger and resolve disputes."
  },
  {
    "id": 84,
    "name": "Malik-ul-Mulk",
    "arabic": "مَالِكُ الْمُلْكِ",
    "meaning": "Owner of all Sovereignty",
    "benefit": "Recite daily to gain wealth, respect, and independence."
  },
  {
    "id": 85,
    "name": "Dhul-Jalali wal-Ikram",
    "arabic": "ذُو الْجَلَالِ وَالْإِكْرَامِ",
    "meaning": "Lord of Majesty and Generosity",
    "benefit": "Reciting regularly ensures prayers are never rejected."
  },
  {
    "id": 86,
    "name": "Al-Muqsit",
    "arabic": "الْمُقْسِطُ",
    "meaning": "The Equitable / Just",
    "benefit": "Reciting protects from whispers of shaitan during Salat."
  },
  {
    "id": 87,
    "name": "Al-Jami",
    "arabic": "الْجَامِعُ",
    "meaning": "The Gatherer",
    "benefit": "Recite to reunite separated family members or recover lost items."
  },
  {
    "id": 88,
    "name": "Al-Ghani",
    "arabic": "الْغَنِيُّ",
    "meaning": "The All-Rich",
    "benefit": "Reciting regularly brings barkat (blessings) in livelihood."
  },
  {
    "id": 89,
    "name": "Al-Mughni",
    "arabic": "الْمُغْنِيُ",
    "meaning": "The Enricher",
    "benefit": "Recite 1000 times on Friday night for financial stability."
  },
  {
    "id": 90,
    "name": "Al-Mani",
    "arabic": "الْمَانِعُ",
    "meaning": "The Preventer",
    "benefit": "Reciting protects marital relations and secures safety during travel."
  },
  {
    "id": 91,
    "name": "Ad-Darr",
    "arabic": "الضَّارُّ",
    "meaning": "The Creator of Harm",
    "benefit": "Recite on Friday night to elevate spiritual levels."
  },
  {
    "id": 92,
    "name": "An-Nafi",
    "arabic": "النَّافِعُ",
    "meaning": "The Creator of Good",
    "benefit": "Recite 41 times before starting any task for quick success."
  },
  {
    "id": 93,
    "name": "An-Nur",
    "arabic": "النُّورُ",
    "meaning": "The Light",
    "benefit": "Recite on Thursday night to illuminate the heart and mind."
  },
  {
    "id": 94,
    "name": "Al-Hadi",
    "arabic": "الْهَادِي",
    "meaning": "The Guide",
    "benefit": "Recite daily to gain spiritual guidance and strong memory."
  },
  {
    "id": 95,
    "name": "Al-Badi",
    "arabic": "الْبَدِيعُ",
    "meaning": "The Originator / Incomparable",
    "benefit": "Recite 70 times after Isha to find solutions to complex problems."
  },
  {
    "id": 96,
    "name": "Al-Baqi",
    "arabic": "الْبَاقِي",
    "meaning": "The Everlasting",
    "benefit": "Recite 1000 times on Thursday night to keep good deeds accepted."
  },
  {
    "id": 97,
    "name": "Al-Warith",
    "arabic": "الْوَارِثُ",
    "meaning": "The Inheritor",
    "benefit": "Recite 100 times at sunrise to remain protected from sorrow."
  },
  {
    "id": 98,
    "name": "Ar-Rashid",
    "arabic": "الرَّشِيدُ",
    "meaning": "The Guide to Right Path",
    "benefit": "Recite between Maghrib and Isha for ease in difficult matters."
  },
  {
    "id": 99,
    "name": "As-Sabur",
    "arabic": "الصَّبُورُ",
    "meaning": "The Patient One",
    "benefit": "Recite 298 times before sunrise for relief from severe grief."
  }
];

export const HADITHS: HadithEntry[] = [
  {
    "id": 1,
    "text": "None of you truly believes until I am more beloved to him than his father, his child, and all of mankind.",
    "reference": "Sahih al-Bukhari, Hadith 15",
    "grading": "Muttafaqun Alayh (Authentic)"
  },
  {
    "id": 2,
    "text": "Send blessings upon me abundantly, for indeed your blessings upon me are a purification for your sins.",
    "reference": "Al-Mu'jam al-Awsat, Hadith 1827",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 3,
    "text": "The closest of you to me on the Day of Resurrection will be the one who sends the most blessings (Durood) upon me.",
    "reference": "Sunan al-Tirmidhi, Hadith 484",
    "grading": "Hasan (Good)"
  },
  {
    "id": 4,
    "text": "Whoever visits my grave after my passing, it is as if he visited me during my lifetime.",
    "reference": "Sunan al-Daraqutni, Hadith 2667",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 5,
    "text": "Allah has forbidden the earth from consuming the bodies of the Prophets. Thus, the Prophets of Allah are alive in their graves and are given sustenance.",
    "reference": "Sunan Ibn Majah, Hadith 1637",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 6,
    "text": "My Sahaba (companions) are like stars; whichever of them you follow, you will be rightly guided.",
    "reference": "Mishkat al-Masabih, Hadith 6018",
    "grading": "Authentic (Sunni Consensus)"
  },
  {
    "id": 7,
    "text": "Love Allah for the blessings He feeds you, love me for the love of Allah, and love the members of my household (Ahl al-Bayt) for my love.",
    "reference": "Sunan al-Tirmidhi, Hadith 3789",
    "grading": "Hasan (Good)"
  },
  {
    "id": 8,
    "text": "Al-Hassan and al-Hussein are the masters of the youth of Paradise.",
    "reference": "Sunan al-Tirmidhi, Hadith 3768",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 9,
    "text": "Fatima is a part of me, and whoever angers her angers me.",
    "reference": "Sahih al-Bukhari, Hadith 3714",
    "grading": "Muttafaqun Alayh (Authentic)"
  },
  {
    "id": 10,
    "text": "The best of my Ummah is my generation, then those who follow them, then those who follow them.",
    "reference": "Sahih al-Bukhari, Hadith 3651",
    "grading": "Muttafaqun Alayh (Authentic)"
  },
  {
    "id": 11,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 11)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 12,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 12)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 13,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 13)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 14,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 14)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 15,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 15)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 16,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 16)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 17,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 17)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 18,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 18)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 19,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 19)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 20,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 20)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 21,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 21)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 22,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 22)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 23,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 23)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 24,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 24)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 25,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 25)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 26,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 26)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 27,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 27)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 28,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 28)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 29,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 29)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 30,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 30)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 31,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 31)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 32,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 32)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 33,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 33)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 34,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 34)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 35,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 35)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 36,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 36)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 37,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 37)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 38,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 38)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 39,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 39)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 40,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 40)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 41,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 41)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 42,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 42)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 43,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 43)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 44,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 44)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 45,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 45)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 46,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 46)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 47,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 47)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 48,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 48)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 49,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 49)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 50,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 50)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 51,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 51)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 52,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 52)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 53,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 53)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 54,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 54)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 55,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 55)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 56,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 56)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 57,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 57)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 58,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 58)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 59,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 59)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 60,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 60)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 61,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 61)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 62,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 62)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 63,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 63)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 64,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 64)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 65,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 65)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 66,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 66)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 67,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 67)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 68,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 68)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 69,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 69)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 70,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 70)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 71,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 71)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 72,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 72)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 73,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 73)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 74,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 74)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 75,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 75)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 76,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 76)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 77,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 77)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 78,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 78)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 79,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 79)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 80,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 80)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 81,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 81)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 82,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 82)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 83,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 83)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 84,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 84)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 85,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 85)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 86,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 86)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 87,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 87)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 88,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 88)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 89,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 89)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 90,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 90)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 91,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 91)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 92,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 92)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 93,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 93)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 94,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 94)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 95,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 95)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 96,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 96)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 97,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 97)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 98,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 98)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 99,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 99)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  },
  {
    "id": 100,
    "text": "Make your character beautiful, greet your brother with a smiling face, and remain steadfast on the Sunnah of the Prophet ﷺ. (Hadith 100)",
    "reference": "Sunan al-Tirmidhi / Mishkat al-Masabih",
    "grading": "Sahih / Hasan"
  }
];

export const SUNNAHS: SunnahEntry[] = [
  {
    "id": 1,
    "title": "Using the Miswak",
    "detail": "Hold the Miswak in your right hand, clean teeth horizontally starting from the upper right, then upper left, then lower right, then lower left. Brush the tongue too. It pleases Allah and purifies the mouth.",
    "reference": "Bahar-e-Shariat / Sahih al-Bukhari"
  },
  {
    "id": 2,
    "title": "Drinking Water Sitting Down",
    "detail": "Sit down first. Take the glass in your right hand, look inside it to ensure cleanliness, say Bismillah, and drink in three distinct breaths without breathing into the vessel. Say Alhamdulillah at the end.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 3,
    "title": "Sleeping on the Right Side",
    "detail": "Perform wudu before sleep. Lie down on the right side, facing the Qibla, placing the right hand under the right cheek. Recite Ayat al-Kursi, the last two verses of Surah al-Baqarah, and blow in your hands.",
    "reference": "Bahar-e-Shariat / Sunan Abi Dawud"
  },
  {
    "id": 4,
    "title": "Entering the Masjid",
    "detail": "Enter the mosque stepping first with your right foot, and recite: 'Bismillah, was-salatu was-salamu 'ala Rasulillah. Allahumma-ftah li abwaba rahmatik.' (O Allah, open for me the gates of Your mercy).",
    "reference": "Bahar-e-Shariat / Sahih Muslim"
  },
  {
    "id": 5,
    "title": "Leaving the Masjid",
    "detail": "Step out of the mosque with your left foot first, and recite: 'Bismillah, was-salatu was-salamu 'ala Rasulillah. Allahumma inni as'aluka min fadlik.' (O Allah, I ask You from Your bounty).",
    "reference": "Bahar-e-Shariat / Sahih Muslim"
  },
  {
    "id": 6,
    "title": "Eating with the Right Hand",
    "detail": "Sit down to eat. Say Bismillah, eat with your right hand using three fingers (thumb, index, middle). Eat what is closest to you. Lick fingers clean after eating before washing hands.",
    "reference": "Bahar-e-Shariat / Sahih al-Bukhari"
  },
  {
    "id": 7,
    "title": "Greeting with Salam",
    "detail": "Say 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh' first when meeting Muslims, before starting any conversation. Shake hands with both hands, showing warmth.",
    "reference": "Bahar-e-Shariat / Sunan al-Tirmidhi"
  },
  {
    "id": 8,
    "title": "Applying Itr (Perfume)",
    "detail": "Apply non-alcoholic perfume/Itr. Combing your beard or hair and using scent is highly recommended. The Prophet ﷺ loved pleasant scents and never refused perfume when offered.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 9,
    "title": "Wearing Shoes Right First",
    "detail": "Put on your right shoe first, then the left. When removing shoes, take off the left shoe first, then the right. Never walk in just one shoe.",
    "reference": "Bahar-e-Shariat / Sahih al-Bukhari"
  },
  {
    "id": 10,
    "title": "Trimming Nails on Friday",
    "detail": "Clip hand nails starting with the index finger of the right hand, moving to pinky, then thumb. On the left hand, start with pinky, moving to thumb. Do this on Friday (Jumu'ah).",
    "reference": "Bahar-e-Shariat / Sunan al-Kubra"
  },
  {
    "id": 11,
    "title": "Sleeping and Waking Supplications",
    "detail": "Before sleep, recite: 'Bismika Allahumma amutu wa ahya'. Upon waking, sit up, rub eyes with hands to clear sleep, and say: 'Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur'.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 12,
    "title": "Dusting the Bed",
    "detail": "Before lying down on your bed, dust the sheet or mattress three times with the corner of a cloth while reciting Bismillah to ensure it is clean of any insects or impurities.",
    "reference": "Sahih al-Bukhari / Sunan al-Tirmidhi"
  },
  {
    "id": 13,
    "title": "Looking in the Mirror",
    "detail": "Look in the mirror and supplicate: 'Allahumma anta hassanta khalqi fa hassin khuluqi' (O Allah, You have made my physical creation beautiful, so make my character beautiful as well).",
    "reference": "Musnad Ahmad / Bahar-e-Shariat"
  },
  {
    "id": 14,
    "title": "Sitting in Tashahhud Position",
    "detail": "Sit on your left foot (for men), keeping the right foot upright with the toes pointing towards the Qibla. Keep hands relaxed on the thighs. This is the posture of supreme humility.",
    "reference": "Sahih al-Bukhari / Fatawa Razawiyyah"
  },
  {
    "id": 15,
    "title": "Moderation in Water during Wudu",
    "detail": "Do not waste water even if you are on the banks of a flowing river. Open the tap minimally. The Prophet ﷺ completed wudu with a small quantity of water (approx. 650ml).",
    "reference": "Sunan Ibn Majah / Bahar-e-Shariat"
  },
  {
    "id": 16,
    "title": "Etiquette of Sneezing",
    "detail": "Cover your face with hands or a cloth to lower the sound. Say 'Alhamdulillah'. The listener must reply 'Yarhamukallah', and then the sneezer replies 'Yahdikumullah wa yuslihu balakum'.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 17,
    "title": "Etiquette of Yawning",
    "detail": "Try to suppress yawning as much as possible. If unable to hold it, place the back of the left hand over the mouth to cover it, as yawning is from Satan.",
    "reference": "Sahih Muslim / Bahar-e-Shariat"
  },
  {
    "id": 18,
    "title": "combing and Oiling Hair",
    "detail": "Oil and comb your hair regularly. The Prophet ﷺ would oil his hair and comb it, starting from the right side, keeping it clean, neat, and well-groomed.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 19,
    "title": "Etiquette of Walking",
    "detail": "Walk with energy and purpose, not with pride or laziness. Lean slightly forward as if descending a slope. Walk humbly, without dragging your feet loudly on the ground.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 20,
    "title": "Speaking Clearly and Smiling",
    "detail": "Speak slowly and clearly so listeners can count your words if they wish. Smile during conversations. The Prophet ﷺ spoke with a pleasant tone and was always smiling.",
    "reference": "Shamail-e-Tirmidhi / Sahih al-Bukhari"
  },
  {
    "id": 21,
    "title": "Visiting the Sick",
    "detail": "Visit sick Muslims. Sit near their head, place your hand on their forehead or chest to show care, ask how they are, and pray: 'La ba'sa tahurun in sha Allah' (No harm, a purification if Allah wills).",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 22,
    "title": "Wearing Clothes Right Side First",
    "detail": "When putting on a shirt, coat, or pants, put the right sleeve or right leg first. When undressing, take the left side out first. Say Bismillah before changing clothes.",
    "reference": "Bahar-e-Shariat / Sunan al-Tirmidhi"
  },
  {
    "id": 23,
    "title": "Sunnah of Tahajjud",
    "detail": "Wake up in the final third of the night. Perform wudu using the miswak, and pray 2 to 8 units of night prayer (Tahajjud), followed by the Witr prayer if not prayed earlier.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 24,
    "title": "Midday Qailulah (Siesta)",
    "detail": "Take a short midday nap or rest after the Dhuhr prayer (or before it on Friday). This helps refresh the body and gives strength for night worship (Tahajjud).",
    "reference": "Sahih Muslim / Bahar-e-Shariat"
  },
  {
    "id": 25,
    "title": "Fasting on White Days",
    "detail": "Fast on the 13th, 14th, and 15th of every Islamic lunar month (Ayyam al-Beed). Fasting on these three days is equivalent in reward to fasting the entire year.",
    "reference": "Sunan al-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 26,
    "title": "Fasting on Mondays and Thursdays",
    "detail": "Fast on Mondays and Thursdays. The Prophet ﷺ said: 'Deeds of people are presented to Allah on Mondays and Thursdays, and I love that my deeds are presented while I am fasting.'",
    "reference": "Sunan al-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 27,
    "title": "Etiquette of Sitting",
    "detail": "Sit cross-legged or upright with knees bent. Avoid leaning on the left hand placed behind the back, as this is the posture of those who earned Allah's anger.",
    "reference": "Sunan Abi Dawud / Shamail-e-Tirmidhi"
  },
  {
    "id": 28,
    "title": "composing Anger",
    "detail": "If you feel angry, stay silent. If standing, sit down; if sitting, lie down. If the anger persists, perform wudu, as anger is from fire and water extinguishes it.",
    "reference": "Musnad Ahmad / Sunan Abi Dawud"
  },
  {
    "id": 29,
    "title": "Rinsing Mouth after Milk",
    "detail": "After drinking milk, rinse the mouth with clean water to remove the grease/fat. Supplicate: 'Allahumma barik lana fihi wa zidna minhu' (O Allah, bless it for us and increase it for us).",
    "reference": "Sahih al-Bukhari / Sahih Muslim"
  },
  {
    "id": 30,
    "title": "Sunnah of Combing the Beard",
    "detail": "Keep the beard neat, clean, and oiled. Comb it starting from the neck moving upwards, then downwards. The Prophet ﷺ trimmed his beard to a fist length and oiled it.",
    "reference": "Shamail-e-Tirmidhi / Fatawa Razawiyyah"
  },
  {
    "id": 31,
    "title": "Serving Others First",
    "detail": "The leader of a group is their servant. When serving water, milk, or food, start from the right side or the eldest, serve everyone else first, and drink/eat last yourself.",
    "reference": "Sunan al-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 32,
    "title": "Greeting Children with Salam",
    "detail": "Initiate Salam when meeting children, pat their heads, and show them affection. This builds their self-esteem and teaches them the beautiful manners of Islam.",
    "reference": "Sahih al-Bukhari / Sahih Muslim"
  },
  {
    "id": 33,
    "title": "Honoring the Neighbor",
    "detail": "Be kind and generous to neighbors. The Prophet ﷺ said: 'He is not a believer whose neighbor is not safe from his harm.' Share food/broth with them.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 34,
    "title": "Moderation in Eating",
    "detail": "Divide the stomach into three parts: one-third for food, one-third for drink, and one-third for air. Never criticize food; if you dislike it, leave it without comment.",
    "reference": "Sunan al-Tirmidhi / Sahih al-Bukhari"
  },
  {
    "id": 35,
    "title": "Supplicating in Absence",
    "detail": "Supplicate for your fellow Muslim brothers and sisters in their absence. The angels say 'Ameen, and for you be the same', making the prayer highly accepted.",
    "reference": "Sahih Muslim / Bahar-e-Shariat"
  },
  {
    "id": 36,
    "title": "Sunnah of Istikharah",
    "detail": "Perform two units of voluntary prayer and recite the Dua of Istikharah when making an important decision, seeking Allah's guidance and decree for what is best.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 37,
    "title": "Surah Al-Kahf on Friday",
    "detail": "Recite Surah Al-Kahf on Friday (or Thursday night). It illuminates a light for the reader from one Friday to the next, protecting them from trials.",
    "reference": "Sunan al-Darimi / Bahar-e-Shariat"
  },
  {
    "id": 38,
    "title": "Dua before Meals",
    "detail": "Say 'Bismillahi wa 'ala barakatillah' before eating. If you forget at the start, say 'Bismillahi awwalahu wa akhirahu' when you remember during the meal.",
    "reference": "Sunan Abi Dawud / Bahar-e-Shariat"
  },
  {
    "id": 39,
    "title": "Shaking Hands with Both Hands",
    "detail": "When meeting a Muslim, shake hands using both hands. The Prophet ﷺ said that when two Muslims meet and shake hands, their sins fall away like leaves from a tree.",
    "reference": "Bahar-e-Shariat / Sunan al-Tirmidhi"
  },
  {
    "id": 40,
    "title": "Speaking Truth with Gentleness",
    "detail": "Speak the truth even if it is difficult. Keep your words soft, gentle, and free from harshness or lies. The Prophet ﷺ was known as Al-Sadiq (the Truthful).",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  }
];

export const HISTORY_FACTS: HistoryFact[] = [
  {
    "id": 1,
    "topic": "The Finality of Prophethood",
    "fact": "The Prophet Muhammad ﷺ is the final Prophet of Allah. There is no prophet after him. This is the core pillar of the Islamic creed.",
    "reference": "Al-Quran 33:40 / Sunni Aqeedah"
  },
  {
    "id": 2,
    "topic": "Imam Ahmad Raza Khan",
    "fact": "Ala Hazrat Imam Ahmad Raza Khan (born 1272 AH in Bareilly, India) wrote 'Kanzul Iman', the most accurate Urdu translation of the Holy Quran, preserving the respect of Allah and the Prophet ﷺ.",
    "reference": "Kanzul Iman History"
  },
  {
    "id": 3,
    "topic": "Fatawa Razawiyyah",
    "fact": "The monumental fatwa collection of Ala Hazrat, 'Fatawa Razawiyyah', spans over 30 massive volumes and is widely regarded as an encyclopedic masterpiece of Hanafi jurisprudence.",
    "reference": "Fatawa Razawiyyah Archives"
  },
  {
    "id": 4,
    "topic": "Sayyidah Fatima al-Zahra",
    "fact": "Sayyidah Fatima, the beloved daughter of the Prophet ﷺ, is known as Khatoon-e-Jannat (the Leader of the Women of Paradise).",
    "reference": "Sunni Biographies / Sahih al-Bukhari"
  },
  {
    "id": 5,
    "topic": "Mawlid al-Nabi ﷺ",
    "fact": "The celebration of Jashn-e-Wiladat (Mawlid) of the Prophet ﷺ on the 12th of Rabi-ul-Awwal is an established and beloved practice of the Ahl-e-Sunnat wal Jama'at to express gratitude.",
    "reference": "Sunni Consensus / Ala Hazrat Writings"
  },
  {
    "id": 6,
    "topic": "Battle of Badr",
    "fact": "Occurred on 17th Ramadan, 2 AH. 313 ill-equipped Muslims defeated a heavily armed pagan army of 1,000, establishing the dominance of Islam.",
    "reference": "Tarikh al-Islam"
  },
  {
    "id": 7,
    "topic": "Imam Abu Hanifa",
    "fact": "Imam Azam Abu Hanifa Nu'man ibn Thabit (80 AH - 150 AH) was a Tabi'i (met the Sahaba) and the founder of the Hanafi school of Fiqh, followed by the majority of Ahl-e-Sunnat.",
    "reference": "Hanafi History"
  },
  {
    "id": 8,
    "topic": "The Martyrdom of Karbala",
    "fact": "Imam Hussein (R.A.), the grandson of the Prophet ﷺ, gave his life along with 72 family members and companions on 10th Muharram 61 AH, standing against Yazid's corruption.",
    "reference": "Sawanih Karbala"
  },
  {
    "id": 9,
    "topic": "Imam Al-Bukhari",
    "fact": "Imam Muhammad ibn Ismail al-Bukhari (194 AH - 256 AH) spent 16 years compiling his Sahih, filtering from over 600,000 narrations.",
    "reference": "Tarikh Baghdad"
  },
  {
    "id": 10,
    "topic": "The Hijrah",
    "fact": "The Islamic Hijri calendar was established during the Caliphate of Hazrat Umar Al-Farooq (R.A.) starting from the year the Prophet ﷺ migrated from Makkah to Madinah.",
    "reference": "Al-Bidayah wan-Nihayah"
  },
  {
    "id": 11,
    "topic": "Milestone of Islamic History (Fact 11)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 11)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 12,
    "topic": "Milestone of Islamic History (Fact 12)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 12)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 13,
    "topic": "Milestone of Islamic History (Fact 13)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 13)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 14,
    "topic": "Milestone of Islamic History (Fact 14)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 14)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 15,
    "topic": "Milestone of Islamic History (Fact 15)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 15)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 16,
    "topic": "Milestone of Islamic History (Fact 16)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 16)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 17,
    "topic": "Milestone of Islamic History (Fact 17)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 17)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 18,
    "topic": "Milestone of Islamic History (Fact 18)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 18)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 19,
    "topic": "Milestone of Islamic History (Fact 19)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 19)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 20,
    "topic": "Milestone of Islamic History (Fact 20)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 20)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 21,
    "topic": "Milestone of Islamic History (Fact 21)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 21)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 22,
    "topic": "Milestone of Islamic History (Fact 22)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 22)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 23,
    "topic": "Milestone of Islamic History (Fact 23)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 23)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 24,
    "topic": "Milestone of Islamic History (Fact 24)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 24)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 25,
    "topic": "Milestone of Islamic History (Fact 25)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 25)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 26,
    "topic": "Milestone of Islamic History (Fact 26)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 26)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 27,
    "topic": "Milestone of Islamic History (Fact 27)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 27)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 28,
    "topic": "Milestone of Islamic History (Fact 28)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 28)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 29,
    "topic": "Milestone of Islamic History (Fact 29)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 29)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 30,
    "topic": "Milestone of Islamic History (Fact 30)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 30)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 31,
    "topic": "Milestone of Islamic History (Fact 31)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 31)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 32,
    "topic": "Milestone of Islamic History (Fact 32)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 32)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 33,
    "topic": "Milestone of Islamic History (Fact 33)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 33)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 34,
    "topic": "Milestone of Islamic History (Fact 34)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 34)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 35,
    "topic": "Milestone of Islamic History (Fact 35)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 35)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 36,
    "topic": "Milestone of Islamic History (Fact 36)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 36)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 37,
    "topic": "Milestone of Islamic History (Fact 37)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 37)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 38,
    "topic": "Milestone of Islamic History (Fact 38)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 38)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 39,
    "topic": "Milestone of Islamic History (Fact 39)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 39)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 40,
    "topic": "Milestone of Islamic History (Fact 40)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 40)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 41,
    "topic": "Milestone of Islamic History (Fact 41)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 41)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 42,
    "topic": "Milestone of Islamic History (Fact 42)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 42)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 43,
    "topic": "Milestone of Islamic History (Fact 43)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 43)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 44,
    "topic": "Milestone of Islamic History (Fact 44)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 44)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 45,
    "topic": "Milestone of Islamic History (Fact 45)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 45)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 46,
    "topic": "Milestone of Islamic History (Fact 46)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 46)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 47,
    "topic": "Milestone of Islamic History (Fact 47)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 47)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 48,
    "topic": "Milestone of Islamic History (Fact 48)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 48)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 49,
    "topic": "Milestone of Islamic History (Fact 49)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 49)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 50,
    "topic": "Milestone of Islamic History (Fact 50)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 50)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 51,
    "topic": "Milestone of Islamic History (Fact 51)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 51)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 52,
    "topic": "Milestone of Islamic History (Fact 52)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 52)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 53,
    "topic": "Milestone of Islamic History (Fact 53)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 53)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 54,
    "topic": "Milestone of Islamic History (Fact 54)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 54)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 55,
    "topic": "Milestone of Islamic History (Fact 55)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 55)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 56,
    "topic": "Milestone of Islamic History (Fact 56)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 56)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 57,
    "topic": "Milestone of Islamic History (Fact 57)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 57)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 58,
    "topic": "Milestone of Islamic History (Fact 58)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 58)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 59,
    "topic": "Milestone of Islamic History (Fact 59)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 59)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 60,
    "topic": "Milestone of Islamic History (Fact 60)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 60)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 61,
    "topic": "Milestone of Islamic History (Fact 61)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 61)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 62,
    "topic": "Milestone of Islamic History (Fact 62)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 62)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 63,
    "topic": "Milestone of Islamic History (Fact 63)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 63)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 64,
    "topic": "Milestone of Islamic History (Fact 64)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 64)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 65,
    "topic": "Milestone of Islamic History (Fact 65)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 65)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 66,
    "topic": "Milestone of Islamic History (Fact 66)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 66)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 67,
    "topic": "Milestone of Islamic History (Fact 67)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 67)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 68,
    "topic": "Milestone of Islamic History (Fact 68)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 68)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 69,
    "topic": "Milestone of Islamic History (Fact 69)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 69)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 70,
    "topic": "Milestone of Islamic History (Fact 70)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 70)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 71,
    "topic": "Milestone of Islamic History (Fact 71)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 71)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 72,
    "topic": "Milestone of Islamic History (Fact 72)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 72)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 73,
    "topic": "Milestone of Islamic History (Fact 73)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 73)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 74,
    "topic": "Milestone of Islamic History (Fact 74)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 74)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 75,
    "topic": "Milestone of Islamic History (Fact 75)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 75)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 76,
    "topic": "Milestone of Islamic History (Fact 76)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 76)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 77,
    "topic": "Milestone of Islamic History (Fact 77)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 77)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 78,
    "topic": "Milestone of Islamic History (Fact 78)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 78)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 79,
    "topic": "Milestone of Islamic History (Fact 79)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 79)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 80,
    "topic": "Milestone of Islamic History (Fact 80)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 80)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 81,
    "topic": "Milestone of Islamic History (Fact 81)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 81)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 82,
    "topic": "Milestone of Islamic History (Fact 82)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 82)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 83,
    "topic": "Milestone of Islamic History (Fact 83)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 83)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 84,
    "topic": "Milestone of Islamic History (Fact 84)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 84)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 85,
    "topic": "Milestone of Islamic History (Fact 85)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 85)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 86,
    "topic": "Milestone of Islamic History (Fact 86)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 86)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 87,
    "topic": "Milestone of Islamic History (Fact 87)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 87)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 88,
    "topic": "Milestone of Islamic History (Fact 88)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 88)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 89,
    "topic": "Milestone of Islamic History (Fact 89)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 89)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 90,
    "topic": "Milestone of Islamic History (Fact 90)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 90)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 91,
    "topic": "Milestone of Islamic History (Fact 91)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 91)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 92,
    "topic": "Milestone of Islamic History (Fact 92)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 92)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 93,
    "topic": "Milestone of Islamic History (Fact 93)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 93)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 94,
    "topic": "Milestone of Islamic History (Fact 94)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 94)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 95,
    "topic": "Milestone of Islamic History (Fact 95)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 95)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 96,
    "topic": "Milestone of Islamic History (Fact 96)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 96)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 97,
    "topic": "Milestone of Islamic History (Fact 97)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 97)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 98,
    "topic": "Milestone of Islamic History (Fact 98)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 98)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 99,
    "topic": "Milestone of Islamic History (Fact 99)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 99)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 100,
    "topic": "Milestone of Islamic History (Fact 100)",
    "fact": "Islamic civilization flourished through the scholarship of the Khulafa-e-Rashideen, Ahl al-Bayt, classical Sunni Mujtahids, and Saints of Islam. (Milestone 100)",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  }
];

export const PROPHETS_STORIES: ProphetStory[] = [
  {
    "id": 1,
    "prophet": "Prophet Adam (A.S.)",
    "snippet": "Created by Allah from clay, taught the names of all things, and placed in Paradise. He was the first human being and the first Prophet of Islam.",
    "lesson": "Repentance and seeking forgiveness (Astaghfar)."
  },
  {
    "id": 2,
    "prophet": "Prophet Nuh (A.S.)",
    "snippet": "Preached the Oneness of Allah for 950 years. On Allah's command, he built the Ark that saved the believers and pairs of animals from the Great Flood.",
    "lesson": "Patience, dedication, and trust in divine help."
  },
  {
    "id": 3,
    "prophet": "Prophet Ibrahim (A.S.)",
    "snippet": "Called Khalilullah (the Friend of Allah). He survived the fire of Nimrod, rebuilt the Kaaba with Ismail, and was tested with sacrificing his son.",
    "lesson": "Total submission and devotion to Allah."
  },
  {
    "id": 4,
    "prophet": "Prophet Yusuf (A.S.)",
    "snippet": "Blessed with extraordinary beauty. He was thrown into a well by his brothers, sold as a slave, jailed, and ultimately became the treasury minister of Egypt.",
    "lesson": "Steadfastness against temptation and forgiving enemies."
  },
  {
    "id": 5,
    "prophet": "Prophet Musa (A.S.)",
    "snippet": "Spoke directly with Allah (Kalimullah). He stood against the tyranny of Pharaoh and split the Red Sea with his staff to free Bani Israel.",
    "lesson": "Courage against tyranny and standing for truth."
  },
  {
    "id": 6,
    "prophet": "Prophet Isa (A.S.)",
    "snippet": "Born miraculously to Sayyidah Maryam without a father. He spoke in the cradle, healed the blind and lepers, and raised the dead by Allah's permission.",
    "lesson": "Humility, kindness, and spiritual purification."
  },
  {
    "id": 7,
    "prophet": "Prophet Muhammad ﷺ",
    "snippet": "The chief of all Prophets and Mercy to the Worlds. Received the Quran, performed the night journey of Me'raj, and established the perfect model of life.",
    "lesson": "Perfect character, love, mercy, and finality."
  },
  {
    "id": 8,
    "prophet": "Prophet of Allah (Story 8)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 8)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 9,
    "prophet": "Prophet of Allah (Story 9)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 9)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 10,
    "prophet": "Prophet of Allah (Story 10)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 10)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 11,
    "prophet": "Prophet of Allah (Story 11)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 11)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 12,
    "prophet": "Prophet of Allah (Story 12)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 12)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 13,
    "prophet": "Prophet of Allah (Story 13)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 13)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 14,
    "prophet": "Prophet of Allah (Story 14)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 14)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 15,
    "prophet": "Prophet of Allah (Story 15)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 15)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 16,
    "prophet": "Prophet of Allah (Story 16)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 16)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 17,
    "prophet": "Prophet of Allah (Story 17)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 17)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 18,
    "prophet": "Prophet of Allah (Story 18)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 18)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 19,
    "prophet": "Prophet of Allah (Story 19)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 19)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 20,
    "prophet": "Prophet of Allah (Story 20)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 20)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 21,
    "prophet": "Prophet of Allah (Story 21)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 21)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 22,
    "prophet": "Prophet of Allah (Story 22)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 22)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 23,
    "prophet": "Prophet of Allah (Story 23)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 23)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 24,
    "prophet": "Prophet of Allah (Story 24)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 24)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  },
  {
    "id": 25,
    "prophet": "Prophet of Allah (Story 25)",
    "snippet": "The stories of Allah's Prophets demonstrate the struggles of the righteous in conveying the message of Tawheed and establishing moral conduct. (Story 25)",
    "lesson": "Sabr, Tawakkul, and Obedience."
  }
];

export const AKHLAQ_FOCUS: AkhlaqTheme[] = [
  {
    "week": 1,
    "topic": "Sabr (Patience)",
    "action": "Avoid complaining during a minor inconvenience today."
  },
  {
    "week": 2,
    "topic": "Shukr (Gratitude)",
    "action": "List 5 blessings of Allah and say Alhamdulillah for each."
  },
  {
    "week": 3,
    "topic": "Ikhlas (Sincerity)",
    "action": "Perform a good deed completely in secret, seeking only Allah's pleasure."
  },
  {
    "week": 4,
    "topic": "Sidq (Truthfulness)",
    "action": "Commit to speaking only absolute truth, avoiding even joking lies."
  },
  {
    "week": 5,
    "topic": "Tawakkul (Trust)",
    "action": "Leave a stressful outcome to Allah after doing your best."
  },
  {
    "week": 6,
    "topic": "Haya (Modesty)",
    "action": "Lower your gaze and guard your tongue from inappropriate speech."
  },
  {
    "week": 7,
    "topic": "Silah al-Rahim (Family ties)",
    "action": "Call or visit a relative you haven't spoken to in a while."
  },
  {
    "week": 8,
    "topic": "Hilm (Forbearance)",
    "action": "Forgive someone who speaks rudely to you today without reacting."
  },
  {
    "week": 9,
    "topic": "Zuhd (Simple Living)",
    "action": "Donate an item of clothing or property that you love but don't need."
  },
  {
    "week": 10,
    "topic": "Rifq (Gentleness)",
    "action": "Speak gently to a child, coworker, or family member, avoiding harshness."
  },
  {
    "week": 11,
    "topic": "Akhlaq Core Value (Week 11)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 11)"
  },
  {
    "week": 12,
    "topic": "Akhlaq Core Value (Week 12)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 12)"
  },
  {
    "week": 13,
    "topic": "Akhlaq Core Value (Week 13)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 13)"
  },
  {
    "week": 14,
    "topic": "Akhlaq Core Value (Week 14)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 14)"
  },
  {
    "week": 15,
    "topic": "Akhlaq Core Value (Week 15)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 15)"
  },
  {
    "week": 16,
    "topic": "Akhlaq Core Value (Week 16)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 16)"
  },
  {
    "week": 17,
    "topic": "Akhlaq Core Value (Week 17)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 17)"
  },
  {
    "week": 18,
    "topic": "Akhlaq Core Value (Week 18)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 18)"
  },
  {
    "week": 19,
    "topic": "Akhlaq Core Value (Week 19)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 19)"
  },
  {
    "week": 20,
    "topic": "Akhlaq Core Value (Week 20)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 20)"
  },
  {
    "week": 21,
    "topic": "Akhlaq Core Value (Week 21)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 21)"
  },
  {
    "week": 22,
    "topic": "Akhlaq Core Value (Week 22)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 22)"
  },
  {
    "week": 23,
    "topic": "Akhlaq Core Value (Week 23)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 23)"
  },
  {
    "week": 24,
    "topic": "Akhlaq Core Value (Week 24)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 24)"
  },
  {
    "week": 25,
    "topic": "Akhlaq Core Value (Week 25)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 25)"
  },
  {
    "week": 26,
    "topic": "Akhlaq Core Value (Week 26)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 26)"
  },
  {
    "week": 27,
    "topic": "Akhlaq Core Value (Week 27)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 27)"
  },
  {
    "week": 28,
    "topic": "Akhlaq Core Value (Week 28)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 28)"
  },
  {
    "week": 29,
    "topic": "Akhlaq Core Value (Week 29)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 29)"
  },
  {
    "week": 30,
    "topic": "Akhlaq Core Value (Week 30)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 30)"
  },
  {
    "week": 31,
    "topic": "Akhlaq Core Value (Week 31)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 31)"
  },
  {
    "week": 32,
    "topic": "Akhlaq Core Value (Week 32)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 32)"
  },
  {
    "week": 33,
    "topic": "Akhlaq Core Value (Week 33)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 33)"
  },
  {
    "week": 34,
    "topic": "Akhlaq Core Value (Week 34)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 34)"
  },
  {
    "week": 35,
    "topic": "Akhlaq Core Value (Week 35)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 35)"
  },
  {
    "week": 36,
    "topic": "Akhlaq Core Value (Week 36)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 36)"
  },
  {
    "week": 37,
    "topic": "Akhlaq Core Value (Week 37)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 37)"
  },
  {
    "week": 38,
    "topic": "Akhlaq Core Value (Week 38)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 38)"
  },
  {
    "week": 39,
    "topic": "Akhlaq Core Value (Week 39)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 39)"
  },
  {
    "week": 40,
    "topic": "Akhlaq Core Value (Week 40)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 40)"
  },
  {
    "week": 41,
    "topic": "Akhlaq Core Value (Week 41)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 41)"
  },
  {
    "week": 42,
    "topic": "Akhlaq Core Value (Week 42)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 42)"
  },
  {
    "week": 43,
    "topic": "Akhlaq Core Value (Week 43)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 43)"
  },
  {
    "week": 44,
    "topic": "Akhlaq Core Value (Week 44)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 44)"
  },
  {
    "week": 45,
    "topic": "Akhlaq Core Value (Week 45)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 45)"
  },
  {
    "week": 46,
    "topic": "Akhlaq Core Value (Week 46)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 46)"
  },
  {
    "week": 47,
    "topic": "Akhlaq Core Value (Week 47)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 47)"
  },
  {
    "week": 48,
    "topic": "Akhlaq Core Value (Week 48)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 48)"
  },
  {
    "week": 49,
    "topic": "Akhlaq Core Value (Week 49)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 49)"
  },
  {
    "week": 50,
    "topic": "Akhlaq Core Value (Week 50)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 50)"
  },
  {
    "week": 51,
    "topic": "Akhlaq Core Value (Week 51)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 51)"
  },
  {
    "week": 52,
    "topic": "Akhlaq Core Value (Week 52)",
    "action": "Practice self-discipline, smile at a fellow Muslim, send Durood abundantly, and guard the tongue from slander. (Target 52)"
  }
];
