"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuizType } from "@/lib/quiz/type";
import { Spinner } from "@/components/ui/spinner";
import { useResults } from "@/hooks/useResults";
import { CheckIcon } from "lucide-react";

const buttons = [
  { label: "Easy", type: QuizType.EASY, variant: "secondary" },
  { label: "Normal", type: QuizType.NORMAL, variant: "gray" },
  { label: "Hard", type: QuizType.HARD, variant: "default" },
  { label: "Super Hard", type: QuizType.SUPER_HARD, variant: "destructive" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { quizResults } = useResults();

  const handleStartQuiz = async (quizType: QuizType) => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);

      if (quizResults[quizType].isDone) {
        router.push(`/results?type=${quizType}`);
      } else {
        router.push(`/quiz?type=${quizType}`);
      }
    } catch (error) {
      alert(`Anonymous sign-in error: ${JSON.stringify(error)}`);
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
          <div className="grid gap-4 mb-6 w-full">
            {buttons.map((button) => (
              <div key={button.type} className="relative">
                {quizResults[button.type].isDone && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-b from-purple-400 to-pink-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    <CheckIcon className="h-3 w-3" strokeWidth={4} />
                  </div>
                )}
                <Button
                  variant={button.variant as ButtonProps["variant"]}
                  size="lg"
                  onClick={() => handleStartQuiz(button.type)}
                  disabled={isLoading}
                  className="w-full"
                >
                  {button.label}
                </Button>
              </div>
            ))}
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
