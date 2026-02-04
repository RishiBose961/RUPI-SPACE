import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const quotes = [
  "Great things take time. Keep going.",
  "Every expert was once a beginner.",
  "Small steps today, big wins tomorrow.",
  "Progress, not perfection.",
  "You’re closer than you think.",
  "Stay patient. Stay focused.",
  "Your future self will thank you.",
]

export default function MotivationalLoader() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[300px] w-full p-6">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 p-8">
          
          {/* Spinner */}
          <Loader2 className="h-10 w-10 animate-spin text-primary" />

          {/* Animated Quote */}
          <p
            key={index}
            className="text-lg font-medium text-muted-foreground transition-opacity duration-500"
          >
            {quotes[index]}
          </p>

        </CardContent>
      </Card>
    </div>
  )
}
