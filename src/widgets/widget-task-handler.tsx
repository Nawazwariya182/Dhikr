import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AyahOfDayWidget } from './components/AyahOfDayWidget';
import { TasbihCounterWidget } from './components/TasbihCounterWidget';
import { QuickActionsWidget } from './components/QuickActionsWidget';
import { DuaOfDayWidget } from './components/DuaOfDayWidget';
import { WisdomQuoteWidget } from './components/WisdomQuoteWidget';
import { LastReadWidget } from './components/LastReadWidget';
import { JuzProgressWidget } from './components/JuzProgressWidget';
import { PrayerTrackerWidget } from './components/PrayerTrackerWidget';

import quranData from '../../assets/json/quran.json';
import surahMetaData from '../../assets/json/surah_meta.json';
import juzData from '../../assets/json/juz.json';

// Define Tasbih rotation phrases
const TASBIH_PHRASES = [
  { phrase: 'سُبْحَانَ ٱللَّٰهِ', translation: 'SubhanAllah (Glory be to Allah)', target: 33 },
  { phrase: 'ٱلْحَمْدُ لِلَّٰهِ', translation: 'Alhamdulillah (Praise be to Allah)', target: 33 },
  { phrase: 'ٱللَّٰهُ أَكْبَرُ', translation: 'Allahu Akbar (Allah is the Greatest)', target: 34 },
];

