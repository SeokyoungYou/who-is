"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuizType } from "@/lib/quiz/type";
import { Spinner } from "@/components/ui/spinner";

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async (quizType: QuizType) => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      router.push(`/quiz?type=${quizType}`);
    } catch (error) {
      console.error("Anonymous sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Who is Quartz?
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="text-center mb-6">
          Test your ability to identify Quartz in this exciting photo quiz!
        </p>

        {!isLoading && (
          <div className="grid  gap-4 mb-6 w-full">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleStartQuiz(QuizType.EASY)}
              disabled={isLoading}
            >
              Easy
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleStartQuiz(QuizType.NORMAL)}
              disabled={isLoading}
            >
              Normal
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={() => handleStartQuiz(QuizType.HARD)}
              disabled={isLoading}
            >
              Hard
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => handleStartQuiz(QuizType.SUPER_HARD)}
              disabled={isLoading}
            >
              Super Hard
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-2">
            <Spinner size="medium" />
            <p className="text-center text-sm text-muted-foreground">
              Loading...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
