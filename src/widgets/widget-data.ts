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
    "text": "The best of you are those who have the best manners and character.",
    "reference": "Sahih al-Bukhari, Hadith 3559",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 12,
    "text": "A Muslim is the one from whose tongue and hand other Muslims are safe.",
    "reference": "Sahih al-Bukhari, Hadith 10",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 13,
    "text": "Allah does not look at your bodies or your wealth, but He looks at your hearts and your deeds.",
    "reference": "Sahih Muslim, Hadith 2564",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 14,
    "text": "None of you believes until he loves for his brother what he loves for himself.",
    "reference": "Sahih al-Bukhari, Hadith 13",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 15,
    "text": "The most beloved of deeds to Allah is that which is done consistently, even if it is little.",
    "reference": "Sahih al-Bukhari, Hadith 5861",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 16,
    "text": "Cleanliness is half of faith.",
    "reference": "Sahih Muslim, Hadith 223",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 17,
    "text": "He who does not show mercy to our young ones and show respect to our old ones is not from us.",
    "reference": "Sunan al-Tirmidhi, Hadith 1919",
    "grading": "Hasan (Good)"
  },
  {
    "id": 18,
    "text": "Dua (supplication) is the very essence of worship.",
    "reference": "Sunan al-Tirmidhi, Hadith 3371",
    "grading": "Hasan (Good)"
  },
  {
    "id": 19,
    "text": "A good word is a form of charity.",
    "reference": "Sahih al-Bukhari, Hadith 2989",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 20,
    "text": "The world is a prison for the believer and a paradise for the disbeliever.",
    "reference": "Sahih Muslim, Hadith 2956",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 21,
    "text": "The most perfect of believers in faith are those with the best character.",
    "reference": "Sunan Abi Dawud, Hadith 4682",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 22,
    "text": "Save yourself from the Hellfire, even if it is by giving half a date-fruit in charity.",
    "reference": "Sahih al-Bukhari, Hadith 1417",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 23,
    "text": "The giving hand is better than the receiving hand.",
    "reference": "Sahih al-Bukhari, Hadith 1429",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 24,
    "text": "Whosoever removes a worldly grief from a believer, Allah will remove from him one of the griefs of the Day of Judgment.",
    "reference": "Sahih Muslim, Hadith 2699",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 25,
    "text": "Seeking sacred knowledge is an obligation upon every Muslim.",
    "reference": "Sunan Ibn Majah, Hadith 224",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 26,
    "text": "Indeed, actions are judged by their intentions.",
    "reference": "Sahih al-Bukhari, Hadith 1",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 27,
    "text": "Verily, Allah is gentle and He loves gentleness in all matters.",
    "reference": "Sahih Muslim, Hadith 2593",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 28,
    "text": "Do not become angry, and for you is Paradise.",
    "reference": "Sahih al-Bukhari, Hadith 6116",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 29,
    "text": "The strong man is not the one who can wrestle, but the one who controls himself when angry.",
    "reference": "Sahih al-Bukhari, Hadith 6114",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 30,
    "text": "The religion is sincere advice and well-wishing.",
    "reference": "Sahih Muslim, Hadith 55",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 31,
    "text": "Make things easy for people and do not make them difficult.",
    "reference": "Sahih al-Bukhari, Hadith 6125",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 32,
    "text": "Allah will not show mercy to him who does not show mercy to people.",
    "reference": "Sahih al-Bukhari, Hadith 7376",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 33,
    "text": "He who believes in Allah and the Last Day should honor his guest.",
    "reference": "Sahih al-Bukhari, Hadith 6138",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 34,
    "text": "Avoid envy, for envy devours good deeds just as fire devours firewood.",
    "reference": "Sunan Abi Dawud, Hadith 4903",
    "grading": "Hasan (Good)"
  },
  {
    "id": 35,
    "text": "A man will be resurrected on the Day of Judgment with those whom he loved in the world.",
    "reference": "Sahih al-Bukhari, Hadith 6168",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 36,
    "text": "He who points out a good deed receives the same reward as the one who performs it.",
    "reference": "Sahih Muslim, Hadith 1893",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 37,
    "text": "Whoever follows a path in search of knowledge, Allah will make easy for him the path to Paradise.",
    "reference": "Sahih Muslim, Hadith 2699",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 38,
    "text": "Remember Allah in times of ease, and He will remember you in times of hardship.",
    "reference": "Musnad Ahmad, Hadith 2803",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 39,
    "text": "Paradise lies under the feet of your mothers.",
    "reference": "Musnad al-Shihab, Hadith 119",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 40,
    "text": "The pleasure of the Lord is in the pleasure of the father, and the displeasure of the Lord is in the displeasure of the father.",
    "reference": "Sunan al-Tirmidhi, Hadith 1899",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 41,
    "text": "He who cuts off family ties will not enter Paradise.",
    "reference": "Sahih al-Bukhari, Hadith 5984",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 42,
    "text": "Do not backbite one another, nor search for each other's faults.",
    "reference": "Sunan Abi Dawud, Hadith 4880",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 43,
    "text": "Modesty (Haya) is entirely goodness, and it is a branch of faith.",
    "reference": "Sahih al-Bukhari, Hadith 9",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 44,
    "text": "The best of you are those who are best to their wives.",
    "reference": "Sunan al-Tirmidhi, Hadith 1162",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 45,
    "text": "When a man dies, his deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
    "reference": "Sahih Muslim, Hadith 1631",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 46,
    "text": "Keep your tongue wet with the constant remembrance (Dhikr) of Allah.",
    "reference": "Sunan al-Tirmidhi, Hadith 3375",
    "grading": "Hasan (Good)"
  },
  {
    "id": 47,
    "text": "Read the Quran, for indeed it will come on the Day of Resurrection as an intercessor for its companions.",
    "reference": "Sahih Muslim, Hadith 804",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 48,
    "text": "Whoever recites a letter from the Book of Allah will have a reward, and a reward is multiplied by ten.",
    "reference": "Sunan al-Tirmidhi, Hadith 2910",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 49,
    "text": "He is not a believer who fills his stomach while his neighbor beside him goes hungry.",
    "reference": "Al-Adab al-Mufrad, Hadith 112",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 50,
    "text": "Give the worker his wages before his sweat dries.",
    "reference": "Sunan Ibn Majah, Hadith 2443",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 51,
    "text": "Fear the supplication of the oppressed, for there is no barrier between it and Allah.",
    "reference": "Sahih al-Bukhari, Hadith 2448",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 52,
    "text": "Every bid'ah (innovation that contradicts the established Shariah and Sunnah) is misguidance.",
    "reference": "Sahih Muslim, Hadith 867",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 53,
    "text": "Adhere strictly to my Sunnah and the Sunnah of the Rightly Guided Caliphs (Khulafa-e-Rashideen).",
    "reference": "Sunan Abi Dawud, Hadith 4607",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 54,
    "text": "My Ummah will split into seventy-three sects, all of them in the Fire except one: the main body (Sawad al-A'zam/Ahl al-Sunnah).",
    "reference": "Sunan Ibn Majah, Hadith 3992",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 55,
    "text": "Hold fast to the largest group (Al-Jama'ah), and beware of division.",
    "reference": "Sunan al-Tirmidhi, Hadith 2167",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 56,
    "text": "Whoever initiates a good practice (Sunnah Hasanah) in Islam will have its reward and the reward of those who practice it.",
    "reference": "Sahih Muslim, Hadith 1017",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 57,
    "text": "The scholars are the true spiritual heirs of the Prophets.",
    "reference": "Sunan Abi Dawud, Hadith 3641",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 58,
    "text": "My household (Ahl al-Bayt) is like the Ark of Nuh; whoever boards it is saved, and whoever stays behind is drowned.",
    "reference": "Al-Mustadrak al-Hakim, Hadith 3312",
    "grading": "Hasan (Good)"
  },
  {
    "id": 59,
    "text": "All of my Sahaba are upright and trustworthy; follow them to be guided.",
    "reference": "Mishkat al-Masabih, Hadith 6018",
    "grading": "Sunni Consensus Reference"
  },
  {
    "id": 60,
    "text": "When you see those who insult my companions, say: 'May Allah's curse be upon your evil.'",
    "reference": "Sunan al-Tirmidhi, Hadith 3866",
    "grading": "Hasan (Good)"
  },
  {
    "id": 61,
    "text": "Whoever loves al-Hasan and al-Hussein has loved me, and whoever hates them has hated me.",
    "reference": "Sunan Ibn Majah, Hadith 143",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 62,
    "text": "Whoever sends one blessing upon me, Allah sends ten blessings upon him.",
    "reference": "Sahih Muslim, Hadith 408",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 63,
    "text": "The miser is the one in whose presence I am mentioned and he does not send blessings (Durood) upon me.",
    "reference": "Sunan al-Tirmidhi, Hadith 3546",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 64,
    "text": "The Prophets of Allah are alive in their graves, performing prayers.",
    "reference": "Musnad al-Bazzar, Hadith 6888",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 65,
    "text": "The first thing for which a servant will be judged on the Day of Resurrection is his prayer (Salah).",
    "reference": "Sunan al-Tirmidhi, Hadith 413",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 66,
    "text": "Fasting is a shield from the Hellfire.",
    "reference": "Sahih al-Bukhari, Hadith 1894",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 67,
    "text": "Sadaqah (charity) extinguishes sin just as water extinguishes fire.",
    "reference": "Sunan al-Tirmidhi, Hadith 2616",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 68,
    "text": "Whoever fasts Ramadan out of sincere faith and hoping for reward, his past sins will be forgiven.",
    "reference": "Sahih al-Bukhari, Hadith 1901",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 69,
    "text": "Perform Umrah in Ramadan, for indeed Umrah in Ramadan is equal to performing Hajj with me.",
    "reference": "Sahih al-Bukhari, Hadith 1782",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 70,
    "text": "The key to Paradise is prayer, and the key to prayer is purification (wudu).",
    "reference": "Sunan al-Tirmidhi, Hadith 4",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 71,
    "text": "If a Muslim plants a tree or sows seeds, and then a bird, a person or an animal eats from it, it is a charitable gift.",
    "reference": "Sahih al-Bukhari, Hadith 2320",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 72,
    "text": "The believer is simple and noble, while the wicked person is deceitful and ignoble.",
    "reference": "Sunan Abi Dawud, Hadith 4790",
    "grading": "Hasan (Good)"
  },
  {
    "id": 73,
    "text": "A believer does not get stung from the same hole twice.",
    "reference": "Sahih al-Bukhari, Hadith 6133",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 74,
    "text": "Part of the perfection of one's Islam is his leaving that which does not concern him.",
    "reference": "Sunan al-Tirmidhi, Hadith 2317",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 75,
    "text": "Be mindful of Allah and He will protect you; be mindful of Allah and you will find Him in front of you.",
    "reference": "Sunan al-Tirmidhi, Hadith 2516",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 76,
    "text": "If you ask, ask Allah; and if you seek help, seek help from Allah.",
    "reference": "Sunan al-Tirmidhi, Hadith 2516",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 77,
    "text": "Verily, what is permissible is clear and what is impermissible is clear, and between them are doubtful matters.",
    "reference": "Sahih al-Bukhari, Hadith 52",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 78,
    "text": "Richness does not lie in abundance of worldly goods, but true richness is the richness of the soul (contentment).",
    "reference": "Sahih al-Bukhari, Hadith 6446",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 79,
    "text": "The most hated of permissible things to Allah is divorce.",
    "reference": "Sunan Abi Dawud, Hadith 2178",
    "grading": "Hasan (Good)"
  },
  {
    "id": 80,
    "text": "Spread peace (Salam) among yourselves and you will love one another.",
    "reference": "Sahih Muslim, Hadith 54",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 81,
    "text": "The most beloved of people to Allah are those who are most useful to others.",
    "reference": "Al-Mu'jam al-Awsat, Hadith 6026",
    "grading": "Hasan (Good)"
  },
  {
    "id": 82,
    "text": "Guard your tongue, let your house suffice you, and weep over your sins.",
    "reference": "Sunan al-Tirmidhi, Hadith 2406",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 83,
    "text": "The world is sweet and green, and verily Allah has made you trustees in it to see how you behave.",
    "reference": "Sahih Muslim, Hadith 2742",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 84,
    "text": "Whoever hides the faults of a Muslim in this world, Allah will hide his faults in this world and the Hereafter.",
    "reference": "Sahih Muslim, Hadith 2699",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 85,
    "text": "Fulfill the trust of those who co-operated with you, and do not betray those who betray you.",
    "reference": "Sunan Abi Dawud, Hadith 3535",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 86,
    "text": "The curse of Allah is upon the one who gives a bribe and the one who takes it.",
    "reference": "Sunan al-Tirmidhi, Hadith 1337",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 87,
    "text": "No father can give his child anything better than teaching them good manners and etiquette (Adab).",
    "reference": "Sunan al-Tirmidhi, Hadith 1952",
    "grading": "Hasan (Good)"
  },
  {
    "id": 88,
    "text": "A Muslim is a brother of another Muslim; he does not oppress him, nor does he hand him over to an oppressor.",
    "reference": "Sahih al-Bukhari, Hadith 2442",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 89,
    "text": "Verily, Allah has recorded the good deeds and the evil deeds, then He clarified them.",
    "reference": "Sahih al-Bukhari, Hadith 6491",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 90,
    "text": "Allah is beautiful and He loves beauty.",
    "reference": "Sahih Muslim, Hadith 91",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 91,
    "text": "Whosoever believes in Allah and the Last Day, let him maintain good relations with his family.",
    "reference": "Sahih al-Bukhari, Hadith 6138",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 92,
    "text": "Avoid suspicious matters, for suspicion is the worst of lies.",
    "reference": "Sahih al-Bukhari, Hadith 5144",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 93,
    "text": "Do not search for the faults of others, and do not spy on each other.",
    "reference": "Sahih Muslim, Hadith 2563",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 94,
    "text": "Keep close to the large group of Muslims, and avoid breaking away.",
    "reference": "Sunan Ibn Majah, Hadith 3950",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 95,
    "text": "Adhere to the Sunnah, and avoid dividing into sectarian innovations.",
    "reference": "Sunan al-Tirmidhi, Hadith 2167",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 96,
    "text": "The best companion in the sight of Allah is the one who is best to his companion.",
    "reference": "Sunan al-Tirmidhi, Hadith 1944",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 97,
    "text": "A believer is friendly and easygoing; there is no good in one who is not friendly and whom others do not find friendly.",
    "reference": "Musnad Ahmad, Hadith 9116",
    "grading": "Hasan (Good)"
  },
  {
    "id": 98,
    "text": "Whoever is deprived of gentleness is deprived of all goodness.",
    "reference": "Sahih Muslim, Hadith 2592",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 99,
    "text": "Look at those who have less than you, and do not look at those who have more, so that you do not discount Allah's blessings.",
    "reference": "Sahih Muslim, Hadith 2963",
    "grading": "Sahih (Authentic)"
  },
  {
    "id": 100,
    "text": "Perform prayers (Salah) in congregation, for the wolf devours only the stray sheep.",
    "reference": "Sunan Abi Dawud, Hadith 547",
    "grading": "Sahih (Authentic)"
  }
];

