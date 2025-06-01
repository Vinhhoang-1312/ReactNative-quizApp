import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import he from "he";
import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AnswerReview {
  question: string;
  correct: string;
  selected: string;
  options: string[];
}

export default function Review() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerReview[]>([]);

  useEffect(() => {
    (async () => {
      const storedAnswers = await AsyncStorage.getItem("userAnswers");
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
      }
    })();
  }, []);
return (
    <ImageBackground
      source={{
        uri: "https://firebasestorage.googleapis.com/v0/b/coba-mart.appspot.com/o/background.jpg?alt=media&token=6116eee1-f85c-4c3c-b384-ce0303170415",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerBox}>
          <Text style={styles.title}>Review Your Answers</Text>
          {answers.map((ans, index) => (
            <View
              key={index}
              style={[
                styles.questionBlock,
                ans.selected === ans.correct ? styles.correct : styles.wrong,
              ]}
            >
              <Text style={styles.questionText}>{he.decode(ans.question)}</Text>
              <Text style={styles.answerLabel}>
                Your answer:{" "}
                <Text style={styles.answerText}>
                  {he.decode(ans.selected)}
                </Text>
              </Text>
              <Text style={styles.answerLabel}>
                Correct answer: {he.decode(ans.correct)}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
        backgroundColor: "rgba(0,0,0,0.4)",

    paddingVertical: 40,
  },
  innerBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 25,
    borderWidth: 1,
    borderColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  questionBlock: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  correct: {
    backgroundColor: "rgba(200, 230, 201, 0.6)",
    borderColor: "#4CAF50",
  },
  wrong: {
    backgroundColor: "rgba(255, 205, 210, 0.6)",
    borderColor: "#f44336",
  },
  questionText: {
    fontSize: 18,
    
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  answerLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  answerText: {
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});