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
import { motion } from "framer-motion";
import Image from "next/image";

const buttons = [
  {
    label: "Easy",
    type: QuizType.EASY,
    variant: "secondary",
    className: "w-full bg-purple-100 hover:bg-purple-200 text-purple-800",
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

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
    <Card className="w-full max-w-md bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-xl">
      <CardHeader className="pb-2">
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 -z-10" />
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/quartz.png"
                alt="Quartz Logo"
                width={128}
                height={128}
                className="transform hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Who is Quartz?
            </CardTitle>
          </div>
        </motion.div>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-2">
        <motion.p
          className="text-center mb-8 text-gray-600 max-w-sm"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <span className="font-medium">Challenge yourself!</span> Test your
          ability to identify Quartz in this exciting photo quiz!
        </motion.p>

        {!isLoading && (
          <motion.div
            className="grid gap-4 mb-6 w-full"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {buttons.map((button) => (
              <motion.div
                key={button.type}
                className="relative"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {quizResults[button.type].isDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 1.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                    className="absolute -top-2 -right-2 bg-gradient-to-b from-pink-500 to-pink-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg z-10"
                  >
                    <CheckIcon className="h-3 w-3" strokeWidth={4} />
                  </motion.div>
                )}
                <Button
                  variant={button.variant as ButtonProps["variant"]}
                  size="lg"
                  onClick={() => handleStartQuiz(button.type)}
                  disabled={isLoading}
                  className={`${button.className} transform transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  {button.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Spinner size="medium" className="text-purple-600" />
            <p className="text-center text-sm text-purple-600 font-medium">
              Loading...
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
