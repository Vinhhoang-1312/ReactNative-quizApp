import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QuizData {
  name: string;
  score: number;
  total: number;
  userAnswers: any[];
}

export default function Result() {
  const router = useRouter();
  const { quizData: quizDataParam } = useLocalSearchParams<{
    quizData: string;
  }>();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (quizDataParam) {
        const parsedData = JSON.parse(quizDataParam);
        setQuizData(parsedData);
      }
    } catch (error) {
      console.error("Error parsing quiz data:", error);
    } finally {
      setLoading(false);
    }
  }, [quizDataParam]);

  const getResultImage = () => {
    if (quizData) {
      return quizData.score >= quizData.total / 2
        ? "https://cdn-icons-png.flaticon.com/512/2278/2278992.png"
        : "https://firebasestorage.googleapis.com/v0/b/coba-mart.appspot.com/o/wrong-3d.png?alt=media&token=9b90c61d-9918-4bd5-b554-3a2624cb527a";
    }
    return "https://cdn-icons-png.flaticon.com/512/2278/2278992.png";
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.score}>Loading...</Text>
      </View>
    );
  }

  if (!quizData) {
    return (
      <View style={styles.container}>
        <Text style={styles.score}>No quiz data available</Text>
        <TouchableOpacity
          style={[styles.button, styles.homeButton]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
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
      <View style={styles.container}>
        <View style={styles.innerBox}>
          <Image source={{ uri: getResultImage() }} style={styles.image} />
          <Text style={styles.welcomeText}>Great job, {quizData.name}!</Text>
          <Text style={styles.title}>Quiz Completed!</Text>
          <Text style={styles.score}>
            Your score: {quizData.score} / {quizData.total}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/review",
                params: { quizData: quizDataParam },
              })
            }
          >
            <Text style={styles.buttonText}>Review Answers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: Platform.OS === "ios" ? 20 : 16,
    paddingVertical: Platform.OS === "ios" ? 20 : 16,
  },
  innerBox: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 400 : "95%",
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: Platform.OS === "ios" ? 30 : 20,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  score: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 6,
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#10255A",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});
