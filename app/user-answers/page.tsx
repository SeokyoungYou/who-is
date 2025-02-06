"use client";

import { Suspense } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useResults } from "@/hooks/useResults";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Circle, Home, X } from "lucide-react";
import ImagePreview from "@/components/ImagePreview";
import { CorrectAnswer } from "@/lib/quiz/type";
import useLocalStorageState from "use-local-storage-state";
import { LocalStorageKeys } from "@/lib/localStorage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import QuizBadge from "@/components/QuizBadge";

function UserAnswers() {
  const { quiz, questions, quizType, questionCorrectAnswer } = useQuiz();
  const { quizResults } = useResults();
  const [username] = useLocalStorageState<string>(LocalStorageKeys.USERNAME, {
    defaultValue: "",
  });
  const router = useRouter();

  const userScore = quizResults[quizType]?.score || 0;
  const userAnswers = quizResults[quizType]?.questionResults || [];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card className="overflow-hidden">
        <Button
          variant="ghost"
          className="py-6 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <CardHeader className="flex flex-col items-center space-y-8 pb-6">
          <div className="flex flex-col items-center space-y-3">
            <QuizBadge quizType={quizType}>{quiz.title}</QuizBadge>
            <CardTitle className="text-2xl font-bold text-center">
              {username}&apos;s Quiz Results
            </CardTitle>
          </div>
          <div className="w-full max-w-xs mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <p className="text-base text-gray-600">Score</p>
              <p className="text-xl font-bold text-primary">
                {userScore} / {questions.length}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {questions.map((question, index) => {
        const userAnswer = userAnswers.find(
          (answer) => answer.questionId === question.id
        );
        const correctAnswer = questionCorrectAnswer.find(
          (answer) => answer.questionId === question.id
        );
        const isCorrect = userAnswer?.answer === correctAnswer?.answer;

        return (
          <Card key={question.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Question {index + 1}: {question.title}
                </h3>
                {isCorrect ? (
                  <Circle className="text-green-500 h-6 w-6" />
                ) : (
                  <X className="text-red-500 h-6 w-6" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`relative rounded-xl transition-all overflow-hidden ${
                    userAnswer?.answer === CorrectAnswer.LEFT && isCorrect
                      ? "ring-[4px] ring-green-400/90 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-50/30"
                      : userAnswer?.answer === CorrectAnswer.LEFT && !isCorrect
                      ? "ring-[4px] ring-red-400/90 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-50/30"
                      : ""
                  }`}
                >
                  <ImagePreview
                    src={question.leftImage}
                    alt="Left Image"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  {correctAnswer?.answer === CorrectAnswer.LEFT && (
                    <div className="absolute opacity-90 top-1.5 left-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-0.5 py-0.5 rounded-full shadow-lg sm:top-3 sm:left-2 sm:px-1 sm:py-1">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  )}
                  {userAnswer?.answer === CorrectAnswer.LEFT && (
                    <div className="absolute opacity-90 top-1 right-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-1.5 py-0.5 text-xs rounded-md shadow-lg sm:top-2 sm:right-2 sm:px-2 sm:py-1 sm:text-sm">
                      My choice
                    </div>
                  )}
                </div>
                <div
                  className={`relative rounded-xl transition-all overflow-hidden ${
                    userAnswer?.answer === CorrectAnswer.RIGHT && isCorrect
                      ? "ring-[4px] ring-green-400/90 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-50/30"
                      : userAnswer?.answer === CorrectAnswer.RIGHT && !isCorrect
                      ? "ring-[4px] ring-red-400/90 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-50/30"
                      : ""
                  }`}
                >
                  <ImagePreview
                    src={question.rightImage}
                    alt="Right Image"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  {correctAnswer?.answer === CorrectAnswer.RIGHT && (
                    <div className="absolute opacity-90 top-1.5 left-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-0.5 py-0.5 rounded-full shadow-lg sm:top-3 sm:left-2 sm:px-1 sm:py-1">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  )}
                  {userAnswer?.answer === CorrectAnswer.RIGHT && (
                    <div className="absolute opacity-90 top-1 right-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-1.5 py-0.5 text-xs rounded-md shadow-lg sm:top-2 sm:right-2 sm:px-2 sm:py-1 sm:text-sm">
                      My choice
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card className="flex justify-center space-x-4 p-6">
        <Link href={`/quiz?type=${quizType}`}>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function UserAnswersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAnswers />
    </Suspense>
  );
}
