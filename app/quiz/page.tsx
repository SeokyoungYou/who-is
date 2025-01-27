"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"

const quizData = [
  {
    id: 1,
    leftImage: "/placeholder.svg?height=400&width=300&text=Person+A",
    rightImage: "/placeholder.svg?height=400&width=300&text=Person+B",
    correctAnswer: "left",
  },
  {
    id: 2,
    leftImage: "/placeholder.svg?height=400&width=300&text=Person+C",
    rightImage: "/placeholder.svg?height=400&width=300&text=Person+D",
    correctAnswer: "right",
  },
  {
    id: 3,
    leftImage: "/placeholder.svg?height=400&width=300&text=Person+E",
    rightImage: "/placeholder.svg?height=400&width=300&text=Person+F",
    correctAnswer: "left",
  },
  // Add more quiz questions here
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const router = useRouter()

  const handleAnswer = (selectedOption: "left" | "right") => {
    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      router.push(`/results?score=${score + 1}`)
    }
  }

  const progress = ((currentQuestion + 1) / quizData.length) * 100

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Who is Quartz?</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quizData.length}
        </p>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Image
              src={quizData[currentQuestion].leftImage || "/placeholder.svg"}
              alt="Left Person"
              width={300}
              height={400}
              className="rounded-lg"
            />
            <Button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              onClick={() => handleAnswer("left")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Select Left
            </Button>
          </div>
          <div className="relative">
            <Image
              src={quizData[currentQuestion].rightImage || "/placeholder.svg"}
              alt="Right Person"
              width={300}
              height={400}
              className="rounded-lg"
            />
            <Button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              onClick={() => handleAnswer("right")}
            >
              Select Right <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">Click on the button below the image to select Quartz</p>
      </CardFooter>
    </Card>
  )
}

