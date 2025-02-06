"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import { CorrectAnswer } from "@/lib/quiz/type";
import { useQuiz } from "@/hooks/useQuiz";
import ImagePreview from "@/components/ImagePreview";
import useLocalStorageState from "use-local-storage-state";
import { LocalStorageKeys } from "@/lib/localStorage";
import {
  QuestionResult,
  QuizResult,
  updateQuestionResults,
} from "@/lib/result";
import { calculateScore } from "@/lib/result";
import { LeaderBoardEntry } from "@/lib/leaderBoard";
import { addLeaderboardEntry } from "@/firebase/firestore/leaderboard";
import QuizBadge from "@/components/QuizBadge";

function Quiz() {
  const { quiz, questions, quizLength, quizType, questionCorrectAnswer } =
    useQuiz();
  const [isSubmitting, setIsSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();
  const [username, setUsername] = useLocalStorageState<string>(
    LocalStorageKeys.USERNAME,
    {
      defaultValue: "",
    }
  );
  const [quizResult, setQuizResult] = useLocalStorageState<QuizResult>(
    quizType,
    {
      defaultValue: {
        score: 0,
        questionResults: [],
        isDone: false,
      },
    }
  );
  const [showModal, setShowModal] = useState(false);

  const handleAnswer = (selectedOption: CorrectAnswer) => {
    const currentQuestionResult: QuestionResult = {
      questionId: questions[currentQuestion].id,
      answer: selectedOption,
    };

    const newQuestionResults = updateQuestionResults(
      quizResult.questionResults,
      currentQuestionResult
    );

    const newScore = calculateScore({
      questionResults: newQuestionResults,
      questionCorrectAnswer,
    });

    const isLastQuestion = currentQuestion + 1 === quizLength;

    setQuizResult({
      score: newScore,
      questionResults: newQuestionResults,
      isDone: isLastQuestion,
    });

    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    setShowModal(true);
  };

  const submitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitted(true);
    const entry: LeaderBoardEntry = {
      name: username,
      score: quizResult.score,
    };

    try {
      await addLeaderboardEntry({ quizType, entry });
      router.push(`/results?type=${quizType}&score=${quizResult.score}`);
    } catch (error) {
      alert(`Error adding leaderboard entry: ${JSON.stringify(error)}`);
    }
    setIsSubmitted(false);
  };

  const progress = ((currentQuestion + 1) / quizLength) * 100;

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-center gap-1">
          <div className="self-center">
            <QuizBadge quizType={quizType}>{quiz.title}</QuizBadge>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            💎 Find Quartz!
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quizLength}
          </p>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-4"
            >
              <p className="text-lg text-center font-semibold">
                {questions[currentQuestion].title}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.div
                  className="relative p-2 bg-red-100/90 backdrop-blur-sm rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ImagePreview
                    src={questions[currentQuestion].leftImage}
                    alt="Left Person"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                  <Button
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm opacity-90"
                    onClick={() => handleAnswer(CorrectAnswer.LEFT)}
                  >
                    Select Red
                  </Button>
                </motion.div>
                <motion.div
                  className="relative p-2 bg-blue-100/90 backdrop-blur-sm rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ImagePreview
                    src={questions[currentQuestion].rightImage}
                    alt="Right Person"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                  <Button
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm opacity-90"
                    onClick={() => handleAnswer(CorrectAnswer.RIGHT)}
                  >
                    Select Blue
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-12">
          <div className="flex self-center items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
          </div>
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

      <ResponsiveModal open={showModal} onOpenChange={setShowModal}>
        <ResponsiveModalContent className="space-y-6" side="top">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>🎉 Quiz Complete 🎉</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              Congratulations! You have completed the quiz.
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>

          <ResponsiveModalFooter>
            <form
              onSubmit={submitAnswer}
              className="w-full max-w-xs flex items-center justify-center self-center pb-8"
            >
              <Input
                type="text"
                value={username}
                placeholder="Enter your name"
                className="rounded-r-none focus-visible:ring-0"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button
                type="submit"
                disabled={!username}
                className="rounded-l-none shadow"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Quiz />
    </Suspense>
  );
}
