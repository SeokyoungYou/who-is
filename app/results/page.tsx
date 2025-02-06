"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Home, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useResults } from "@/hooks/useResults";
import { LeaderBoardEntry } from "@/lib/leaderBoard";
import {
  getLeaderboard,
  MAX_LEADERBOARD_ENTRIES,
} from "@/firebase/firestore/leaderboard";
import { Spinner } from "@/components/ui/spinner";
import { getRank } from "@/lib/result";
import { motion, useTransform, animate, useMotionValue } from "framer-motion";
import { Trophy, Medal } from "@phosphor-icons/react";
import QuizBadge from "@/components/QuizBadge";

function Results() {
  const [leaderboard, setLeaderboard] = useState<LeaderBoardEntry[]>([]);
  const { quizLength, quizType, quiz } = useQuiz();

  const { quizResults } = useResults();
  const quizResult = quizResults[quizType];
  const score = quizResult.score;

  const leaderboardWithRank =
    leaderboard.length > 0
      ? leaderboard.map((entry) => ({
          ...entry,
          rank: getRank(entry.score, leaderboard),
        }))
      : [];

  const userRank = getRank(score, leaderboard);

  const scoreCount = useMotionValue(0);
  const roundedScore = useTransform(scoreCount, (latest) => Math.round(latest));

  useEffect(() => {
    getLeaderboard({ quizType }).then((leaderboard) => {
      if (leaderboard) {
        setLeaderboard(leaderboard);
      }
    });
  }, [quizType]);

  useEffect(() => {
    const delay = leaderboardWithRank.length * 0.1 + 0.5;
    const timeout = setTimeout(() => {
      const animation = animate(scoreCount, score, {
        duration: 1,
        ease: "easeOut",
      });
      return animation.stop;
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [score, leaderboardWithRank.length, scoreCount]);

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
        duration: 0.5,
      },
    },
  };

  const scoreVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: leaderboardWithRank.length * 0.1 + 0.5,
      },
    },
  };

  const rankVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: leaderboardWithRank.length * 0.1 + 0.7,
      },
    },
  };

  const rowVariants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <Card className="w-full max-w-2xl bg-gradient-to-br from-purple-50 to-pink-50 ">
        <CardHeader className="flex flex-col items-center space-y-4">
          <QuizBadge quizType={quizType}>{quiz.title}</QuizBadge>

          <CardTitle className="text-3xl font-bold text-center text-purple-900">
            TOP {MAX_LEADERBOARD_ENTRIES}
          </CardTitle>
        </CardHeader>
        {leaderboardWithRank.length !== 0 ? (
          <CardContent className="flex flex-col items-center space-y-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center items-center gap-16">
                <motion.div
                  className="rounded-lg p-4"
                  variants={scoreVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-lg text-muted-foreground mb-1">Score</p>
                  <p className="text-4xl font-bold text-purple-700">
                    <motion.span>{roundedScore}</motion.span> / {quizLength}
                  </p>
                </motion.div>
                <motion.div
                  className="rounded-lg p-4"
                  variants={rankVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-lg text-muted-foreground mb-1">Rank</p>
                  <p className="text-4xl font-bold text-purple-700">
                    {userRank === 0 ? "-" : `#${userRank}`}
                  </p>
                </motion.div>
              </div>
              <Link
                href={`/user-answers?type=${quizType}`}
                className="mt-6 inline-block"
              >
                <Button
                  variant="outline"
                  className="text-purple-50  hover:text-purple-200 hover:bg-purple-500 bg-purple-600 
                    relative overflow-hidden
                    before:absolute before:inset-0
                    before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent
                    before:translate-x-[-100%] before:animate-[shimmer_3s_infinite]
                    before:border-0"
                >
                  View your answers
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="w-full overflow-hidden">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Leaderboard
              </h3>
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <motion.tbody
                  variants={tableVariants}
                  initial="hidden"
                  animate="visible"
                  className="overflow-hidden"
                >
                  {leaderboardWithRank.map((entry, index) => (
                    <motion.tr
                      key={index}
                      variants={rowVariants}
                      className={`${
                        score === entry.score ? "bg-purple-50/100" : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getMedalIcon(entry.rank)}
                          <span className="text-gray-900">{entry.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {entry.name}
                      </TableCell>
                      <TableCell className="text-right text-gray-900 font-medium">
                        {entry.score}
                      </TableCell>
                    </motion.tr>
                  ))}
                  {userRank > leaderboardWithRank.length && (
                    <motion.tr
                      variants={rowVariants}
                      className="bg-purple-200/50 "
                    >
                      <TableCell className="font-medium text-gray-900 rounded-l-lg">
                        {userRank}
                      </TableCell>
                      <TableCell className="text-gray-900">You</TableCell>
                      <TableCell className="text-right text-gray-900 font-medium  rounded-r-lg">
                        {score}
                      </TableCell>
                    </motion.tr>
                  )}
                </motion.tbody>
              </Table>
            </div>
          </CardContent>
        ) : (
          <CardContent className="flex flex-col items-center space-y-4 my-24">
            <Spinner size="large" />
            <p className="text-center text-sm text-muted-foreground">
              Loading leaderboard...
            </p>
          </CardContent>
        )}
        <CardFooter className="flex justify-center space-x-4 mt-8">
          <Link href={`/quiz?type=${quizType}`}>
            <Button variant="ghost">
              <RefreshCw className="mr-2 h-4 w-4" /> Play Again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="hover:bg-gray-50">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  );
}

const getMedalIcon = (rank: number) => {
  const baseAnimation = "animate-[wiggle_2s_ease-in-out_infinite]";
  const shimmerEffect =
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_1.5s_infinite]";

  switch (rank) {
    case 1:
      return (
        <div className={`relative overflow-hidden ${baseAnimation}`}>
          <div className={`relative ${shimmerEffect}`}>
            <Trophy className="h-6 w-6 text-amber-400" weight="fill" />
          </div>
        </div>
      );
    case 2:
      return (
        <div className={`relative overflow-hidden ${baseAnimation}`}>
          <div className={`relative ${shimmerEffect}`}>
            <Medal className="h-6 w-6 text-slate-300 " weight="fill" />
          </div>
        </div>
      );
    case 3:
      return (
        <div className={`relative overflow-hidden ${baseAnimation}`}>
          <div className={`relative ${shimmerEffect}`}>
            <Medal className="h-6 w-6 text-orange-600" weight="fill" />
          </div>
        </div>
      );
    default:
      return null;
  }
};
