import { QuizType } from "@/lib/quiz/type";

import { quizzes } from "@/lib/quiz/type";
import { useSearchParams } from "next/navigation";

export const useQuiz = () => {
  const searchParams = useSearchParams();
  const quizType = searchParams.get("type") as QuizType;
  const score = Number.parseInt(searchParams.get("score") || "0", 10);

  const quiz = quizzes.find((quiz) => quiz.id === quizType) || quizzes[0];
  const questions = quiz?.questions;

  return { quiz, questions, quizLength: questions?.length, quizType, score };
};
