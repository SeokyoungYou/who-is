import { QuizType } from "./quiz/type";

export interface LeaderBoardEntry {
  name: string;
  score: number;
}

export const getBadgeColor = (quizType: QuizType): string => {
  switch (quizType) {
    case QuizType.EASY:
      return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
    case QuizType.NORMAL:
      return "bg-gradient-to-r from-purple-400 to-purple-500 text-white";
    case QuizType.HARD:
      return "bg-gradient-to-r from-purple-600 to-purple-700 text-white";
    case QuizType.SUPER_HARD:
      return "bg-gradient-to-r from-purple-800 to-purple-900 text-white";
    default:
      return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
  }
};
