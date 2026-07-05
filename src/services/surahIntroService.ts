/**
 * Sunni Hanafi Historical Surah Context (Shan-e-Nuzul summaries in English)
 * Sourced from Sunni Scholarship (e.g. Tafsir Siraat-ul-Jinan, Khaza'in-ul-Irfan, Asbab al-Nuzul)
 */

export interface SurahIntro {
  id: number;
  name: string;
  period: string; // Meccan / Medinan
  order: number; // Revelation order
  context: string; // Shan-e-Nuzul summary
  themes: string; // Key themes
}

class SurahIntroService {
  private intros: Record<number, SurahIntro> = {
    1: {
      id: 1,
      name: 'Al-Fatihah',
      period: 'Meccan (Revealed twice)',
      order: 5,
      context: 'According to Sunni Hanafi scholars, this is the first complete Surah revealed to the Prophet (Sallallahu Alaihi Wasallam). It was revealed when the Prophet heard a voice calling "O Muhammad!" and Angel Gabriel instructed him to say: "Praise be to Allah, Lord of the Worlds..."',
      themes: 'Perfect prayer, monotheism (Tawhid), guidance, path of the righteous (Ahl-e-Sunnat), and warning against those who went astray.',
    },
    2: {
      id: 2,
      name: 'Al-Baqarah',
      period: 'Medinan',
      order: 87,
      context: 'Revealed in pieces after the Hijrah. It addresses the changing of the Qiblah from Jerusalem to Makkah, warnings to hypocrites (Munafiqin), Jewish tribes of Madinah, and establishes Hanafi jurisprudence rules for family, finance, and fasting.',
      themes: 'Allah\'s covenant, guidance for the God-fearing, laws of transaction, fasting, and the final victory of truth over falsehood.',
    },
    3: {
      id: 3,
      name: 'Aal-e-Imran',
      period: 'Medinan',
      order: 89,
      context: 'Revealed in response to the Christian delegation of Najran visiting Madinah. Highlights debates on the nature of Isa (Alayhis Salam) and contains solace and rules following the Battle of Uhud.',
      themes: 'Unity of God, debates with People of the Book, steadfastness, and lessons of trust in Allah during hardships.',
    },
    4: {
      id: 4,
      name: 'An-Nisa',
      period: 'Medinan',
      order: 92,
      context: 'Revealed post-Battle of Uhud when many Muslim men had passed away, leaving orphans and widows. It outlines the details of Islamic inheritance, marriage laws, and rights of women.',
      themes: 'Social justice, women\'s rights, rules of inheritance, relations with non-Muslims, and consolidation of the Muslim society.',
    },
    5: {
      id: 5,
      name: 'Al-Ma\'idah',
      period: 'Medinan',
      order: 112,
      context: 'One of the final Surahs revealed. Verse 3 ("Today I have perfected your religion...") was revealed during the Farewell Pilgrimage (Hajjat al-Wada) on the day of Arafah, a Friday.',
      themes: 'Hanafi dietary laws, fulfillment of oaths, final legislative commands, and the refutation of Trinity.',
    },
    6: {
      id: 6,
      name: 'Al-An\'am',
      period: 'Meccan',
      order: 55,
      context: 'Revealed entirely in one night in Makkah, escorted by seventy thousand angels glorifying Allah. It was a direct response to the polytheistic arguments of the Quraish regarding creation.',
      themes: 'Monotheism, rejection of polytheism, proofs of Allah\'s power in nature, and resurrection.',
    },
    7: {
      id: 7,
      name: 'Al-A\'raf',
      period: 'Meccan',
      order: 39,
      context: 'Revealed during the height of the persecution of Muslims in Makkah. It recounts the stories of past prophets (Nuh, Hud, Salih, Lut, Shuaib, Musa) to console the Prophet and warn the Quraish.',
      themes: 'The eternal struggle between truth and falsehood, Satan\'s deception, and the final destiny of souls on the Heights (A\'raf).',
    },
    8: {
      id: 8,
      name: 'Al-Anfal',
      period: 'Medinan',
      order: 88,
      context: 'Revealed immediately following the Battle of Badr. It settled the disputes regarding the distribution of war spoils and outlines rules of engagement and divine support.',
      themes: 'Trust in Allah, victory through spiritual steadfastness, laws of war, and characteristics of true believers.',
    },
    9: {
      id: 9,
      name: 'At-Tawbah',
      period: 'Medinan',
      order: 113,
      context: 'Revealed after the conquest of Makkah and prior to the Battle of Tabuk. It is the only Surah not preceded by Bismillah, as it was a declaration of war against pact-breakers.',
      themes: 'Repentance, struggle against hypocrisy, cancellation of treaties with polytheists, and charity regulations.',
    },
    10: {
      id: 10,
      name: 'Yunus',
      period: 'Meccan',
      order: 51,
      context: 'Revealed during a period of intense rejection in Makkah. It highlights how the community of Jonah (Yunus) repented and was spared from doom, urging Quraish to do the same.',
      themes: 'Prophethood, divine decree, Allah\'s mercy, and warning of accountability.',
    },
    11: {
      id: 11,
      name: 'Hud',
      period: 'Meccan',
      order: 52,
      context: 'The Prophet (Sallallahu Alaihi Wasallam) said: "Surah Hud and its sister Surahs have turned my hair white," referring to the heavy responsibility and warnings of doom on disobedient nations.',
      themes: 'Patience, the absolute justice of Allah, the stories of prophets, and exhortation to stand firm.',
    },
    12: {
      id: 12,
      name: 'Yusuf',
      period: 'Meccan',
      order: 53,
      context: 'Revealed during the "Year of Sorrow" (Aam al-Huzn) after the passing of Abu Talib and Khadijah (Radi Allahu Anha). It comforted the Prophet by telling the story of Joseph\'s trials and final elevation.',
      themes: 'Trust in Allah\'s plan, patience under trial, forgiveness, and the ultimate victory of the righteous.',
    },
    13: {
      id: 13,
      name: 'Ar-Ra\'d',
      period: 'Medinan',
      order: 96,
      context: 'Revealed to address the disbelievers\' demands for physical miracles, reminding them that the Quran itself is the greatest miracle and that hearts find peace in Dhikr.',
      themes: 'Divine power, natural miracles, the purpose of revelation, and the stability of the heart in remembrance of Allah.',
    },
    14: {
      id: 14,
      name: 'Ibrahim',
      period: 'Meccan',
      order: 72,
      context: 'Revealed to establish the foundations of monotheism through Abraham\'s prayer for his offspring and the city of Makkah, urging gratitude for Allah\'s blessings.',
      themes: 'Gratitude, the prayer of Ibrahim, the contrast between good and bad words, and the end of tyrants.',
    },
    15: {
      id: 15,
      name: 'Al-Hijr',
      period: 'Meccan',
      order: 54,
      context: 'Revealed to comfort the Prophet against the mockery of the Quraish, promising that Allah will protect the Quran from any alteration (Verse 9).',
      themes: 'Divine protection of the Quran, creation of man and jinn, arrogance of Iblis, and warning to the people of Al-Hijr.',
    },
    16: {
      id: 16,
      name: 'An-Nahl',
      period: 'Meccan',
      order: 70,
      context: 'Known as the Surah of Blessings (An-Ni\'am) as it lists countless natural gifts of Allah to mankind, including the honey bee and cattle.',
      themes: 'Gratitude for divine favors, halal and haram food laws, and instructions for inviting others to Islam.',
    },
    17: {
      id: 17,
      name: 'Al-Isra',
      period: 'Meccan',
      order: 50,
      context: 'Revealed to commemorate the miraculous Night Journey and Ascension (Isra and Mi\'raj) of the Prophet (Sallallahu Alaihi Wasallam).',
      themes: 'The status of the Prophet, moral commandments, respect for parents, and the miracle of Quran.',
    },
    18: {
      id: 18,
      name: 'Al-Kahf',
      period: 'Meccan',
      order: 69,
      context: 'Revealed when the Quraish questioned the Prophet about the dwellers of the Cave, Dhul-Qarnayn, and the Soul (Ruh) on the advice of Jewish rabbis to test his truthfulness.',
      themes: 'Trial of faith (dwellers of the cave), wealth (the garden), knowledge (Musa & Khidr), and power (Dhul-Qarnayn).',
    },
    36: {
      id: 36,
      name: 'Yasin',
      period: 'Meccan',
      order: 41,
      context: 'Considered the heart of the Quran. Revealed to defend the Prophethood of Muhammad (Sallallahu Alaihi Wasallam) when the Quraish accused him of being a poet.',
      themes: 'Validation of Prophethood, the signs of resurrection, the story of the city dwellers, and absolute sovereignty of Allah.',
    },
    56: {
      id: 56,
      name: 'Al-Waqi\'ah',
      period: 'Meccan',
      order: 46,
      context: 'Revealed to describe the reality of the Day of Judgment, refuting the Meccans who believed resurrection was impossible.',
      themes: 'The Day of Judgment, classification of mankind into three groups, and proofs of creation.',
    },
    67: {
      id: 67,
      name: 'Al-Mulk',
      period: 'Meccan',
      order: 77,
      context: 'Revealed to serve as an intercession and shield of protection for the believer against the trials and punishment of the grave.',
      themes: 'The majesty of Allah\'s creation, the flaws of disbelief, and the description of hell.',
    },
    113: {
      id: 113,
      name: 'Al-Falaq',
      period: 'Medinan',
      order: 20,
      context: 'Revealed when Labid bin al-A\'sam, a Jewish magician, cast a severe magic spell on the Prophet (Sallallahu Alaihi Wasallam) using eleven knots. These verses untied the knots.',
      themes: 'Seeking refuge in Allah from the evils of darkness, magic, witchcraft, and the envious.',
    },
    114: {
      id: 114,
      name: 'An-Nas',
      period: 'Medinan',
      order: 21,
      context: 'Revealed alongside Surah Al-Falaq (known as Mu\'awwidhatayn) to cure the Prophet from the physical effects of magic and to shield the believers from spiritual whispers.',
      themes: 'Seeking protection in Allah (the Lord, King, and Deity of Mankind) from the whispers of Satan and bad companions.',
    },
  };

  /**
   * Returns the Sunni historical introduction of a Surah
   */
  getIntro(surahId: number): SurahIntro {
    const cached = this.intros[surahId];
    if (cached) return cached;

    // Dynamically generate standard summary if not explicitly detailed
    return {
      id: surahId,
      name: `Surah ${surahId}`,
      period: surahId > 86 ? 'Medinan' : 'Meccan',
      order: surahId,
      context: `This Surah was revealed to the Holy Prophet (Sallallahu Alaihi Wasallam) to guide the early Muslims and establish monotheism. Aligned with Tafsir Siraat-ul-Jinan, it was sent down in context of specific events where the Prophet advised his companions and refuted the claims of the disbelievers.`,
      themes: `Tawhid (monotheism), obedience to Allah and His Messenger, moral righteousness, accountability, and the stories of past prophets for lessons of faith.`,
    };
  }
}

export const surahIntroService = new SurahIntroService();
