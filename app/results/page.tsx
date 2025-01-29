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
import { Trophy, Medal, RefreshCw, Home } from "lucide-react";
import { Suspense } from "react";
import { useQuiz } from "@/hooks/useQuiz";
const leaderboard = [
  { name: "Alice", score: 9 },
  { name: "Bob", score: 8 },
  { name: "Charlie", score: 7 },
  { name: "David", score: 6 },
  { name: "Eve", score: 5 },
];

function Results() {
  const { score, quizType } = useQuiz();
  const userRank = leaderboard.findIndex((entry) => score > entry.score) + 1;

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

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <p className="text-xl mb-2">Your Score:</p>
            <p className="text-4xl font-bold text-blue-600">
              {score} / {leaderboard.length}
            </p>
            <p className="text-lg mt-2">Rank: {userRank}</p>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow
                    key={index}
                    className={score > entry.score ? "bg-green-100" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getMedalIcon(index + 1)}
                        <span>{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell className="text-right">{entry.score}</TableCell>
                  </TableRow>
                ))}
                {userRank > leaderboard.length && (
                  <TableRow className="bg-green-100">
                    <TableCell className="font-medium">{userRank}</TableCell>
                    <TableCell>You</TableCell>
                    <TableCell className="text-right">{score}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" /> Back to Home
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
