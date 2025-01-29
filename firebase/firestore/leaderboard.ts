import { db } from "@/lib/firebase";
import { LeaderBoardEntry } from "@/lib/leaderBoard";
import { QuizType } from "@/lib/quiz/type";
import { addDoc, getDocs, limit } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

const getLeaderboardRef = () => collection(db, "leaderboards");

export const MAX_LEADERBOARD_ENTRIES = 20;

export const getLeaderboard = async ({ quizType }: { quizType: QuizType }) => {
  const ref = getLeaderboardRef();
  const q = query(
    ref,
    where("quizType", "==", quizType),
    limit(MAX_LEADERBOARD_ENTRIES)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => b.score - a.score) as LeaderBoardEntry[];
};

export const addLeaderboardEntry = async ({
  quizType,
  entry,
}: {
  quizType: QuizType;
  entry: LeaderBoardEntry;
}) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const ref = collection(db, "leaderboards");
  await addDoc(ref, {
    ...entry,
    userId: user.uid,
    quizType,
    createdAt: serverTimestamp(),
  });
};
