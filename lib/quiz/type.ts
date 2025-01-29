import easyQuiz from "@/lib/quiz/easy.json";
import normalQuiz from "@/lib/quiz/normal.json";
import hardQuiz from "@/lib/quiz/hard.json";
import superHardQuiz from "@/lib/quiz/superHard.json";

export type Question = {
  id: string;
  title: string;
  leftImage: string;
  rightImage: string;
  correctAnswer: CorrectAnswer;
};

export enum CorrectAnswer {
  LEFT = "left",
  RIGHT = "right",
}

export type Quiz = {
  title: string;
  questions: Question[];
};

export enum QuizType {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
  SUPER_HARD = "superHard",
}

export const quizzes = [
  {
    title: easyQuiz.title,
    questions: easyQuiz.questions,
    id: QuizType.EASY,
  },
  {
    title: normalQuiz.title,
    questions: normalQuiz.questions,
    id: QuizType.NORMAL,
  },
  {
    title: hardQuiz.title,
    questions: hardQuiz.questions,
    id: QuizType.HARD,
  },
  {
    title: superHardQuiz.title,
    questions: superHardQuiz.questions,
    id: QuizType.SUPER_HARD,
  },
];