const DUAS = [
  { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.', reference: 'Surah Al-Baqarah 2:201' },
  { arabic: 'رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ', translation: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.', reference: 'Surah Al-Imran 3:8' },
  { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', translation: 'My Lord, expand for me my breast [with assurance] and ease for me my task.', reference: 'Surah Taha 20:25-26' },
  { arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translation: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.', reference: 'Surah Al-Imran 3:173' },
  { arabic: 'رَبِّ زِدْنِي عِلْمًا', translation: 'My Lord, increase me in knowledge.', reference: 'Surah Taha 20:114' },
  { arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ', translation: 'Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.', reference: 'Surah Al-Baqarah 2:127' },
  { arabic: 'رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ', translation: 'Our Lord, and make us submissive to You and from our descendants a soul submissive to You.', reference: 'Surah Al-Baqarah 2:128' },
  { arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ', translation: 'My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.', reference: 'Surah Ibrahim 14:40' },
  { arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ', translation: 'Our Lord, forgive me and my parents and the believers the Day the account is established.', reference: 'Surah Ibrahim 14:41' },
  { arabic: 'رِّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ', translation: 'My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You, my Lord, lest they be present with me.', reference: 'Surah Al-Mu\'minun 23:97-98' },
  { arabic: 'رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنتَ خَيْرُ الرَّاحِمِينَ', translation: 'Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.', reference: 'Surah Al-Mu\'minun 23:109' },
  { arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا', translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.', reference: 'Surah Al-Furqan 25:74' },
  { arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ', translation: 'My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents.', reference: 'Surah Al-Ahqaf 46:15' },
  { arabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ', translation: 'Our Lord, forgive us and our brothers who preceded us in faith.', reference: 'Surah Al-Hashr 59:10' },
  { arabic: 'رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ', translation: 'Our Lord, upon You we have relied, and to You we have returned, and to You is the destination.', reference: 'Surah Al-Mumtahanah 60:4' },
  { arabic: 'رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', translation: 'Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.', reference: 'Surah Al-Tahrim 66:8' },
  { arabic: 'رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ', translation: 'My Lord, forgive and have mercy, and You are the best of the merciful.', reference: 'Surah Al-Mu\'minun 23:118' },
  { arabic: 'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ', translation: 'My Lord, grant me [a child] from among the righteous.', reference: 'Surah Al-Saffat 37:100' },
  { arabic: 'رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلَّذِينَ كَفَرُوا وَاغْفِرْ لَنَا', translation: 'Our Lord, make us not [objects of] trial for the disbelievers, and forgive us.', reference: 'Surah Al-Mumtahanah 60:5' },
  { arabic: 'رَبِّ أَنزِلْنِي مُنزَلًا مُّبَارَكًا وَأَنتَ خَيْرُ الْمُنزِلِينَ', translation: 'My Lord, let me land at a blessed landing place, and You are the best to accommodate [us].', reference: 'Surah Al-Mu\'minun 23:29' },
  { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا', translation: 'O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds.', reference: 'Sunan Ibn Majah' },
  { arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', translation: 'O Allah, indeed You are Pardoning, You love pardon, so pardon me.', reference: 'Sunan al-Tirmidhi' },
  { arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', translation: 'O Allah, help me to remember You, give thanks to You, and worship You in the best manner.', reference: 'Sunan Abi Dawud' },
  { arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', translation: 'O Controller of the hearts, make my heart steadfast in Your religion.', reference: 'Sunan al-Tirmidhi' },
  { arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.', reference: 'Surah Al-A\'raf 7:23' },
  { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ', translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness.', reference: 'Sahih al-Bukhari' },
  { arabic: 'رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ', translation: 'My Lord, do not leave me alone [with no heir], while You are the best of inheritors.', reference: 'Surah Al-Anbiya 21:89' },
  { arabic: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ', translation: 'O Allah, it is Your mercy that I hope for, so do not leave me to myself for even the blink of an eye.', reference: 'Sunan Abi Dawud' },
  { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', translation: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.', reference: 'Sahih Muslim' },
  { arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا', translation: 'Our Lord, forgive us our sins and the excess in our affairs.', reference: 'Surah Al-Imran 3:147' },
  { arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ', translation: 'O Allah, suffice me with Your lawful things instead of Your unlawful things, and make me independent of all others besides You.', reference: 'Sunan al-Tirmidhi' },
  { arabic: 'اللَّهُمَّ مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ', translation: 'O Allah, Director of hearts, direct our hearts toward Your obedience.', reference: 'Sahih Muslim' },
  { arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي', translation: 'O Allah, set right for me my religion which is the safeguard of my affairs.', reference: 'Sahih Muslim' },
  { arabic: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا', translation: 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.', reference: 'Surah Al-Kahf 18:10' },
  { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ', translation: 'O Allah, I seek refuge in You from the decline of Your favor and the change of Your safety.', reference: 'Sahih Muslim' },
  { arabic: 'رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلْقَوْمِ الظَّالِمِينَ وَنَجِّنَا بِرَحْمَتِكَ مِنَ الْقَوْمِ الْكَافِرِينَ', translation: 'Our Lord, make us not objects of trial for the wrongdoing people, and save us by Your mercy from the disbelieving people.', reference: 'Surah Yunus 10:85-86' },
  { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ', translation: 'O Allah, I ask You for well-being in this world and the Hereafter.', reference: 'Sunan Ibn Majah' },
  { arabic: 'رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ', translation: 'My Lord, cause me to enter a sound entrance and to exit a sound exit.', reference: 'Surah Al-Isra 17:80' },
  { arabic: 'اللَّهُمَّ أَحْسَنْتَ خَلْقِي فَأَحْسِنْ خُلُقِي', translation: 'O Allah, You have made my creation perfect, so make my character perfect.', reference: 'Musnad Ahmad' },
  { arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا', translation: 'Our Lord, do not impose blame upon us if we have forgotten or erred.', reference: 'Surah Al-Baqarah 2:286' },
  { arabic: 'رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا', translation: 'Our Lord, and lay not upon us a burden like that which You laid upon those before us.', reference: 'Surah Al-Baqarah 2:286' },
  { arabic: 'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ', translation: 'Our Lord, and burden us not with that which we have no ability to bear.', reference: 'Surah Al-Baqarah 2:286' },
  { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ', translation: 'O Allah, I ask You for Paradise, and I seek refuge in You from the Fire.', reference: 'Sunan Ibn Majah' },
  { arabic: 'رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ', translation: 'My Lord, grant me authority and join me with the righteous.', reference: 'Surah Al-Shu\'ara 26:83' },
  { arabic: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي بَصَرِي نُورًا وَفِي سَمْعِي نُورًا', translation: 'O Allah, place light in my heart, light in my sight, and light in my hearing.', reference: 'Sahih al-Bukhari' },
];

const WISDOM_QUOTES = [
  { quote: 'The best among you are those who learn the Quran and teach it.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'He who fears Allah, Allah will make a way out for him.', author: 'Ibn Abbas' },
  { quote: 'Acquire knowledge, and learn tranquility and dignity.', author: 'Umar ibn Al-Khattab' },
  { quote: 'The heart gets dirty like a mirror, and dhikr polishes it.', author: 'Hasan al-Basri' },
  { quote: 'Be in this world as if you were a stranger or a traveler.', author: 'Ibn Umar' },
  { quote: 'Verily, in the remembrance of Allah do hearts find rest.', author: 'Quran 13:28' },
  { quote: 'Do not look at the smallness of the sin, but look at the greatness of the One you disobeyed.', author: 'Bilal ibn Sa\'d' },
  { quote: 'Patience is a pillar of faith.', author: 'Ali ibn Abi Talib' },
  { quote: 'The tongue is like a lion; if you let it loose, it will wound someone.', author: 'Ali ibn Abi Talib' },
  { quote: 'To be alone is better than having a bad companion.', author: 'Abu Dharr Al-Ghifari' },
  { quote: 'If you want to focus more in prayer, focus more outside prayer.', author: 'Yasmin Mogahed' },
  { quote: 'Worldly life is short, so make it a means to achieve eternal life.', author: 'Ibrahim ibn Adham' },
  { quote: 'Repentance is a cleanser of the heart.', author: 'Luqman the Wise' },
  { quote: 'He who has no patience has no faith.', author: 'Ibn Mas\'ud' },
  { quote: 'A busy tongue in remembrance of Allah leaves no space for gossip.', author: 'Ibn al-Qayyim' },
  { quote: 'The Quran is a cure for what is in the breasts.', author: 'Quran 10:57' },
  { quote: 'Gratitude is the guard of blessings.', author: 'Al-Ghazali' },
  { quote: 'Be like a flower that gives its fragrance even to the hand that crushes it.', author: 'Ali ibn Abi Talib' },
  { quote: 'Sincerity is the soul of deeds.', author: 'Ibn al-Qayyim' },
  { quote: 'Do not despair of the mercy of Allah.', author: 'Quran 39:53' },
  { quote: 'The best jihad is the word of truth in the face of a tyrant.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'Knowledge without action is vanity, and action without knowledge is insanity.', author: 'Al-Ghazali' },
  { quote: 'Indeed, the character of the Prophet was the Quran.', author: 'Aisha (R.A)' },
  { quote: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'If you want to talk to Allah, perform prayer. If you want Allah to talk to you, read the Quran.', author: 'Al-Hasan Al-Basri' },
  { quote: 'The life of this world is like a shadow. If you try to catch it, you will never be able to. But if you turn your back on it, it has no choice but to follow you.', author: 'Al-Hasan Al-Basri' },
  { quote: 'A friend is not a friend until he protects his brother in three occasions: in his adversity, in his absence, and at his death.', author: 'Ali ibn Abi Talib' },
  { quote: 'The heart must be filled with the love of Allah, and if there is no room left for anything else, then peace is achieved.', author: 'Ibn al-Qayyim' },
  { quote: 'Verily, when a servant does something, Allah loves for them to do it with excellence.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'He who does not show mercy to others will not be shown mercy.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'Look at those who are beneath you, and do not look at those who are above you, for it is more suitable that you do not underestimate the blessings of Allah.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'Speak good or remain silent.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'The strong man is not the one who can wrestle, but the one who can control himself when angry.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'Do not be like those who forgot Allah, so He made them forget themselves.', author: 'Quran 59:19' },
  { quote: 'Take account of yourselves before you are taken to account.', author: 'Umar ibn Al-Khattab' },
  { quote: 'If you are grateful, I will surely increase you.', author: 'Quran 14:7' },
  { quote: 'Truthfulness leads to righteousness, and righteousness leads to Paradise.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'For indeed, with hardship [will be] ease.', author: 'Quran 94:5' },
  { quote: 'Seek knowledge from the cradle to the grave.', author: 'Ibn Qutaybah' },
  { quote: 'The richest of the rich is the one who is not a prisoner to greed.', author: 'Ali ibn Abi Talib' },
  { quote: 'Purity is half of faith.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'Every soul will taste death.', author: 'Quran 3:185' },
  { quote: 'A man follows the religion of his close friend, so let each of you look to whom he takes as a close friend.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'The best of people are those who are most beneficial to people.', author: 'Prophet Muhammad (ﷺ)' },
  { quote: 'Make things easy and do not make them difficult, cheer people up and do not scare them away.', author: 'Prophet Muhammad (ﷺ)' },
];

const STORAGE_KEYS = {
  tasbihCount: '@dhikr_widget_tasbih_count',
  tasbihIndex: '@dhikr_widget_tasbih_index',
  prefLanguage: '@dhikr_preferences',
  lastRead: '@dhikr_last_read',
  prayerLogs: '@dhikr_prayer_logs',
  duaIndex: '@dhikr_widget_dua_index',
  duaDate: '@dhikr_widget_dua_date',
  duaHistory: '@dhikr_widget_dua_history',
  wisdomIndex: '@dhikr_widget_wisdom_index',
  wisdomDate: '@dhikr_widget_wisdom_date',
  wisdomHistory: '@dhikr_widget_wisdom_history',
};

// Date Formatter helper
function getTodayDateString(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Helper to get Ayah of the Day
function getAyahOfDay(language: 'english' | 'urdu') {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime();
  const diff = new Date().getTime() - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const totalAyahs = quranData.length;
  const index = dayOfYear % totalAyahs;
  const ayah = quranData[index];
  
  const surah = surahMetaData.find((s) => s.id === ayah.surah);
  const surahName = surah ? surah.name_translit : `Surah ${ayah.surah}`;
  
  return {
    arabic: ayah.arabic,
    translation: language === 'urdu' ? ayah.urdu : ayah.english,
    surahName,
    surah: ayah.surah,
    ayah: ayah.ayah,
  };
}

// Helper to calculate Ayah index
function findAyahIndex(surah: number, ayah: number): number {
  return quranData.findIndex(a => a.surah === surah && a.ayah === ayah);
}

// Helper to calculate streak of daily prayers
function calculateStreak(logs: Record<string, any>): number {
  let streak = 0;
  let checkDate = new Date();

  while (true) {
    const yyyy = checkDate.getFullYear();
    const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
    const dd = String(checkDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const day = logs[dateStr];
    const isComplete = day && 
                        day.fajr === true && 
                        day.dhuhr === true && 
                        day.asr === true && 
                        day.maghrib === true && 
                        day.isha === true;
    
    if (isComplete) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check yesterday if checking today and it's not complete
      const todayStr = getTodayDateString();
      if (streak === 0 && dateStr === todayStr) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

// Helper to pick a non-repeating index locked for the day
async function getNonRepeatingIndex(
  listLength: number, 
  indexKey: string, 
  dateKey: string, 
  historyKey: string,
  todayStr: string
): Promise<number> {
  try {
    const savedDate = await AsyncStorage.getItem(dateKey);
    const savedIndex = await AsyncStorage.getItem(indexKey);
    
    if (savedDate === todayStr && savedIndex !== null) {
      const idx = Number(savedIndex);
      if (idx >= 0 && idx < listLength) {
        return idx;
      }
    }
    
    // Load shown history
    const historyStr = await AsyncStorage.getItem(historyKey);
    let shownIndices: number[] = [];
    if (historyStr) {
      try {
        shownIndices = JSON.parse(historyStr);
        if (!Array.isArray(shownIndices)) shownIndices = [];
      } catch {
        shownIndices = [];
      }
    }
    
    // Filter out indices that have already been shown
    let availableIndices = Array.from({ length: listLength }, (_, i) => i)
      .filter(i => !shownIndices.includes(i));
    
    // If we ran out of options, reset the history
    if (availableIndices.length === 0) {
      availableIndices = Array.from({ length: listLength }, (_, i) => i);
      shownIndices = [];
    }
    
    // Select a random index from the available ones
    const randomChoice = Math.floor(Math.random() * availableIndices.length);
    const newIndex = availableIndices[randomChoice];
    
    // Update history
    shownIndices.push(newIndex);
    await AsyncStorage.setItem(historyKey, JSON.stringify(shownIndices));
    await AsyncStorage.setItem(indexKey, String(newIndex));
    await AsyncStorage.setItem(dateKey, todayStr);
    
    return newIndex;
  } catch (e) {
    return Math.floor(Math.random() * listLength);
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, widgetInfo } = props;
  const { widgetName } = widgetInfo;
  const todayStr = getTodayDateString();

  // -------------------------------------------------------------
  // WIDGET: AyahOfDay
  // -------------------------------------------------------------
  if (widgetName === 'AyahOfDay') {
    let language: 'english' | 'urdu' = 'english';
    try {
      const prefsString = await AsyncStorage.getItem(STORAGE_KEYS.prefLanguage);
      if (prefsString) {
        const prefs = JSON.parse(prefsString);
        if (prefs.translationLanguage === 'urdu') {
          language = 'urdu';
        }
      }
    } catch {}

    const ayah = getAyahOfDay(language);
    props.renderWidget(
      <AyahOfDayWidget
        arabic={ayah.arabic}
        translation={ayah.translation}
        surahName={ayah.surahName}
        surah={ayah.surah}
        ayah={ayah.ayah}
      />
    );
  }

  // -------------------------------------------------------------
  // WIDGET: TasbihCounter
  // -------------------------------------------------------------
  else if (widgetName === 'TasbihCounter') {
    let count = 0;
    let phraseIndex = 0;
    try {
      const storedCount = await AsyncStorage.getItem(STORAGE_KEYS.tasbihCount);
      const storedIndex = await AsyncStorage.getItem(STORAGE_KEYS.tasbihIndex);
      if (storedCount !== null) count = Number(storedCount);
      if (storedIndex !== null) phraseIndex = Number(storedIndex) % TASBIH_PHRASES.length;
    } catch {}

    const currentPhrase = TASBIH_PHRASES[phraseIndex];

    if (widgetAction === 'WIDGET_CLICK' && props.clickAction === 'INCREMENT') {
      count += 1;
      if (count >= currentPhrase.target) {
        count = 0;
        phraseIndex = (phraseIndex + 1) % TASBIH_PHRASES.length;
      }
      
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.tasbihCount, String(count));
        await AsyncStorage.setItem(STORAGE_KEYS.tasbihIndex, String(phraseIndex));
      } catch {}

      const nextPhrase = TASBIH_PHRASES[phraseIndex];
      props.renderWidget(
        <TasbihCounterWidget
          phrase={nextPhrase.phrase}
          phraseTranslation={nextPhrase.translation}
          count={count}
          target={nextPhrase.target}
        />
      );
    } 
    
    else if (widgetAction === 'WIDGET_CLICK' && props.clickAction === 'RESET') {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.tasbihCount, '0');
        await AsyncStorage.setItem(STORAGE_KEYS.tasbihIndex, '0');
      } catch {}

      const firstPhrase = TASBIH_PHRASES[0];
      props.renderWidget(
        <TasbihCounterWidget
          phrase={firstPhrase.phrase}
          phraseTranslation={firstPhrase.translation}
          count={0}
          target={firstPhrase.target}
        />
      );
    } 
    
    else {
      props.renderWidget(
        <TasbihCounterWidget
          phrase={currentPhrase.phrase}
          phraseTranslation={currentPhrase.translation}
          count={count}
          target={currentPhrase.target}
        />
      );
    }
  }

  // -------------------------------------------------------------
  // WIDGET: QuickActions
  // -------------------------------------------------------------
  else if (widgetName === 'QuickActions') {
    props.renderWidget(<QuickActionsWidget />);
  }

  // -------------------------------------------------------------
  // WIDGET: DuaOfDay
  // -------------------------------------------------------------
  else if (widgetName === 'DuaOfDay') {
    const idx = await getNonRepeatingIndex(
      DUAS.length, 
      STORAGE_KEYS.duaIndex, 
      STORAGE_KEYS.duaDate, 
      STORAGE_KEYS.duaHistory,
      todayStr
    );
    const dua = DUAS[idx];
    
    props.renderWidget(
      <DuaOfDayWidget
        arabic={dua.arabic}
        translation={dua.translation}
        reference={dua.reference}
      />
    );
  }

  // -------------------------------------------------------------
  // WIDGET: WisdomQuote
  // -------------------------------------------------------------
  else if (widgetName === 'WisdomQuote') {
    const idx = await getNonRepeatingIndex(
      WISDOM_QUOTES.length, 
      STORAGE_KEYS.wisdomIndex, 
      STORAGE_KEYS.wisdomDate, 
      STORAGE_KEYS.wisdomHistory,
      todayStr
    );
    const quote = WISDOM_QUOTES[idx];
    
    props.renderWidget(
      <WisdomQuoteWidget
        quote={quote.quote}
        author={quote.author}
      />
    );
  }

  // -------------------------------------------------------------
  // WIDGET: LastRead
  // -------------------------------------------------------------
  else if (widgetName === 'LastRead') {
    let surahId = 1;
    let ayahNumber = 1;
    let hasHistory = false;

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.lastRead);
      if (stored) {
        const parsed = JSON.parse(stored);
        surahId = parsed.surahId || 1;
        ayahNumber = parsed.ayahNumber || 1;
        hasHistory = true;
      }
    } catch {}

    const surah = surahMetaData.find((s) => s.id === surahId);
    const surahName = surah ? surah.name_translit : 'Al-Fatihah';

    props.renderWidget(
      <LastReadWidget
        surahName={surahName}
        surahId={surahId}
        ayahNumber={ayahNumber}
        hasHistory={hasHistory}
      />
    );
  }

  // -------------------------------------------------------------
  // WIDGET: JuzProgress
  // -------------------------------------------------------------
  else if (widgetName === 'JuzProgress') {
    let surahId = 1;
    let ayahNumber = 1;

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.lastRead);
      if (stored) {
        const parsed = JSON.parse(stored);
        surahId = parsed.surahId || 1;
        ayahNumber = parsed.ayahNumber || 1;
      }
    } catch {}

    const currentIndex = findAyahIndex(surahId, ayahNumber);
    
    // Find matching Juz
    let juzNumber = 1;
    let startIndex = 0;
    let endIndex = quranData.length;

    for (let i = 0; i < juzData.length; i++) {
      const j = juzData[i];
      const jIndex = findAyahIndex(j.surah, j.ayah);
      if (jIndex >= 0 && currentIndex >= jIndex) {
        juzNumber = j.juz;
        startIndex = jIndex;
        
        if (i + 1 < juzData.length) {
          endIndex = findAyahIndex(juzData[i+1].surah, juzData[i+1].ayah);
        } else {
          endIndex = quranData.length;
        }
      }
    }

    const totalVerses = endIndex - startIndex;
    const versesRead = Math.max(1, currentIndex - startIndex + 1);
    const progressPercent = (versesRead / totalVerses) * 100;

    props.renderWidget(
      <JuzProgressWidget
        juzNumber={juzNumber}
        progressPercent={progressPercent}
        versesRead={versesRead}
        totalVerses={totalVerses}
      />
    );
  }

  // -------------------------------------------------------------
  // WIDGET: PrayerTracker
  // -------------------------------------------------------------
  else if (widgetName === 'PrayerTracker') {
    let logs: Record<string, any> = {};
    
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.prayerLogs);
      if (raw) logs = JSON.parse(raw);
    } catch {}

    if (!logs[todayStr]) {
      logs[todayStr] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    }

    // Intercept click toggles
    if (widgetAction === 'WIDGET_CLICK' && props.clickAction?.startsWith('TOGGLE_')) {
      const key = props.clickAction.replace('TOGGLE_', '').toLowerCase() as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
      const current = logs[todayStr][key];
      if (current === true || current === 'qaza') {
        logs[todayStr][key] = false;
      } else {
        logs[todayStr][key] = true;
      }
      
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.prayerLogs, JSON.stringify(logs));
      } catch {}
    }

    const todayDay = logs[todayStr];
    const streak = calculateStreak(logs);

    props.renderWidget(
      <PrayerTrackerWidget
        fajr={todayDay.fajr}
        dhuhr={todayDay.dhuhr}
        asr={todayDay.asr}
        maghrib={todayDay.maghrib}
        isha={todayDay.isha}
        streak={streak}
      />
    );
  }
}
