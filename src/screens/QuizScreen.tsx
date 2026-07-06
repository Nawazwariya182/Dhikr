import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { quranService } from '../services/quranService';
import { groqService, QuizQuestion } from '../services/groqService';
import { FONTS } from '../utils/constants';
import { Ayah, SurahMeta } from '../models/types';

export const QuizScreen: React.FC = () => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();

  // App API configuration state
  const [apiKeyExists, setApiKeyExists] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);

  // Connection check state
  const [isOffline, setIsOffline] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(false);

  // Form states
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [surahModalVisible, setSurahModalVisible] = useState(false);
  const [startAyahInput, setStartAyahInput] = useState('1');
  const [endAyahInput, setEndAyahInput] = useState('5');
  const [errorMsg, setErrorMsg] = useState('');

  // Quiz execution states
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const selectedSurah = surahs.find((s) => s.id === selectedSurahId) || surahs[0];

  const checkConnection = async (): Promise<boolean> => {
    setCheckingConnection(true);
    try {
      // 3 second timeout fetch to check online connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch('https://api.groq.com', {
        method: 'HEAD',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setIsOffline(false);
      setCheckingConnection(false);
      return true;
    } catch (e) {
      setIsOffline(true);
      setCheckingConnection(false);
      return false;
    }
  };

  const checkApiKey = useCallback(async () => {
    setCheckingKey(true);
    const key = await groqService.getApiKey();
    setApiKeyExists(!!key);
    setCheckingKey(false);
  }, []);

  useEffect(() => {
    quranService.load();
    setSurahs(quranService.getSurahList());
    checkApiKey();
  }, [checkApiKey]);

  // Adjust default end ayah input if start changes or surah changes
  useEffect(() => {
    if (selectedSurah) {
      const maxAyahs = selectedSurah.ayahs;
      const start = parseInt(startAyahInput, 10) || 1;
      const end = Math.min(start + 5, maxAyahs);
      setEndAyahInput(String(end));
    }
  }, [selectedSurahId, startAyahInput]);

  const handleStartQuiz = async () => {
    setErrorMsg('');
    const start = parseInt(startAyahInput, 10);
    const end = parseInt(endAyahInput, 10);

    if (isNaN(start) || start < 1 || start > selectedSurah.ayahs) {
      setErrorMsg(`Invalid start Ayah. Choose between 1 and ${selectedSurah.ayahs}.`);
      return;
    }
    if (isNaN(end) || end < start || end > selectedSurah.ayahs) {
      setErrorMsg(`Invalid end Ayah. Choose between ${start} and ${selectedSurah.ayahs}.`);
      return;
    }
    if (end - start > 15) {
      setErrorMsg('Please select a range of 15 Ayahs or fewer to ensure proper generating speed.');
      return;
    }

    const online = await checkConnection();
    if (!online) {
      return;
    }

    setLoadingQuiz(true);
    try {
      const surahAyahs = quranService.getAyahsForSurah(selectedSurahId);
      const selectedAyahs = surahAyahs.filter((a) => a.ayah >= start && a.ayah <= end);

      const generated = await groqService.generateQuiz(selectedAyahs);
      setQuizQuestions(generated);
      setCurrentQuestionIndex(0);
      setSelectedAnswerIndex(null);
      setCorrectAnswersCount(0);
      setIsQuizFinished(false);
    } catch (e: any) {
      if (e.message === 'API_KEY_MISSING') {
        setErrorMsg('API Key is missing. Please save your Groq API Key in Settings first.');
      } else if (e.message === 'RATE_LIMIT_EXCEEDED') {
        setErrorMsg('You have already generated a quiz today. To support focused daily study, you can generate one new quiz per day. Please come back tomorrow!');
      } else {
        setErrorMsg('Failed to generate quiz. Please check your network and API key.');
      }
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswerIndex !== null) return; // already answered
    setSelectedAnswerIndex(index);
    if (index === quizQuestions[currentQuestionIndex].correctAnswerIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswerIndex(null);
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizQuestions([]);
    setIsQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setCorrectAnswersCount(0);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER STATES
  // ─────────────────────────────────────────────────────────────────────────────

  if (checkingKey) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 1. API Key Missing Warning View
  if (!apiKeyExists) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: 24, justifyContent: 'center' }]}>
        <View style={[styles.warningCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="key-outline" size={48} color={colors.accent} style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={[styles.warningTitle, { color: colors.textPrimary }]}>Groq API Key Required</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            The Daily Quranic Quiz Generator uses artificial intelligence to generate customized questions from translations, vocabulary, and historical contexts.{"\n\n"}
            To use this feature, please configure your personal **Groq API Key** under **Settings** screen first.
          </Text>
          <Pressable
            onPress={checkApiKey}
            style={[styles.retryButton, { backgroundColor: colors.primary, marginTop: 16 }]}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>I have pasted it. Verify Key</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // 2. Offline / No Internet Connection View
  if (isOffline) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: 24, justifyContent: 'center' }]}>
        <View style={[styles.warningCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="wifi-outline" size={48} color="#ef4444" style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={[styles.warningTitle, { color: colors.textPrimary }]}>No Internet Connection</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            The Quiz Generator requires an active internet connection to communicate with the Groq AI service.{"\n\n"}
            Please check your mobile data/Wi-Fi connection and tap below to retry.
          </Text>
          <Pressable
            disabled={checkingConnection}
            onPress={async () => {
              const online = await checkConnection();
              if (online) {
                setErrorMsg('');
              }
            }}
            style={[styles.retryButton, { backgroundColor: colors.primary, marginTop: 16 }]}
          >
            {checkingConnection ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry Connection</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // 3. Loading Indicator View
  if (loadingQuiz) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          Generating customized English quiz questions using Groq AI...
        </Text>
      </View>
    );
  }

  // 4. Quiz Active Execution Screen
  if (quizQuestions.length > 0 && !isQuizFinished) {
    const question = quizQuestions[currentQuestionIndex];
    const progress = (currentQuestionIndex + 1) / quizQuestions.length;
    
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Progress header */}
        <View style={styles.quizHeader}>
          <Text style={[styles.questionCounter, { color: colors.textMuted }]}>
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Question Text */}
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>
            {question.question}
          </Text>

          {/* Options List */}
          <View style={styles.optionsList}>
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              const isCorrect = idx === question.correctAnswerIndex;
              const isWrong = isSelected && !isCorrect;

              let buttonStyle = { borderColor: colors.border, backgroundColor: colors.surface };
              let textStyle = { color: colors.textPrimary };
              let iconName: keyof typeof Ionicons.glyphMap | null = null;
              let iconColor = '';

              if (selectedAnswerIndex !== null) {
                if (isCorrect) {
                  buttonStyle = { borderColor: '#10b981', backgroundColor: '#10b98120' };
                  textStyle = { color: '#10b981' };
                  iconName = 'checkmark-circle';
                  iconColor = '#10b981';
                } else if (isWrong) {
                  buttonStyle = { borderColor: '#ef4444', backgroundColor: '#ef444420' };
                  textStyle = { color: '#ef4444' };
                  iconName = 'close-circle';
                  iconColor = '#ef4444';
                } else {
                  buttonStyle = { borderColor: colors.border, backgroundColor: colors.surfaceLight };
                  textStyle = { color: colors.textMuted };
                }
              }

              return (
                <Pressable
                  key={`opt-${idx}`}
                  disabled={selectedAnswerIndex !== null}
                  onPress={() => handleAnswerSelect(idx)}
                  style={[styles.optionButton, buttonStyle]}
                >
                  <Text style={[styles.optionText, textStyle]}>{option}</Text>
                  {iconName && <Ionicons name={iconName} size={20} color={iconColor} />}
                </Pressable>
              );
            })}
          </View>

          {/* Explanation drawer when answered */}
          {selectedAnswerIndex !== null && (
            <View style={[styles.explanationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.explanationHeader}>
                <Ionicons
                  name={selectedAnswerIndex === question.correctAnswerIndex ? 'sparkles' : 'alert-circle'}
                  size={20}
                  color={selectedAnswerIndex === question.correctAnswerIndex ? '#10b981' : '#f59e0b'}
                />
                <Text
                  style={[
                    styles.explanationTitle,
                    { color: selectedAnswerIndex === question.correctAnswerIndex ? '#10b981' : '#f59e0b' },
                  ]}
                >
                  {selectedAnswerIndex === question.correctAnswerIndex ? 'Correct Answer!' : 'Incorrect Answer'}
                </Text>
              </View>
              <Text style={[styles.explanationBody, { color: colors.textSecondary }]}>
                {question.explanation}
              </Text>

              <Pressable
                onPress={handleNextQuestion}
                style={[styles.nextButton, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {currentQuestionIndex + 1 < quizQuestions.length ? 'Next Question' : 'Finish Quiz'}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // 5. Quiz Finished Results Screen
  if (isQuizFinished) {
    const successRatio = correctAnswersCount / quizQuestions.length;
    let title = 'Keep Learning!';
    let subtitle = 'Spend some more time studying the meanings and references of the verses.';
    let icon = 'book-outline';
    let iconColor = colors.accent;

    if (successRatio >= 0.8) {
      title = 'MashaAllah! Excellent!';
      subtitle = 'You have demonstrated a profound understanding of these verses.';
      icon = 'trophy-outline';
      iconColor = '#f59e0b';
    } else if (successRatio >= 0.5) {
      title = 'Alhamdulillah, Good Effort!';
      subtitle = 'You have a good grasp, but minor review will perfect your knowledge.';
      icon = 'checkmark-done-circle-outline';
      iconColor = '#10b981';
    }

    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: 24, justifyContent: 'center' }]}>
        <View style={[styles.warningCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name={icon as any} size={64} color={iconColor} style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={[styles.warningTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.scoreText, { color: colors.primary }]}>
            Score: {correctAnswersCount} / {quizQuestions.length}
          </Text>
          <Text style={[styles.warningText, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            {subtitle}
          </Text>
          <Pressable
            onPress={handleResetQuiz}
            style={[styles.retryButton, { backgroundColor: colors.primary, marginTop: 24 }]}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Try Another Quiz</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // 6. Default Quiz Range Selector Form View
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Daily Quranic Quiz</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Test your vocabulary and translation comprehension. The quiz will be generated solely from the selected range of Ayahs.
        </Text>

        {/* Surah Selector */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Select Surah</Text>
          <Pressable
            onPress={() => setSurahModalVisible(true)}
            style={[styles.pickerBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
              {selectedSurah ? `${selectedSurah.id}. ${selectedSurah.name_translit}` : 'Choose Surah'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Range Selector */}
        <View style={styles.rangeRow}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Start Ayah</Text>
            <TextInput
              keyboardType="number-pad"
              value={startAyahInput}
              onChangeText={setStartAyahInput}
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]}
            />
          </View>

          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>End Ayah</Text>
            <TextInput
              keyboardType="number-pad"
              value={endAyahInput}
              onChangeText={setEndAyahInput}
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]}
            />
          </View>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <Pressable
          onPress={handleStartQuiz}
          style={[styles.generateButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="sparkles-outline" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Generate Quiz with Groq</Text>
        </Pressable>
      </ScrollView>

      {/* SURAH PICKER MODAL */}
      <Modal visible={surahModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border, maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Choose a Surah</Text>
            <FlatList
              data={surahs}
              keyExtractor={(item) => `surah-picker-${item.id}`}
              style={{ width: '100%' }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedSurahId(item.id);
                    setStartAyahInput('1');
                    setSurahModalVisible(false);
                  }}
                  style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                >
                  <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                    {item.id}. {item.name_translit} ({item.name_en})
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>{item.ayahs} Ayahs</Text>
                </Pressable>
              )}
            />
            <Pressable
              onPress={() => setSurahModalVisible(false)}
              style={[styles.modalCloseBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontFamily: FONTS.english,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  desc: {
    fontFamily: FONTS.english,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  loadingText: {
    fontFamily: FONTS.english,
    fontSize: 15,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: FONTS.english,
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  generateButton: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    elevation: 3,
  },
  warningCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    elevation: 4,
  },
  warningTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    lineHeight: 18,
  },
  retryButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  modalCloseBtn: {
    marginTop: 16,
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  questionCounter: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  questionText: {
    fontFamily: FONTS.english,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  optionsList: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  explanationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 12,
    marginBottom: 40,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  explanationTitle: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '800',
  },
  explanationBody: {
    fontFamily: FONTS.english,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  nextButton: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: FONTS.english,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 10,
  },
});
