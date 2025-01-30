import { LeaderBoardEntry } from "./leaderBoard";
import { CorrectAnswer } from "./quiz/type";

export interface QuestionResult {
  questionId: string;
  answer: CorrectAnswer;
}

export interface QuizResult {
  isDone: boolean;
  score: number;
  questionResults: QuestionResult[];
}

export const calculateScore = ({
  questionResults,
  questionCorrectAnswer,
}: {
  questionResults: QuestionResult[];
  questionCorrectAnswer: QuestionResult[];
}) => {
  return questionResults.filter((result) =>
    questionCorrectAnswer.some(
      (correct) =>
        correct.questionId === result.questionId &&
        correct.answer === result.answer
    )
  ).length;
};

export function updateQuestionResults(
  currentResults: QuestionResult[] = [],
  newResult: QuestionResult
): QuestionResult[] {
  const results = [...(currentResults || [])];
  const existingIndex = results.findIndex(
    (result) => result.questionId === newResult.questionId
  );

  if (existingIndex !== -1) {
    results[existingIndex] = newResult;
  } else {
    results.push(newResult);
  }

  return results;
}

export const getRank = (score: number, leaderboard: LeaderBoardEntry[]) => {
  return leaderboard.filter((entry) => entry.score > score).length + 1;
};
