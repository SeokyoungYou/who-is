import { QuizType } from "@/lib/quiz/type";
import { QuizResult } from "@/lib/result";
import useLocalStorageState from "use-local-storage-state";

export const useResults = () => {
  const [easyQuizResult] = useLocalStorageState<QuizResult>(QuizType.EASY, {
    defaultValue: {
      score: 0,
      questionResults: [],
      isDone: false,
    },
  });
  const [normalQuizResult] = useLocalStorageState<QuizResult>(QuizType.NORMAL, {
    defaultValue: {
      score: 0,
      questionResults: [],
      isDone: false,
    },
  });
  const [hardQuizResult] = useLocalStorageState<QuizResult>(QuizType.HARD, {
    defaultValue: {
      score: 0,
      questionResults: [],
      isDone: false,
    },
  });
  const [superHardQuizResult] = useLocalStorageState<QuizResult>(
    QuizType.SUPER_HARD,
    {
      defaultValue: {
        score: 0,
        questionResults: [],
        isDone: false,
      },
    }
  );

  const quizResults = {
    [QuizType.EASY]: easyQuizResult,
    [QuizType.NORMAL]: normalQuizResult,
    [QuizType.HARD]: hardQuizResult,
    [QuizType.SUPER_HARD]: superHardQuizResult,
  };

  return {
    quizResults,
  };
};
