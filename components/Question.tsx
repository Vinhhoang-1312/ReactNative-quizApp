import he from "he";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QuestionProps {
  currQues: number;
  setCurrQues: (n: number) => void;
  questions: any[];
  options: string[];
  correct: string;
  score: number;
  setScore: (score: number) => void;
  userAnswers: any[];
  setUserAnswers: (answers: any[]) => void;
  onNext: () => void;
  onSubmit: () => void;
  onQuit: () => void;
  isLastQuestion: boolean;
}

const Question: React.FC<QuestionProps> = ({
  currQues,
  setCurrQues,
  questions,
  options,
  correct,
  score,
  setScore,
  userAnswers,
  setUserAnswers,
  onNext,
  onSubmit,
  onQuit,
  isLastQuestion,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Reset selected state when question changes
  useEffect(() => {
    setSelected(null);
    setError("");
  }, [currQues, questions]);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    setError("");
    if (option === correct) setScore(score + 1);

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currQues] = {
      question: questions[currQues].question,
      correct: correct,
      selected: option,
      options: options,
      answerText: questions[currQues].correct_answer,
    };
    setUserAnswers(updatedAnswers);
  };

  const getOptionStyle = (option: string) => {
    if (!selected) return styles.optionButton;

    if (option === selected && option === correct) {
      return [styles.optionButton, styles.correctOption];
    }
    if (option === selected && option !== correct) {
      return [styles.optionButton, styles.wrongOption];
    }
    if (option === correct) {
      return [styles.optionButton, styles.correctOption];
    }
    return styles.optionButton;
  };

  const handleNextPress = () => {
    if (!selected) {
      setError("Please select an option first");
      return;
    }
    onNext();
  };

  const handleSubmitPress = () => {
    if (!selected) {
      setError("Please select an option first");
      return;
    }
    onSubmit();
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionCount}>
            Question {currQues + 1} / {questions.length}
          </Text>
        </View>

        <View style={styles.questionContent}>
          <Text style={styles.questionText}>
            {questions[currQues]?.question
              ? he.decode(questions[currQues].question)
              : ""}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.optionsContainer}>
            {options &&
              options.length > 0 &&
              options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={getOptionStyle(option)}
                  onPress={() => handleSelect(option)}
                  disabled={!!selected}
                >
                  <Text style={styles.optionText}>{he.decode(option)}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.quitButton]}
            onPress={onQuit}
          >
            <Text style={[styles.controlButtonText, styles.quitButtonText]}>
              Quit
            </Text>
          </TouchableOpacity>

          {isLastQuestion ? (
            <TouchableOpacity
              style={[styles.controlButton, styles.submitButton]}
              onPress={handleSubmitPress}
              disabled={!selected}
            >
              <Text style={styles.controlButtonText}>Submit Quiz</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.controlButton, styles.nextButton]}
              onPress={handleNextPress}
              disabled={!selected}
            >
              <Text style={styles.controlButtonText}>Next Question</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Question;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  questionContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: Platform.OS === "web" ? 20 : 15,
  },
  questionHeader: {
    marginVertical: Platform.OS === "web" ? 20 : 15,
  },
  questionCount: {
    fontSize: Platform.OS === "web" ? 18 : 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  questionContent: {
    flex: 1,
    alignItems: "center",
  },
  questionText: {
    fontSize: Platform.OS === "web" ? 22 : 18,
    marginBottom: 24,
    color: "white",
    lineHeight: Platform.OS === "web" ? 32 : 26,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  optionsContainer: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 600 : "100%",
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: Platform.OS === "ios" ? 16 : 14,
    marginVertical: 8,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: Platform.OS === "web" ? 16 : 15,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  correctOption: {
    backgroundColor: "#9FD39F",
    borderColor: "#10B981",
    borderWidth: 1,
  },
  wrongOption: {
    backgroundColor: "#CF9EA2",
    borderColor: "#CD1423",
    borderWidth: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingBottom: Platform.OS === "web" ? 0 : 20,
  },
  controlButton: {
    paddingVertical: 14,
    paddingHorizontal: Platform.OS === "web" ? 24 : 20,
    borderRadius: 10,
    minWidth: Platform.OS === "web" ? 120 : 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  quitButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 10,
    flex: Platform.OS === "web" ? 0 : 1,
  },
  nextButton: {
    backgroundColor: "#1e90ff",
    flex: Platform.OS === "web" ? 0 : 2,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    flex: Platform.OS === "web" ? 0 : 2,
  },
  controlButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: Platform.OS === "web" ? 16 : 15,
    textAlign: "center",
  },
  quitButtonText: {
    color: "#ccc",
  },
  error: {
    color: "#FFB74D",
    marginBottom: 16,
    fontSize: 15,
    textAlign: "center",
  },
});
