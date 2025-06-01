import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchQuestions, QuestionType } from "../../services/api";

export default function HomeScreen() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Reset quiz data when component mounts
  useEffect(() => {
    const resetQuizData = async () => {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.error("Error clearing storage:", e);
      }
    };
    resetQuizData();
  }, []);

  const handleStart = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    try {
      // Clear any existing data
      await AsyncStorage.clear();

      const questions: QuestionType[] = await fetchQuestions();
      if (!questions || questions.length === 0) {
        throw new Error("No questions received from the API");
      }

      // Navigate to quiz with questions data
      router.push({
        pathname: "/quiz",
        params: {
          name,
          questions: JSON.stringify(questions),
          timestamp: Date.now().toString(), // Add timestamp to ensure fresh data
        },
      });
    } catch (error) {
      console.error("Error starting quiz:", error);
      Alert.alert(
        "Error",
        "Failed to fetch questions. Please check your internet connection and try again."
      );
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://firebasestorage.googleapis.com/v0/b/coba-mart.appspot.com/o/background.jpg?alt=media&token=6116eee1-f85c-4c3c-b384-ce0303170415",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/coba-mart.appspot.com/o/vecteezy_quiz-button-3d-element_45800728.png?alt=media&token=8deeac27-8e62-4752-acf9-96f15a858b35",
            }}
            style={styles.bannerImage}
            resizeMode="contain"
          />
          <View style={styles.box}>
            <Text style={styles.title}>Welcome to Quiz App</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: Platform.OS === "ios" ? 20 : 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  bannerImage: {
    width: Platform.OS === "web" ? 400 : "80%",
    height: Platform.OS === "web" ? 300 : 200,
    marginBottom: 20,
  },
  box: {
    borderRadius: 20,
    padding: Platform.OS === "ios" ? 30 : 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: Platform.OS === "web" ? 28 : 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: Platform.OS === "ios" ? 12 : 10,
    fontSize: Platform.OS === "web" ? 16 : 14,
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  error: {
    color: "#ff6b6b",
    marginBottom: 10,
    fontSize: Platform.OS === "web" ? 14 : 12,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    paddingHorizontal: 28,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: Platform.OS === "web" ? 18 : 16,
    fontWeight: "bold",
  },
});
