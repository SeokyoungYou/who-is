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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Medal, RefreshCw, Home, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useResults } from "@/hooks/useResults";
import { LeaderBoardEntry } from "@/lib/leaderBoard";
import {
  getLeaderboard,
  MAX_LEADERBOARD_ENTRIES,
} from "@/firebase/firestore/leaderboard";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { getRank } from "@/lib/result";

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

  useEffect(() => {
    getLeaderboard({ quizType }).then((leaderboard) => {
      if (leaderboard) {
        setLeaderboard(leaderboard);
      }
    });
  }, [quizType]);

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Badge className="rounded-full border-none bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-1 text-sm">
            {quiz.title}
          </Badge>
          <CardTitle className="text-3xl font-bold text-center text-purple-900">
            TOP {MAX_LEADERBOARD_ENTRIES}
          </CardTitle>
        </CardHeader>
        {leaderboardWithRank.length !== 0 ? (
          <CardContent className="flex flex-col items-center space-y-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center items-center gap-16">
                <div className="rounded-lg p-4">
                  <p className="text-lg text-muted-foreground mb-1">Score</p>
                  <p className="text-4xl font-bold text-purple-700">
                    {score} / {quizLength}
                  </p>
                </div>
                <div className="rounded-lg p-4">
                  <p className="text-lg text-muted-foreground mb-1">Rank</p>
                  <p className="text-4xl font-bold text-purple-700">
                    {userRank === 0 ? "-" : `#${userRank}`}
                  </p>
                </div>
              </div>
              <Link
                href={`/user-answers?type=${quizType}`}
                className="mt-6 inline-block"
              >
                <Button
                  variant="outline"
                  className="text-purple-700 border-purple-100 hover:text-purple-700 hover:bg-purple-100 bg-purple-50  "
                >
                  View your answers
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Leaderboard
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardWithRank.map((entry, index) => (
                    <TableRow
                      key={index}
                      className={
                        score === entry.score ? "bg-purple-50/100" : ""
                      }
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
                    </TableRow>
                  ))}
                  {userRank > leaderboardWithRank.length && (
                    <TableRow className="bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900">
                        {userRank}
                      </TableCell>
                      <TableCell className="text-gray-900">You</TableCell>
                      <TableCell className="text-right text-gray-900 font-medium">
                        {score}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
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
          <Link href="/">
            <Button variant="outline" className="hover:bg-gray-50">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href={`/quiz?type=${quizType}`}>
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" /> Play Again
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
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-400" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return null;
  }
};
