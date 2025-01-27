"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      router.push("/quiz");
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
        <Button size="lg" onClick={handleStartQuiz} disabled={isLoading}>
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Quiz
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
