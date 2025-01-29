"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CorrectAnswer } from "@/lib/quiz/type";
import { useQuiz } from "@/hooks/useQuiz";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const { quiz, questions, quizLength, quizType } = useQuiz();

  const handleAnswer = (selectedOption: CorrectAnswer) => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizLength) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      router.push(`/results?type=${quizType}&score=${score + 1}`);
    }
  };

  const progress = ((currentQuestion + 1) / quizLength) * 100;

  return (
    <Card className="w-full max-w-2xl space-y-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          {quiz.title}
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          {questions[currentQuestion].title}
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quizLength}
        </p>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative p-1 bg-violet-100/90 backdrop-blur-sm rounded-lg shadow-lg">
            <Image
              src={questions[currentQuestion].leftImage}
              alt="Left Person"
              width={300}
              height={400}
              className="rounded-lg"
            />
            <Button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              onClick={() => handleAnswer(CorrectAnswer.LEFT)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Select Left
            </Button>
          </div>
          <div className="relative p-1 bg-violet-100/90 backdrop-blur-sm rounded-lg shadow-lg">
            <Image
              src={questions[currentQuestion].rightImage}
              alt="Right Person"
              width={300}
              height={400}
              className="rounded-lg"
            />
            <Button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              onClick={() => handleAnswer(CorrectAnswer.RIGHT)}
            >
              Select Right <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-0.5">
        <p className="text-sm text-muted-foreground">
          Click on the button below the image to select Quartz
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <Info className="mr-2 h-4 w-4" />
              Click here for a hint
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-48 text-center p-3">
            The cuter one is Quartz! 🤩
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}
