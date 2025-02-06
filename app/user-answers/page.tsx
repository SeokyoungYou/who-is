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
                  className={`relative ${
                    correctAnswer?.answer === CorrectAnswer.LEFT
                      ? "border-2 border-green-500 rounded-lg"
                      : userAnswer?.answer === CorrectAnswer.LEFT
                      ? "border-2 border-red-500 rounded-lg"
                      : ""
                  }`}
                >
                  <ImagePreview
                    src={question.leftImage}
                    alt="Left Image"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                  {correctAnswer?.answer === CorrectAnswer.LEFT && (
                    <div className="absolute opacity-80 top-2 left-2 bg-green-500 text-white px-1 py-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  {userAnswer?.answer === CorrectAnswer.LEFT && (
                    <div className="absolute opacity-80 top-2 right-2 bg-gradient-to-b from-purple-300 to-pink-300 text-white px-2 py-1 rounded">
                      My choice
                    </div>
                  )}
                </div>
                <div
                  className={`relative ${
                    correctAnswer?.answer === CorrectAnswer.RIGHT
                      ? "border-2 border-green-500 rounded-lg"
                      : userAnswer?.answer === CorrectAnswer.RIGHT
                      ? "border-2 border-red-500 rounded-lg"
                      : ""
                  }`}
                >
                  <ImagePreview
                    src={question.rightImage}
                    alt="Right Image"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                  {correctAnswer?.answer === CorrectAnswer.RIGHT && (
                    <div className="absolute opacity-80 top-2 left-2 bg-green-500 text-white px-1 py-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  {userAnswer?.answer === CorrectAnswer.RIGHT && (
                    <div className="absolute opacity-80 top-2 right-2 bg-gradient-to-b from-purple-300 to-pink-300 text-white px-2 py-1 rounded">
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
