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
  {
    label: "Easy",
    type: QuizType.EASY,
    variant: "secondary",
    className: "w-full",
  },
  {
    label: "Normal",
    type: QuizType.NORMAL,
    variant: "secondary",
    className: "w-full bg-purple-400 hover:bg-purple-500 text-white",
  },
  {
    label: "Hard",
    type: QuizType.HARD,
    variant: "secondary",
    className: "w-full bg-purple-600 hover:bg-purple-700 text-white",
  },
  {
    label: "Super Hard",
    type: QuizType.SUPER_HARD,
    variant: "secondary",
    className: "w-full bg-purple-800 hover:bg-purple-900 text-white",
  },
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
                  <div className="absolute -top-2 -right-2 bg-gradient-to-b  from-pink-500 to-pink-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    <CheckIcon className="h-3 w-3" strokeWidth={4} />
                  </div>
                )}
                <Button
                  variant={button.variant as ButtonProps["variant"]}
                  size="lg"
                  onClick={() => handleStartQuiz(button.type)}
                  disabled={isLoading}
                  className={button.className}
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
