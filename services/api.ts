import axios from "axios";

export interface QuestionType {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export const fetchQuestions = async (): Promise<QuestionType[]> => {
  try {
    const { data } = await axios.get(
      "https://opentdb.com/api.php?amount=5&type=multiple"
    );
    if (data.response_code === 0 && Array.isArray(data.results)) {
      return data.results;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
