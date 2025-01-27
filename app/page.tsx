import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play } from "lucide-react"

export default function WelcomeScreen() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Who is Quartz?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="text-center mb-6">Test your ability to identify Quartz in this exciting photo quiz!</p>
        <Link href="/quiz">
          <Button size="lg">
            <Play className="mr-2 h-4 w-4" /> Start Quiz
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