export const SUNNAHS: SunnahEntry[] = [
  {
    "id": 1,
    "title": "Using the Miswak",
    "detail": "The Holy Prophet ﷺ held the Miswak in His noble right hand (pinky underneath, thumb under the head, other three fingers on top). He brushed His blessed teeth horizontally three times, starting from the upper right, then upper left, lower right, lower left, and brushed His tongue, saying it purifies the mouth and pleases Allah.",
    "reference": "Bahar-e-Shariat / Sahih al-Bukhari"
  },
  {
    "id": 2,
    "title": "Drinking Water Sitting Down",
    "detail": "The Holy Prophet ﷺ always sat down to drink water, holding the cup in His noble right hand. He looked inside it first, said 'Bismillah', and drank in three separate sips, breathing outside the vessel between sips, and said 'Alhamdulillah' at the end.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 3,
    "title": "Sleeping on the Right Side",
    "detail": "The Holy Prophet ﷺ performed wudu before sleeping. He laid on His noble right side facing the Qibla, placing His blessed right hand under His cheek, reciting Ayat al-Kursi, the Mu'awwidhatayn (last two Surahs), blowing into His palms, and wiping His body.",
    "reference": "Bahar-e-Shariat / Sunan Abi Dawud"
  },
  {
    "id": 4,
    "title": "Entering the Masjid",
    "detail": "The Holy Prophet ﷺ entered the mosque stepping first with His noble right foot, and supplicated: 'Bismillah, was-salatu was-salamu 'ala Rasulillah. Allahumma-ftah li abwaba rahmatik' (O Allah, open for me the doors of Your mercy).",
    "reference": "Bahar-e-Shariat / Sahih Muslim"
  },
  {
    "id": 5,
    "title": "Leaving the Masjid",
    "detail": "The Holy Prophet ﷺ left the mosque stepping first with His left foot, and supplicated: 'Bismillah, was-salatu was-salamu 'ala Rasulillah. Allahumma inni as'aluka min fadlik' (O Allah, I ask You from Your bounty).",
    "reference": "Bahar-e-Shariat / Sahih Muslim"
  },
  {
    "id": 6,
    "title": "Eating with the Right Hand",
    "detail": "The Holy Prophet ﷺ sat on His knees or with the right leg upright, eating with His three noble fingers (thumb, index, middle). He ate what was closest to Him, took small sips/bites, and licked His fingers clean before washing.",
    "reference": "Bahar-e-Shariat / Sahih al-Bukhari"
  },
  {
    "id": 7,
    "title": "Greeting with Salam",
    "detail": "The Holy Prophet ﷺ always initiated Salam when meeting anyone, saying 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh' before speaking. He shook hands using both of His noble hands with warmth.",
    "reference": "Bahar-e-Shariat / Sunan al-Tirmidhi"
  },
  {
    "id": 8,
    "title": "Applying Itr (Perfume)",
    "detail": "The Holy Prophet ﷺ loved pleasant scents and used non-alcoholic perfume (Itr) regularly. He kept His hair and beard oiled and combed, and never refused perfume when offered.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 9,
    "title": "Wearing Shoes Right First",
    "detail": "The Holy Prophet ﷺ wore His right shoe first, then the left. When taking them off, He removed the left shoe first, then the right, saying that the right should be honored first.",
    "reference": "Bahar-e-Shariat / Sahih al-Bukhari"
  },
  {
    "id": 10,
    "title": "Trimming Nails on Friday",
    "detail": "The Holy Prophet ﷺ clipped His fingernails on Friday, starting with the index finger of the right hand to the pinky, then the thumb, and on the left hand from the pinky to the thumb, followed by washing.",
    "reference": "Bahar-e-Shariat / Sunan al-Kubra"
  },
  {
    "id": 11,
    "title": "Sleeping and Waking Supplications",
    "detail": "The Holy Prophet ﷺ supplicated before sleep: 'Bismika Allahumma amutu wa ahya'. Upon waking, He sat up, rubbed His face with His hands to remove sleep, and praised Allah: 'Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur'.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 12,
    "title": "Dusting the Bed",
    "detail": "The Holy Prophet ﷺ dusted His bed three times with the corner of a cloth while reciting Bismillah before lying down, ensuring that no dust, insects, or impurities were on it.",
    "reference": "Sahih al-Bukhari / Sunan al-Tirmidhi"
  },
  {
    "id": 13,
    "title": "Looking in the Mirror",
    "detail": "The Holy Prophet ﷺ looked in the mirror, combed His hair, and supplicated: 'Allahumma anta hassanta khalqi fa hassin khuluqi' (O Allah, as You made my body beautiful, make my character beautiful).",
    "reference": "Musnad Ahmad / Bahar-e-Shariat"
  },
  {
    "id": 14,
    "title": "Sitting in Tashahhud Position",
    "detail": "The Holy Prophet ﷺ sat in Tashahhud by laying His left foot flat and sitting on it, while keeping His right foot upright with the toes pointing towards the Qibla, placing His hands on His thighs.",
    "reference": "Sahih al-Bukhari / Fatawa Razawiyyah"
  },
  {
    "id": 15,
    "title": "Moderation in Water during Wudu",
    "detail": "The Holy Prophet ﷺ used water sparingly during wudu, completing it with about one mudd of water (approx. 650ml), and forbade wasting water even if at a flowing river.",
    "reference": "Sunan Ibn Majah / Bahar-e-Shariat"
  },
  {
    "id": 16,
    "title": "Etiquette of Sneezing",
    "detail": "The Holy Prophet ﷺ covered His blessed face with His hands or a cloth while sneezing to suppress the sound. He said 'Alhamdulillah', expecting the listener to say 'Yarhamukallah'.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 17,
    "title": "Etiquette of Yawning",
    "detail": "The Holy Prophet ﷺ suppressed yawning as much as possible, teaching that it is from Satan, and placed the back of His noble left hand over His mouth if unable to suppress it.",
    "reference": "Sahih Muslim / Bahar-e-Shariat"
  },
  {
    "id": 18,
    "title": "combing and Oiling Hair",
    "detail": "The Holy Prophet ﷺ oiled and combed His blessed hair and beard regularly. He kept a mirror, comb, and oil flask in His travel bag, starting combing from the right side.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 19,
    "title": "Etiquette of Walking",
    "detail": "The Holy Prophet ﷺ walked with a firm, energetic step, lifting His feet fully and leaning slightly forward as if walking down a slope. He walked with modesty, never dragging His feet.",
    "reference": "Shamail-e-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 20,
    "title": "Speaking Clearly and Smiling",
    "detail": "The Holy Prophet ﷺ spoke slowly and clearly, repeating key phrases three times so listeners could easily understand and memorize. He was always pleasant and smiled at companions.",
    "reference": "Shamail-e-Tirmidhi / Sahih al-Bukhari"
  },
  {
    "id": 21,
    "title": "Visiting the Sick",
    "detail": "The Holy Prophet ﷺ visited sick companions, sat near their head, placed His noble hand on their forehead to comfort them, and prayed: 'La ba'sa tahurun in sha Allah' (No harm, a purification).",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 22,
    "title": "Wearing Clothes Right Side First",
    "detail": "The Holy Prophet ﷺ put on His clothes starting with the right sleeve of His shirt or right leg of His trousers. When undressing, He removed the left side first, reciting Bismillah.",
    "reference": "Bahar-e-Shariat / Sunan al-Tirmidhi"
  },
  {
    "id": 23,
    "title": "Sunnah of Tahajjud",
    "detail": "The Holy Prophet ﷺ woke in the final third of the night, used the miswak, performed wudu, and offered 8 units of Tahajjud prayer, followed by Witr, praying until His feet swelled out of love.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 24,
    "title": "Midday Qailulah (Siesta)",
    "detail": "The Holy Prophet ﷺ took a short midday nap (Qailulah) before or after Dhuhr prayer (and before Jumu'ah on Fridays), saying it gives strength for night worship (Tahajjud).",
    "reference": "Sahih Muslim / Bahar-e-Shariat"
  },
  {
    "id": 25,
    "title": "Fasting on White Days",
    "detail": "The Holy Prophet ﷺ regularly fasted on the 13th, 14th, and 15th days of every lunar Islamic month (Ayyam al-Beed), describing it as fasting the entire year in reward.",
    "reference": "Sunan al-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 26,
    "title": "Fasting on Mondays and Thursdays",
    "detail": "The Holy Prophet ﷺ fasted on Mondays and Thursdays, saying: 'Actions are presented to Allah on these days, and I love that my deeds are presented while I am fasting.'",
    "reference": "Sunan al-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 27,
    "title": "Etiquette of Sitting",
    "detail": "The Holy Prophet ﷺ sat cross-legged, on His knees, or with knees pulled up (Qurfat). He forbade sitting while leaning on the left hand behind the back, calling it a cursed posture.",
    "reference": "Sunan Abi Dawud / Shamail-e-Tirmidhi"
  },
  {
    "id": 28,
    "title": "composing Anger",
    "detail": "The Holy Prophet ﷺ taught that if anger strikes, one should remain silent. If standing, sit down; if sitting, lie down. Perform wudu since anger is from fire and water cools it.",
    "reference": "Musnad Ahmad / Sunan Abi Dawud"
  },
  {
    "id": 29,
    "title": "Rinsing Mouth after Milk",
    "detail": "The Holy Prophet ﷺ drank milk and then rinsed His blessed mouth with water, saying: 'Indeed, it contains fat/grease.' He prayed for blessings and increase upon drinking it.",
    "reference": "Sahih al-Bukhari / Sahih Muslim"
  },
  {
    "id": 30,
    "title": "Sunnah of Combing the Beard",
    "detail": "The Holy Prophet ﷺ combed His blessed beard, applying oil and water to keep it neat. He combed it first from the neck upwards under the chin, then combed it downwards from the top.",
    "reference": "Shamail-e-Tirmidhi / Fatawa Razawiyyah"
  },
  {
    "id": 31,
    "title": "Serving Others First",
    "detail": "The Holy Prophet ﷺ served water or milk starting from the right side. He taught: 'The one who serves the drink should be the last of them to drink.'",
    "reference": "Sunan al-Tirmidhi / Bahar-e-Shariat"
  },
  {
    "id": 32,
    "title": "Greeting Children with Salam",
    "detail": "The Holy Prophet ﷺ initiated Salam to children whenever He passed them. He patted their heads, stroked their cheeks with His fragrant hands, and made supplications for them.",
    "reference": "Sahih al-Bukhari / Sahih Muslim"
  },
  {
    "id": 33,
    "title": "Honoring the Neighbor",
    "detail": "The Holy Prophet ﷺ was extremely kind to His neighbors, advising Sahaba to make extra soup broth to share. He said Jibril repeatedly emphasized neighbors' rights.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 34,
    "title": "Moderation in Eating",
    "detail": "The Holy Prophet ﷺ ate with moderation, leaving one-third of His stomach for food, one-third for drink, and one-third for air. He never criticized any food served.",
    "reference": "Sunan al-Tirmidhi / Sahih al-Bukhari"
  },
  {
    "id": 35,
    "title": "Supplicating in Absence",
    "detail": "The Holy Prophet ﷺ taught that praying for a brother in their absence is answered quickly, and an angel stands by saying: 'Ameen, and may you receive the same.'",
    "reference": "Sahih Muslim / Bahar-e-Shariat"
  },
  {
    "id": 36,
    "title": "Sunnah of Istikharah",
    "detail": "The Holy Prophet ﷺ taught the Sahaba the prayer and supplication of Istikharah for all decisions, just as He taught them a Surah of the Quran, seeking Allah's guidance.",
    "reference": "Sahih al-Bukhari / Bahar-e-Shariat"
  },
  {
    "id": 37,
    "title": "Surah Al-Kahf on Friday",
    "detail": "The Holy Prophet ﷺ recommended reciting Surah Al-Kahf on Friday (or Thursday night), stating it creates a guiding light for the reader that lasts until the next Friday.",
    "reference": "Sunan al-Darimi / Bahar-e-Shariat"
  },
  {
    "id": 38,
    "title": "Dua before Meals",
    "detail": "The Holy Prophet ﷺ always said Bismillah before eating. He taught: 'If one forgets, say: Bismillahi awwalahu wa akhirahu (In the name of Allah at its beginning and end).'",
    "reference": "Sunan Abi Dawud / Bahar-e-Shariat"
  },
  {
    "id": 39,
    "title": "Shaking Hands with Both Hands",
    "detail": "The Holy Prophet ﷺ shook hands using both of His hands when greeting a Muslim. He did not withdraw His noble hand until the other person withdrew theirs first.",
    "reference": "Bahar-e-Shariat / Sunan al-Tirmidhi"
  },
  {
    "id": 40,
    "title": "Speaking Truth with Gentleness",
    "detail": "The Holy Prophet ﷺ spoke only truth, even in jest, and was known as Al-Sadiq. He spoke with soft gentleness, saying: 'Gentleness beautifies everything and harshness ruins it.'",
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
    "topic": "The Conquest of Mecca (8 AH)",
    "fact": "The Prophet ﷺ led 10,000 companions into Mecca in a bloodless conquest, showcasing unprecedented forgiveness by granting general amnesty to all former enemies.",
    "reference": "Al-Waqidi / Al-Bidayah wan-Nihayah"
  },
  {
    "id": 12,
    "topic": "The Caliphate of Abu Bakr (11-13 AH)",
    "fact": "Following the Prophet's passing, Hazrat Abu Bakr (R.A.) stabilized the Islamic state, preserved unity, and commissioned the first compilation of the Quran.",
    "reference": "Tarikh al-Khulafa / Al-Suyuti"
  },
  {
    "id": 13,
    "topic": "The Liberation of Jerusalem (16 AH)",
    "fact": "Under the Caliphate of Hazrat Umar Al-Farooq (R.A.), Jerusalem surrendered peacefully. Umar entered in humility and signed the 'Covenant of Umar' protecting non-Muslims.",
    "reference": "Tarikh al-Tabari"
  },
  {
    "id": 14,
    "topic": "Standardization of the Quranic Script (c. 30 AH)",
    "fact": "Caliph Hazrat Uthman ibn Affan (R.A.) ordered standard copies of the Quran to be compiled based on the dialect of Quraysh and distributed to all major provinces.",
    "reference": "Sahih al-Bukhari / Fath al-Bari"
  },
  {
    "id": 15,
    "topic": "The Battle of Tours (114 AH)",
    "fact": "Islamic forces reached their furthest point in Western Europe at the Battle of Tours/Poitiers under Abdul Rahman Al-Ghafiqi, securing the border of Islamic Spain.",
    "reference": "Nafh al-Tib / Al-Maqqari"
  },
  {
    "id": 16,
    "topic": "The Golden Age of Al-Andalus (Spain)",
    "fact": "Muslim Spain became a center of European education, science, and tolerance, with cities like Cordoba boasting street lighting, running water, and massive libraries.",
    "reference": "The Moors in Spain / Stanley Lane-Poole"
  },
  {
    "id": 17,
    "topic": "The House of Wisdom in Baghdad (2nd-3rd Century AH)",
    "fact": "The Abbasid Caliph Al-Ma'mun established 'Bayt al-Hikma', a major translation center and library that preserved global science and advanced algebra and astronomy.",
    "reference": "Tarikh al-Baghdad"
  },
  {
    "id": 18,
    "topic": "Imam Malik and the Muwatta",
    "fact": "Imam Malik ibn Anas compiled 'Al-Muwatta' in Medina, which is one of the earliest and most authentic collections of Hadith and legal opinions.",
    "reference": "Introduction to Muwatta"
  },
  {
    "id": 19,
    "topic": "Imam Al-Shafi'i and the Risalah",
    "fact": "Imam Muhammad ibn Idris al-Shafi'i authored 'Al-Risalah', establishing the formal system of Islamic jurisprudence and scriptural sources (Usul al-Fiqh).",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 20,
    "topic": "Imam Ahmad ibn Hanbal and the Musnad",
    "fact": "Imam Ahmad compiled over 27,000 hadiths in his 'Musnad' and stood firm during the Inquisition (Mihnah), defending the orthodox Sunni creed.",
    "reference": "Manaqib al-Imam Ahmad / Ibn al-Jawzi"
  },
  {
    "id": 21,
    "topic": "The Compilation of Sahih Muslim",
    "fact": "Imam Muslim ibn al-Hajjaj compiled his Sahih, consisting of 7,500 authentic hadiths, regarded alongside Sahih al-Bukhari as the core of Hadith literature.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 22,
    "topic": "The Establishment of Al-Qarawiyyin (245 AH)",
    "fact": "Fatima al-Fihri, a wealthy Muslim woman, founded Al-Qarawiyyin in Fez, Morocco, recognized as the world's oldest continuously operating university.",
    "reference": "Tarikh Ibn Khaldun"
  },
  {
    "id": 23,
    "topic": "Imam Al-Ash'ari and Sunni Creed",
    "fact": "Imam Abu al-Hasan al-Ash'ari (d. 324 AH) codified traditional Sunni theology, refuting deviant philosophical ideas and stabilizing the Sunni consensus.",
    "reference": "Tabyin Kadhib al-Muftari / Ibn Asakir"
  },
  {
    "id": 24,
    "topic": "Imam Al-Maturidi and Sunni Creed",
    "fact": "Imam Abu Mansur al-Maturidi (d. 333 AH) formulated the Maturidi school of creed in Central Asia, forming the theological backbone of traditional Sunni Muslims.",
    "reference": "Tarikh al-Maturidiyyah"
  },
  {
    "id": 25,
    "topic": "Al-Biruni and Geodesy (4th Century AH)",
    "fact": "Muslim polymath Abu Rayhan al-Biruni calculated the Earth's radius using trigonometry at Nandana fort (modern Pakistan) with astonishing accuracy.",
    "reference": "Tarikh al-Hukama"
  },
  {
    "id": 26,
    "topic": "Ibn Sina and the Canon of Medicine",
    "fact": "Ibn Sina (Avicenna) wrote the 'Canon of Medicine' (Al-Qanun fi al-Tibb), which remained the standard medical textbook in Europe and Islamic lands for centuries.",
    "reference": "History of Islamic Medicine"
  },
  {
    "id": 27,
    "topic": "Al-Khwarizmi and Algebra (3rd Century AH)",
    "fact": "Muhammad ibn Musa al-Khwarizmi wrote 'Kitab al-Jabr', introducing algebra to the world. The word 'algorithm' is derived from his name.",
    "reference": "Introduction to Algebra / Al-Khwarizmi"
  },
  {
    "id": 28,
    "topic": "Imam Al-Ghazali and the Ihya (5th Century AH)",
    "fact": "Imam Al-Ghazali, known as Hujjat al-Islam, wrote 'Ihya Ulum al-Din' in Jerusalem and Damascus, reviving the spiritual dimension of Sunni Islam.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 29,
    "topic": "The Battle of Manzikert (463 AH)",
    "fact": "Sultan Alp Arslan led the Seljuk Turks to a historic victory over the Byzantine Empire, opening Anatolia to Islamic settlement and Turkish culture.",
    "reference": "Al-Kamil fi al-Tarikh"
  },
  {
    "id": 30,
    "topic": "The Liberation of Jerusalem by Salahuddin (583 AH)",
    "fact": "Sultan Salahuddin Ayyubi liberated Jerusalem from the Crusaders on the night of Me'raj. He treated Christian residents with exceptional mercy and kindness.",
    "reference": "Al-Rawdatayn / Abu Shama"
  },
  {
    "id": 31,
    "topic": "Sheikh Abdul Qadir al-Jilani (d. 561 AH)",
    "fact": "Known as Ghaus-e-Azam, he founded the Qadiriyyah Sufi order in Baghdad, combining outer Shariah scholarship with inner spiritual purification.",
    "reference": "Qala'id al-Jawahir"
  },
  {
    "id": 32,
    "topic": "The Rise of the Ottoman Caliphate (c. 1299 CE)",
    "fact": "Founded by Osman I, the Ottoman State grew into the largest Sunni caliphate, acting as the guardian of the holy sanctuaries of Mecca and Medina.",
    "reference": "Tarikh al-Dawlah al-Aliyyah"
  },
  {
    "id": 33,
    "topic": "Mawlana Rumi and the Masnavi (d. 672 AH)",
    "fact": "Mawlana Jalaluddin Rumi wrote the 'Masnavi' in Konya, providing deep spiritual guidance and promoting the love of Allah and the Prophet ﷺ.",
    "reference": "Wafayat al-A'yan"
  },
  {
    "id": 34,
    "topic": "The Battle of Ain Jalut (658 AH)",
    "fact": "The Mamluk Sultan Qutuz and General Baibars defeated the seemingly unstoppable Mongol forces in Palestine, saving Egypt and Damascus from destruction.",
    "reference": "Al-Suluk / Al-Maqrizi"
  },
  {
    "id": 35,
    "topic": "The Conquest of Constantinople (857 AH)",
    "fact": "Sultan Mehmed II (Fatih) opened Constantinople, ending the Byzantine Empire. He renamed the city Islam-bol (full of Islam, later Istanbul).",
    "reference": "Tarikh-e-Fatih / Tursun Beg"
  },
  {
    "id": 36,
    "topic": "The Peak of the Ottoman Empire under Suleiman",
    "fact": "Sultan Suleiman the Magnificent established unified legal and administrative systems throughout the empire, patronizing high architecture and arts.",
    "reference": "Ottoman State History"
  },
  {
    "id": 37,
    "topic": "Sheikh Ahmad Sirhindi, the Mujtahid (d. 1034 AH)",
    "fact": "Known as Mujaddid Alif Thani, he successfully opposed Akbar's syncretic court religion in Mughal India, protecting Sunni orthodoxy.",
    "reference": "Maktubat-e-Imam-e-Rabbani"
  },
  {
    "id": 38,
    "topic": "The Compilation of Fatawa Hindiyyah (Alamgiri)",
    "fact": "Mughal Emperor Aurangzeb commissioned a panel of 500 scholars led by Sheikh Nizamuddin to write a comprehensive law book of Hanafi Fiqh.",
    "reference": "Fatawa Hindiyyah Introduction"
  },
  {
    "id": 39,
    "topic": "Reign of Sultan Abdul Hamid II (1876-1909 CE)",
    "fact": "The Ottoman Sultan strongly opposed selling land in Palestine to Zionists and constructed the Hijaz Railway connecting Damascus to Medina.",
    "reference": "Ottoman Archives / Sultan's Diary"
  },
  {
    "id": 40,
    "topic": "Imam Ahmad Raza Khan Barelvi (d. 1340 AH)",
    "fact": "Ala Hazrat Imam Ahmad Raza Khan revived traditional Sunni Islam in South Asia, defending the elevated status of the Prophet ﷺ against modernists.",
    "reference": "Hayat-e-A'la Hazrat"
  },
  {
    "id": 41,
    "topic": "The Battle of Uhud (3 AH)",
    "fact": "A key battle in early Islam testing the discipline of archers at Mount Uhud, resulting in the martyrdom of Hamza, the Prophet's beloved uncle.",
    "reference": "Tarikh al-Islam / Ibn Hisham"
  },
  {
    "id": 42,
    "topic": "The Battle of the Trench (5 AH)",
    "fact": "Medina was defended from a 10,000-strong confederate siege by digging a deep trench, a strategy suggested by the Persian companion Salman al-Farsi.",
    "reference": "Tarikh al-Tabari"
  },
  {
    "id": 43,
    "topic": "The Treaty of Hudaybiyyah (6 AH)",
    "fact": "A peace treaty signed between Muslims and the Quraysh, allowing Muslims to perform Hajj the following year and enabling peaceful propagation.",
    "reference": "Sahih al-Bukhari"
  },
  {
    "id": 44,
    "topic": "The Battle of Khaibar (7 AH)",
    "fact": "Muslims overcame heavily fortified oases in Khaibar, leading to a peace treaty. Hazrat Ali (R.A.) was given the standard and breached the gates.",
    "reference": "Sahih Muslim / Al-Tabari"
  },
  {
    "id": 45,
    "topic": "The Battle of Yarmouk (15 AH)",
    "fact": "A major clash between the Rashidun Caliphate and the Byzantine Empire, resulting in a decisive Muslim victory and securing the region of Syria.",
    "reference": "Al-Bidayah wan-Nihayah"
  },
  {
    "id": 46,
    "topic": "The Battle of Qadisiyyah (15 AH)",
    "fact": "Led by Sa'd ibn Abi Waqqas (R.A.), Rashidun forces defeated the Sasanian Persian army, marking the end of Sasanian hegemony in Iraq.",
    "reference": "Al-Kamil fi al-Tarikh"
  },
  {
    "id": 47,
    "topic": "First Compilation of Quran (12 AH)",
    "fact": "After the Battle of Yamama, Zayd ibn Thabit (R.A.) was tasked by Caliph Abu Bakr (R.A.) to gather Quranic verses into a single master manuscript.",
    "reference": "Sahih al-Bukhari"
  },
  {
    "id": 48,
    "topic": "The Conquest of Egypt (20 AH)",
    "fact": "Hazrat Amr ibn al-Aas (R.A.) opened Egypt to Islam, founding the city of Fustat (modern Cairo) and establishing justice and religious liberty.",
    "reference": "Tarikh al-Tabari"
  },
  {
    "id": 49,
    "topic": "Establishment of the First Muslim Navy",
    "fact": "Under Caliph Hazrat Uthman (R.A.), the governor of Syria Muawiyah ibn Abi Sufyan built the first Islamic naval fleet to secure Mediterranean borders.",
    "reference": "Al-Bidayah wan-Nihayah"
  },
  {
    "id": 50,
    "topic": "Moving the Capital to Kufa (36 AH)",
    "fact": "Hazrat Ali ibn Abi Talib (R.A.) shifted the administrative capital of the Caliphate from Medina to Kufa due to its strategic central location.",
    "reference": "Tarikh al-Tabari"
  },
  {
    "id": 51,
    "topic": "Battle of Badr (2 AH)",
    "fact": "The first major military battle of Islam where 313 Sahaba defeated a large army of Quraysh through divine assistance and the Prophet's prayers.",
    "reference": "Tarikh al-Islam / Ibn Hisham"
  },
  {
    "id": 52,
    "topic": "Battle of Uhud (3 AH)",
    "fact": "Tested the discipline of the archers and highlighted the immense sacrifice of Hamza, the uncle of the Prophet.",
    "reference": "Tarikh al-Islam / Ibn Kathir"
  },
  {
    "id": 53,
    "topic": "Battle of the Trench (5 AH)",
    "fact": "Known as Al-Ahzab, where Salman al-Farsi suggested digging a trench around Medina to ward off invaders.",
    "reference": "Tarikh al-Islam / Ibn Hisham"
  },
  {
    "id": 54,
    "topic": "Treaty of Hudaybiyyah (6 AH)",
    "fact": "A peaceful treaty signed between Muslims and Quraysh, described by the Quran as a clear victory (Fath al-Mubin).",
    "reference": "Sahih al-Bukhari / Ibn Kathir"
  },
  {
    "id": 55,
    "topic": "Conquest of Mecca (8 AH)",
    "fact": "The Prophet ﷺ entered Mecca peacefully, broke the idols in the Kaaba, and forgave the citizens.",
    "reference": "Tarikh al-Islam / Ibn Kathir"
  },
  {
    "id": 56,
    "topic": "Battle of Tabuk (9 AH)",
    "fact": "The largest expedition led by the Prophet ﷺ, testing the charity and sincerity of the companions.",
    "reference": "Tarikh al-Islam / Siyar A'lam al-Nubala"
  },
  {
    "id": 57,
    "topic": "Ghadir Khumm (10 AH)",
    "fact": "The Prophet ﷺ declared his love and spiritual custody of Imam Ali, saying: 'Of whomsoever I am master, Ali is his master.'",
    "reference": "Musnad Ahmad / Sunan al-Tirmidhi"
  },
  {
    "id": 58,
    "topic": "Demise of the Prophet ﷺ (11 AH)",
    "fact": "The passing of the Mercy to the Worlds, marking the completion of direct divine revelation.",
    "reference": "Tarikh al-Islam / Ibn Kathir"
  },
  {
    "id": 59,
    "topic": "Caliphate of Abu Bakr Al-Siddiq (11-13 AH)",
    "fact": "Stabilized the state, fought the apostasy wars, and initiated the compilation of the Quran.",
    "reference": "Tarikh al-Khulafa / Al-Suyuti"
  },
  {
    "id": 60,
    "topic": "Caliphate of Umar ibn Al-Khattab (13-23 AH)",
    "fact": "Expanded the Islamic borders, captured Jerusalem, and established the Islamic calendar (Hijri).",
    "reference": "Tarikh al-Khulafa / Al-Suyuti"
  },
  {
    "id": 61,
    "topic": "Caliphate of Uthman ibn Affan (23-35 AH)",
    "fact": "Standardized the Quranic script (Mushaf Uthmani) and established the first Muslim navy.",
    "reference": "Tarikh al-Khulafa / Al-Suyuti"
  },
  {
    "id": 62,
    "topic": "Caliphate of Ali ibn Abi Talib (35-40 AH)",
    "fact": "Moved the capital to Kufa and governed with extreme justice during internal strife.",
    "reference": "Tarikh al-Khulafa / Al-Suyuti"
  },
  {
    "id": 63,
    "topic": "Martyrdom of Imam Hussein at Karbala (61 AH)",
    "fact": "The grandson of the Prophet ﷺ sacrificed his life to uphold the truth and reject tyranny.",
    "reference": "Tarikh al-Tabari / Siyar A'lam al-Nubala"
  },
  {
    "id": 64,
    "topic": "Compilation of Hadith by Imam Bukhari",
    "fact": "Curated over 600,000 hadiths to produce 'Sahih al-Bukhari', the most authentic book after the Quran.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 65,
    "topic": "Foundation of the Hanafi School of Jurisprudence",
    "fact": "Established by Imam Abu Hanifah (d. 150 AH), the pioneer of Islamic rational law.",
    "reference": "Manaqib Abi Hanifah / Al-Dhahabi"
  },
  {
    "id": 66,
    "topic": "Foundation of the Maliki School of Jurisprudence",
    "fact": "Established by Imam Malik ibn Anas (d. 179 AH), based on the practices of Medina.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 67,
    "topic": "Foundation of the Shafi'i School of Jurisprudence",
    "fact": "Established by Imam Muhammad al-Shafi'i (d. 204 AH), balancing textualism and analogy.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 68,
    "topic": "Foundation of the Hanbali School of Jurisprudence",
    "fact": "Established by Imam Ahmad ibn Hanbal (d. 241 AH), famous for his defense of the Quran.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 69,
    "topic": "Battle of Tours (114 AH)",
    "fact": "Led by Abdul Rahman Al-Ghafiqi, marking the northernmost advance of Islamic forces in Europe.",
    "reference": "Tarikh al-Islam / Al-Dhahabi"
  },
  {
    "id": 70,
    "topic": "Golden Age of Baghdad (c. 132-656 AH)",
    "fact": "The House of Wisdom (Bayt al-Hikma) became the center of science, mathematics, and philosophy.",
    "reference": "Tarikh al-Baghdad"
  },
  {
    "id": 71,
    "topic": "Al-Andalus Opening (92 AH / 711 CE)",
    "fact": "Tariq ibn Ziyad led the Muslim entry into the Iberian Peninsula, starting 800 years of brilliant Islamic culture, science, and governance in Spain.",
    "reference": "Nafh al-Tib / Al-Maqqari"
  },
  {
    "id": 72,
    "topic": "Foundation of Al-Azhar (361 AH)",
    "fact": "Al-Azhar University was established in Cairo, quickly growing into the premier center of Sunni Islamic theology and Arabic language in the world.",
    "reference": "Al-Khitat / Al-Maqrizi"
  },
  {
    "id": 73,
    "topic": "Battle of Manzikert (463 AH / 1071 CE)",
    "fact": "The Seljuk Sultan Alp Arslan defeated the Byzantine Army, securing Anatolia for Muslim settlements and laying the groundwork for Turkish Islamic history.",
    "reference": "Al-Kamil fi al-Tarikh"
  },
  {
    "id": 74,
    "topic": "Salahuddin Recovers Jerusalem (583 AH)",
    "fact": "Sultan Salahuddin Ayyubi recovered Jerusalem from Crusader control, choosing peace and mercy over vengeance by offering safety to all Christian residents.",
    "reference": "Al-Rawdatayn"
  },
  {
    "id": 75,
    "topic": "Rise of the Ottoman State (1299 CE)",
    "fact": "Osman I established the Ottoman principality in Anatolia, initiating a dynasty that would assume the Caliphate and protect Islamic borders for six centuries.",
    "reference": "Tarikh al-Dawlah al-Aliyyah"
  },
  {
    "id": 76,
    "topic": "Conquest of Constantinople (1453 CE)",
    "fact": "Sultan Mehmed II opened Constantinople, ending the Byzantine Empire and fulfilling the famous prophecy of the Prophet ﷺ: 'What a wonderful leader and army.'",
    "reference": "Ottoman Chronicles"
  },
  {
    "id": 77,
    "topic": "Imam Al-Ghazali's Revival of Spirit",
    "fact": "Imam Al-Ghazali reconciled rational philosophy, theology, and spiritual purification in 'Ihya Ulum al-Din', providing a comprehensive guide for Sunni practice.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 78,
    "topic": "Qadiriyyah Order Foundation (d. 561 AH)",
    "fact": "Sheikh Abdul Qadir al-Jilani established the Qadiriyyah order, teaching millions the path of heart purification, reliance on Allah, and charity.",
    "reference": "Qala'id al-Jawahir"
  },
  {
    "id": 79,
    "topic": "Rumi and the Masnavi (d. 672 AH)",
    "fact": "Mawlana Rumi wrote the 'Masnavi', expressing deep mystical love and teaching that the ultimate goal of the soul is divine proximity and love.",
    "reference": "Wafayat al-A'yan"
  },
  {
    "id": 80,
    "topic": "Mishkat al-Masabih Compilation (737 AH)",
    "fact": "Sheikh Wali al-Din al-Tabrizi completed 'Mishkat al-Masabih', collecting essential hadiths to guide everyday life and legal practices of Sunni Muslims.",
    "reference": "Mishkat Introduction"
  },
  {
    "id": 81,
    "topic": "Golden Age of Ottoman Laws",
    "fact": "Ottoman Sultan Suleiman the Lawgiver harmonized regional laws with the Shariah, fostering a state of order, architectural masterpieces, and justice.",
    "reference": "Ottoman History"
  },
  {
    "id": 82,
    "topic": "Ottoman Victory at Mohacs (1526 CE)",
    "fact": "Sultan Suleiman's forces achieved a decisive victory at Mohacs, establishing Ottoman administrative presence in Central Europe for over 150 years.",
    "reference": "Ottoman Chronicles"
  },
  {
    "id": 83,
    "topic": "Sheikh Ahmad Sirhindi's Stand (d. 1034 AH)",
    "fact": "Known as Mujaddid Alif Thani, he successfully refuted the syncretic 'Din-i Ilahi' court religion, saving Orthodox Sunni creed in Mughal India.",
    "reference": "Maktubat-e-Imam-e-Rabbani"
  },
  {
    "id": 84,
    "topic": "Mughal Architectural Peak: Taj Mahal",
    "fact": "Shah Jahan constructed the Taj Mahal in memory of Mumtaz Mahal, standing as a globally recognized peak of Islamic symmetry, architecture, and calligraphy.",
    "reference": "Tarikh-e-Hindustan"
  },
  {
    "id": 85,
    "topic": "Compilation of Fatawa Alamgiri",
    "fact": "Aurangzeb Alamgir gathered top Sunni jurists to compile 'Fatawa Alamgiri', a massive, highly organized encyclopedia of Hanafi Fiqh.",
    "reference": "Fatawa Hindiyyah"
  },
  {
    "id": 86,
    "topic": "Sultan Abdul Hamid II defends Hijaz",
    "fact": "Sultan Abdul Hamid II financed and constructed the Hijaz Railway, connecting Damascus to Medina to secure the pilgrims' path and the holy sanctuaries.",
    "reference": "Ottoman State Archives"
  },
  {
    "id": 87,
    "topic": "Spread of silent Dhikr (Naqshbandiyyah)",
    "fact": "The Naqshbandi Sufi order spread widely, emphasizing silent Dhikr, strict adherence to Shariah, and preservation of spiritual lineages.",
    "reference": "Al-Hada'iq al-Wardiyyah"
  },
  {
    "id": 88,
    "topic": "Sunni Revival by Ala Hazrat (d. 1921 CE)",
    "fact": "Imam Ahmad Raza Khan wrote 'Fatawa Ridawiyyah' in 30 volumes, defending classical Sunni beliefs and the absolute honor of the Prophet ﷺ.",
    "reference": "Hayat-e-A'la Hazrat"
  },
  {
    "id": 89,
    "topic": "Kanzul Iman Quran Translation (1911 CE)",
    "fact": "Imam Ahmad Raza Khan published his Urdu translation, 'Kanzul Iman', renowned for preserving the honor of the Prophets and the majesty of Allah.",
    "reference": "Kanzul Iman Introduction"
  },
  {
    "id": 90,
    "topic": "Bahar-e-Shariat Fiqh Manual",
    "fact": "Mufti Amjad Ali A'zami compiled 'Bahar-e-Shariat', a highly popular 20-part encyclopedia explaining daily Hanafi Fiqh and Sunni practices.",
    "reference": "Bahar-e-Shariat"
  },
  {
    "id": 91,
    "topic": "Medina's Green Dome Construction",
    "fact": "Sultan Qalawun built the wooden dome over the resting place of the Prophet ﷺ in 678 AH. It was painted green under Ottoman Sultan Mahmud II in 1253 AH.",
    "reference": "Wafa al-Wafa"
  },
  {
    "id": 92,
    "topic": "Alhambra Palace in Spain",
    "fact": "The Nasrid Dynasty built the Alhambra in Granada, representing the highest aesthetic standard of Moorish geometric art, gardens, and architecture.",
    "reference": "Nafh al-Tib"
  },
  {
    "id": 93,
    "topic": "Shah Waliullah Dehlawi's Work (d. 1176 AH)",
    "fact": "Translated the Quran into Persian to make it accessible and wrote 'Hujjat Allah al-Balighah' to explain the rational beauty of Shariah and Hadith.",
    "reference": "Hayat-e-Shah-Waliullah"
  },
  {
    "id": 94,
    "topic": "Ottoman Victory at Gallipoli (1915 CE)",
    "fact": "Ottoman forces defended the Dardanelles, securing the seat of the Islamic Caliphate from falling into invading hands during World War I.",
    "reference": "Ottoman War Records"
  },
  {
    "id": 95,
    "topic": "Ibn al-Haytham and Modern Optics",
    "fact": "Muslim scientist Ibn al-Haytham published 'Kitab al-Manazir', establishing the experimental scientific method and discovering how vision works.",
    "reference": "Tarikh al-Hukama"
  },
  {
    "id": 96,
    "topic": "The Muqaddimah of Ibn Khaldun (d. 808 AH)",
    "fact": "Ibn Khaldun wrote the 'Muqaddimah', founding the academic fields of sociology, historiography, and modern social science.",
    "reference": "Wafayat al-A'yan"
  },
  {
    "id": 97,
    "topic": "Al-Qarawiyyin University Foundation (245 AH)",
    "fact": "Fatima al-Fihri established the university in Fez, Morocco, recognized as the oldest continuously operating university in the world.",
    "reference": "Tarikh Ibn Khaldun"
  },
  {
    "id": 98,
    "topic": "Riyad as-Salihin by Imam al-Nawawi",
    "fact": "Imam al-Nawawi (d. 676 AH) compiled 'Riyad as-Salihin' (Meadows of the Righteous), a primary guide for moral conduct and Sunni etiquette.",
    "reference": "Siyar A'lam al-Nubala"
  },
  {
    "id": 99,
    "topic": "Al-Khwarizmi Invents Algebra",
    "fact": "Muhammad ibn Musa al-Khwarizmi introduced algebra in Baghdad, establishing systematic mathematical equations used in science and computers today.",
    "reference": "Tarikh al-Hukama"
  },
  {
    "id": 100,
    "topic": "Mawlid al-Nabi Traditions",
    "fact": "Sunni scholars across history, including Ibn Kathir, Al-Suyuti, and Al-Asqalani, endorsed celebrating the Mawlid as a commendable practice of gratitude.",
    "reference": "Husn al-Maqsid / Al-Suyuti"
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
    "prophet": "Prophet Ismail (A.S.)",
    "snippet": "The noble son of Ibrahim (A.S.) who willingly submitted to Allah's command of sacrifice, resulting in the miracle of Zamzam and Kaaba's construction.",
    "lesson": "Absolute obedience, loyalty to parents, and patience."
  },
  {
    "id": 9,
    "prophet": "Prophet Ishaq (A.S.)",
    "snippet": "The second son of Ibrahim (A.S.), born in his old age as a glad tiding to Sarah. Ancestor of a lineage of noble Prophets of Bani Israel.",
    "lesson": "Good character, truthfulness, and persistence in prayer."
  },
  {
    "id": 10,
    "prophet": "Prophet Yaqub (A.S.)",
    "snippet": "Also known as Israel, he was the father of Yusuf (A.S.). He wept until his sight was lost but maintained absolute hope and beautiful patience (Sabr).",
    "lesson": "Beautiful patience (Sabrun Jameel) and unwavering hope in Allah."
  },
  {
    "id": 11,
    "prophet": "Prophet Ayyub (A.S.)",
    "snippet": "Blessed with immense wealth and family, then tested with their loss and a severe, long illness. He never complained and remained deeply grateful.",
    "lesson": "Steadfast patience and gratitude in adversity."
  },
  {
    "id": 12,
    "prophet": "Prophet Yunus (A.S.)",
    "snippet": "Swallowed by a giant fish, he prayed from the dark depths: 'La ilaha illa Anta, subhanaka inni kuntu minaz-zalimin', and was saved by Allah.",
    "lesson": "Turning back to Allah and constant repentance (Tawbah)."
  },
  {
    "id": 13,
    "prophet": "Prophet Sulayman (A.S.)",
    "snippet": "Given a kingdom unlike any other, with control over wind, jinn, and animals. He ruled with extreme justice and humility, attributing all power to Allah.",
    "lesson": "Humbleness in power and using wealth for good."
  },
  {
    "id": 14,
    "prophet": "Prophet Dawud (A.S.)",
    "snippet": "Defeated Goliath in youth, received the Zabur (Psalms), and fasted every alternate day. Famous for his beautiful voice glorifying Allah.",
    "lesson": "Devoted worship, courage, and sincere repentance."
  },
  {
    "id": 15,
    "prophet": "Prophet Salih (A.S.)",
    "snippet": "Sent to the Thamud tribe, who demanded a sign. Allah brought forth a miraculous she-camel from a rock. They killed it and faced divine punishment.",
    "lesson": "Respecting Allah's signs and avoiding transgression."
  },
  {
    "id": 16,
    "prophet": "Prophet Hud (A.S.)",
    "snippet": "Sent to the giant tribe of 'Ad. He warned them against their arrogance and material wealth, urging them to seek forgiveness from their Creator.",
    "lesson": "Arrogance leads to ruin; true power belongs to Allah."
  },
  {
    "id": 17,
    "prophet": "Prophet Zakariya (A.S.)",
    "snippet": "Served the sanctuary and was Maryam's guardian. In extreme old age, he prayed secretly for a righteous heir and was blessed with Yahya (A.S.).",
    "lesson": "The power of sincere, secret prayer (Dua)."
  },
  {
    "id": 18,
    "prophet": "Prophet Yahya (A.S.)",
    "snippet": "The son of Zakariya, born as a miracle. He was given scripture, wisdom, and chastity in childhood, standing firm for Torah's commandments.",
    "lesson": "Purity of heart and dedication to scriptural wisdom."
  },
  {
    "id": 19,
    "prophet": "Prophet Muhammad ﷺ (Early Years)",
    "snippet": "Before prophethood, He was known throughout Mecca as Al-Sadiq (the Truthful) and Al-Amin (the Trustworthy) due to His spotless integrity.",
    "lesson": "Integrity and building trust is the foundation of character."
  },
  {
    "id": 20,
    "prophet": "Prophet Muhammad ﷺ (The Me'raj)",
    "snippet": "In the Year of Sorrow, the Prophet ﷺ was taken on a physical night journey to Jerusalem and elevated to the Heavens to meet His Creator.",
    "lesson": "Honor and high status of the Prophet; five daily prayers."
  },
  {
    "id": 21,
    "prophet": "Prophet Muhammad ﷺ (The Hijrah)",
    "snippet": "Migrating to Medina to escape persecution, the Prophet ﷺ hid in Cave Thawr, reassuring Abu Bakr: 'Do not grieve, indeed Allah is with us.'",
    "lesson": "Total reliance on Allah (Tawakkul) combined with preparation."
  },
  {
    "id": 22,
    "prophet": "Prophet Muhammad ﷺ (The Treaty of Hudaybiyyah)",
    "snippet": "Accepted peace terms that seemed unfavorable, showing great wisdom. It led to mass conversions and paved the way for the conquest of Mecca.",
    "lesson": "Patience, diplomatic wisdom, and preferring peace over conflict."
  },
  {
    "id": 23,
    "prophet": "Prophet Muhammad ﷺ (Conquest of Mecca)",
    "snippet": "Entered His former homeland as a peaceful conqueror. He broke the idols in the Kaaba and declared a general amnesty, forgiving all former enemies.",
    "lesson": "Mercy in victory and the power of forgiveness."
  },
  {
    "id": 24,
    "prophet": "Prophet Muhammad ﷺ (The Farewell Sermon)",
    "snippet": "Delivered the final sermon at Arafat, establishing the equality of all humans, protecting women's rights, and declaring the perfection of Islam.",
    "lesson": "Equality of mankind, moral responsibility, and preservation of rights."
  },
  {
    "id": 25,
    "prophet": "Prophet Muhammad ﷺ (Al-Hayat al-Barzakhiyyah)",
    "snippet": "Sunni scholars agree that the Holy Prophet ﷺ is physically alive in His blessed grave, receiving Salat and Salam from His Ummah.",
    "lesson": "Continuous connection with the Prophet ﷺ through Durood."
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
    "topic": "Amanah (Trustworthiness)",
    "action": "Keep a secret shared with you, or return a borrowed item in pristine condition."
  },
  {
    "week": 12,
    "topic": "Karam (Generosity)",
    "action": "Give some charity or share food with a coworker or neighbor without expecting anything in return."
  },
  {
    "week": 13,
    "topic": "Hya (Modesty of Speech)",
    "action": "Refrain from using any slang, harsh language, or shouting during conversations today."
  },
  {
    "week": 14,
    "topic": "Tawadu (Humility)",
    "action": "Perform a menial chore at home or work that you usually avoid, without seeking praise."
  },
  {
    "week": 15,
    "topic": "Adl (Justice)",
    "action": "Acknowledge a mistake you made to someone and offer a sincere apology."
  },
  {
    "week": 16,
    "topic": "Ihsan (Excellence)",
    "action": "Do a task at work or school with the highest quality, remembering that Allah is watching you."
  },
  {
    "week": 17,
    "topic": "Silah al-Rahim (Extended family)",
    "action": "Contact an extended family member (like an aunt or uncle) and ask about their well-being."
  },
  {
    "week": 18,
    "topic": "Husn al-Zann (Good suspicion)",
    "action": "Assume a positive excuse for someone's behavior today instead of judging them."
  },
  {
    "week": 19,
    "topic": "Rifq (Kindness to Animals)",
    "action": "Feed a stray animal, water a plant, or avoid stepping on insects intentionally today."
  },
  {
    "week": 20,
    "topic": "Qana'ah (Contentment)",
    "action": "Refrain from browsing online shopping apps or wishing for new worldly goods today."
  },
  {
    "week": 21,
    "topic": "Wafa (Fidelity)",
    "action": "Keep a promise you made, even if it is a minor commitment to a child or friend."
  },
  {
    "week": 22,
    "topic": "Sadaqah (Removing obstacles)",
    "action": "Remove an obstacle (like a stone, branch, or trash) from a public walking path today."
  },
  {
    "week": 23,
    "topic": "Gratitude to People",
    "action": "Say 'JazakAllahu Khayran' and write a thank-you message to someone who helped you recently."
  },
  {
    "week": 24,
    "topic": "Ghad al-Basar (Guarding Gaze)",
    "action": "Lower your gaze immediately when encountering inappropriate media, sights, or people."
  },
  {
    "week": 25,
    "topic": "Salam (Greeting)",
    "action": "Be the first to say 'Assalamu Alaikum' to everyone you meet today, including strangers."
  },
  {
    "week": 26,
    "topic": "Ithar (Selflessness)",
    "action": "Give up your seat or your place in a queue to someone else who needs it today."
  },
  {
    "week": 27,
    "topic": "Dara' al-Ghadab (Anger control)",
    "action": "If you feel angry today, remain silent, seek refuge in Allah, and drink a glass of water."
  },
  {
    "week": 28,
    "topic": "Dhikr of the Tongue",
    "action": "Avoid complaining about the weather, food, or traffic today; replace it with Alhamdulillah."
  },
  {
    "week": 29,
    "topic": "Husn al-Jiwar (Neighborliness)",
    "action": "Send a small gift, fruit, or some dinner to a neighbor to maintain good relations."
  },
  {
    "week": 30,
    "topic": "Sadaqah of the Smile",
    "action": "Smile warmly when greeting your parents, family members, or friends today."
  },
  {
    "week": 31,
    "topic": "Tathir al-Qalb (Heart purification)",
    "action": "Forgive everyone who has ever wronged you before you go to sleep tonight."
  },
  {
    "week": 32,
    "topic": "Hifz al-Lisan (Tongue guard)",
    "action": "Avoid talking about anyone behind their back (Gheebah/backbiting) for the next 24 hours."
  },
  {
    "week": 33,
    "topic": "Rifq to Parents",
    "action": "Kiss your parents' hands or forehead, or call them to speak with absolute respect and affection."
  },
  {
    "week": 34,
    "topic": "Adab al-Majlis (Gathering ethics)",
    "action": "Do not interrupt anyone while they are speaking in a group conversation today."
  },
  {
    "week": 35,
    "topic": "Shukr for Health",
    "action": "Refrain from junk food today and express gratitude for your functional limbs and sight."
  },
  {
    "week": 36,
    "topic": "Ta'awun (Mutual Help)",
    "action": "Help a colleague, classmate, or family member with their task, even if you are busy."
  },
  {
    "week": 37,
    "topic": "Dua for Others",
    "action": "Pray secretly for three brothers or sisters who are currently facing struggles."
  },
  {
    "week": 38,
    "topic": "Muraqabah (Mindfulness)",
    "action": "Spend 10 minutes sitting in silence, reflecting on your deeds and Allah's presence."
  },
  {
    "week": 39,
    "topic": "Frugality",
    "action": "Consume food and utilities without wasting a single grain of rice or drop of water."
  },
  {
    "week": 40,
    "topic": "Honoring Elders",
    "action": "Stand up to greet an elderly person or help them carry their belongings."
  },
  {
    "week": 41,
    "topic": "Durood on the Prophet ﷺ",
    "action": "Send 500 Salawat upon the Holy Prophet ﷺ today as a dedicated act of devotion."
  },
  {
    "week": 42,
    "topic": "Punctuality",
    "action": "Arrive 5 minutes early for all your appointments and perform your prayers right on time."
  },
  {
    "week": 43,
    "topic": "Guarding Secrets",
    "action": "Keep a secret that was entrusted to you, without hinting about it to anyone else."
  },
  {
    "week": 44,
    "topic": "Grateful Heart",
    "action": "Write down three specific things you are grateful for today and thank Allah for them."
  },
  {
    "week": 45,
    "topic": "Cleanliness",
    "action": "Clean your desk, room, or workspace, remembering that cleanliness is part of faith."
  },
  {
    "week": 46,
    "topic": "Self-Discipline",
    "action": "Limit your social media usage to under 30 minutes today and use the time for Dhikr."
  },
  {
    "week": 47,
    "topic": "Loving for Others",
    "action": "Compliment a brother or sister on their success without feeling any jealousy."
  },
  {
    "week": 48,
    "topic": "Gentleness in Actions",
    "action": "Close doors quietly and handle objects gently, avoiding loud noises and slamming."
  },
  {
    "week": 49,
    "topic": "Hilm (Calmness)",
    "action": "If someone is rude to you, reply with a calm voice and make secret Dua for their guidance."
  },
  {
    "week": 50,
    "topic": "Mercy to Juniors",
    "action": "Forgive a mistake made by a junior, child, or subordinate, and explain gently how to improve."
  },
  {
    "week": 51,
    "topic": "Steadfastness",
    "action": "Ensure you complete all your daily spiritual goals (Quran, Salat, Dhikr) without skipping."
  },
  {
    "week": 52,
    "topic": "Reflective Year-End",
    "action": "Reflect on the past 52 weeks, make sincere repentance (Tawbah), and resolve to grow spiritually."
  }
];
