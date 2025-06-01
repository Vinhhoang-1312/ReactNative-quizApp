import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Question from "../../components/Question";
import { QuestionType } from "../../services/api";

export default function Quiz() {
  const router = useRouter();
  const { questions: questionsParam, name: userName } = useLocalSearchParams<{
    questions?: string;
    name?: string;
  }>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currQues, setCurrQues] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  const resetQuiz = async () => {
    try {
      await AsyncStorage.clear();
      setQuestions([]);
      setCurrQues(0);
      setScore(0);
      setUserAnswers([]);
      setOptions([]);
      setIsLastQuestion(false);
      setError(null);
    } catch (e) {
      console.error("Error resetting quiz:", e);
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (questionsParam) {
          const parsed = JSON.parse(questionsParam);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed);
            setCurrQues(0);
            setScore(0);
            setUserAnswers(new Array(parsed.length).fill(null));
            setOptions([]);
          } else {
            throw new Error("Invalid questions data");
          }
        } else {
          throw new Error("No questions data received");
        }
      } catch (e) {
        console.error("Failed to load questions:", e);
        setError("Failed to load questions. Please try again.");
        await resetQuiz();
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [questionsParam]);

  useEffect(() => {
    if (questions && questions[currQues]) {
      setOptions(
        shuffleOptions([
          questions[currQues].correct_answer,
          ...questions[currQues].incorrect_answers,
        ])
      );
      setIsLastQuestion(currQues === questions.length - 1);
    }
  }, [questions, currQues]);

  const shuffleOptions = (options: string[]) => {
    return [...options].sort(() => Math.random() - 0.5);
  };

  const handleNext = () => {
    if (currQues < questions.length - 1) {
      setCurrQues(currQues + 1);
    }
  };

  const handleSubmit = () => {
    if (!userAnswers[currQues]) {
      return;
    }
    // Navigate to result with all the quiz data
    router.replace({
      pathname: "/result",
      params: {
        quizData: JSON.stringify({
          name: userName,
          score: score,
          total: questions.length,
          userAnswers: userAnswers.filter((answer) => answer !== null),
        }),
      },
    });
  };

  const handleQuit = async () => {
    await resetQuiz();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          {error || "No questions available"}
        </Text>
      </View>
    );
  }

  if (!questions[currQues]) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Question not found</Text>
      </View>
    );
  }
  return (
    <ImageBackground
      source={{
        uri: "https://firebasestorage.googleapis.com/v0/b/coba-mart.appspot.com/o/background.jpg?alt=media&token=6116eee1-f85c-4c3c-b384-ce0303170415",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.innerBox}>
            {questions && questions[currQues] && options.length > 0 ? (
              <Question
                currQues={currQues}
                setCurrQues={setCurrQues}
                questions={questions}
                options={options}
                correct={questions[currQues].correct_answer}
                score={score}
                setScore={setScore}
                userAnswers={userAnswers}
                setUserAnswers={setUserAnswers}
                onNext={handleNext}
                onSubmit={handleSubmit}
                onQuit={handleQuit}
                isLastQuestion={isLastQuestion}
              />
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
              </View>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Platform.OS === "web" ? 20 : 12,
    paddingVertical: Platform.OS === "web" ? 20 : 12,
  },
  innerBox: {
    width: "100%",
    height: Platform.OS === "web" ? "auto" : "80%",
    maxWidth: Platform.OS === "web" ? 400 : "100%",
    maxHeight: Platform.OS === "ios" ? 600 : 550,
    backgroundColor: "transparent",
    borderRadius: Platform.OS === "web" ? 10 : 8,
    padding: Platform.OS === "web" ? 30 : 16,
    borderWidth: Platform.OS === "web" ? 1 : 1,
    borderColor: "#fff",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: Platform.OS === "web" ? 0 : 20, // Thêm margin cho mobile
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
});
