"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { personalityTypes } from "@/lib/personality-types"
import { LeaderboardService } from "@/lib/leaderboard"
import { CheckCircle, XCircle, User } from "lucide-react"

interface SharedResult {
  id: string
  personalityType: string
  description: string
  traits: string[]
  confidence: number
  userDescription: string
  createdAt: string
}

interface ChallengeGuessProps {
  data: SharedResult
}

export default function ChallengeGuess({ data }: ChallengeGuessProps) {
  const [selectedGuess, setSelectedGuess] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [hasGuessed, setHasGuessed] = useState(false)
  const [userName, setUserName] = useState("")
  const [showNameInput, setShowNameInput] = useState(true)
  const [userId, setUserId] = useState("")

  const handleNameSubmit = () => {
    if (!userName.trim()) return

    // Generate a simple user ID based on name and timestamp
    const id = `${userName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`
    setUserId(id)
    setShowNameInput(false)
  }

  const handleGuess = () => {
    if (!selectedGuess || !userId || !userName) return

    // Record the guess in the leaderboard
    LeaderboardService.recordGuess(data.id, userId, userName, selectedGuess, data.personalityType)

    setHasGuessed(true)
    setShowResult(true)
  }

  const isCorrect = selectedGuess === data.personalityType
  const correctPersonality = personalityTypes.find((p) => p.name === data.personalityType)

  if (showNameInput) {
    return (
      <div className="flex flex-col w-full max-w-[512px] py-5">
        <div className="text-center mb-6">
          <h2 className="text-[#131118] text-[28px] font-bold px-4 pb-3 pt-5">Join the Challenge</h2>
          <p className="text-[#131118] text-base font-normal pb-3 pt-1 px-4">
            Enter your name to participate in the personality guessing challenge and compete on the leaderboard!
          </p>
        </div>

        <Card className="mx-4 mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <User className="w-12 h-12 text-[#7847ea] mx-auto mb-4" />
              </div>
              <div>
                <Label htmlFor="userName" className="text-base font-medium text-[#131118]">
                  Your Name
                </Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="mt-2 h-12 text-base"
                  onKeyPress={(e) => e.key === "Enter" && handleNameSubmit()}
                />
              </div>
              <Button
                onClick={handleNameSubmit}
                disabled={!userName.trim()}
                className="w-full h-12 bg-[#7847ea] hover:bg-[#6a3fd1] text-white text-base font-bold rounded-full"
              >
                Start Challenge
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center px-4">
          <p className="text-sm text-[#6e6388] mb-2">Your progress will be tracked on the leaderboard</p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/leaderboard")}
            className="text-[#7847ea] border-[#7847ea] hover:bg-[#7847ea] hover:text-white"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5">
      <div className="text-center mb-6">
        <h2 className="text-[#131118] text-[28px] font-bold px-4 pb-3 pt-5">Personality Challenge</h2>
        <p className="text-[#131118] text-base font-normal pb-3 pt-1 px-4">
          Welcome, <span className="font-semibold text-[#7847ea]">{userName}</span>! Can you guess what the AI thinks
          their personality type is?
        </p>
      </div>

      {/* User's Description */}
      <div className="mb-6">
        <h3 className="text-[#131118] text-lg font-bold tracking-[-0.015em] px-4 pb-2">Their Description</h3>
        <Card className="border-0 bg-[#f8f7fb]">
          <CardContent className="p-4">
            <p className="text-[#131118] text-base font-normal leading-relaxed">{data.userDescription}</p>
          </CardContent>
        </Card>
      </div>

      {!showResult ? (
        <>
          {/* Personality Type Options */}
          <div className="mb-6">
            <h3 className="text-[#131118] text-lg font-bold tracking-[-0.015em] px-4 pb-3">
              What do you think the AI guessed?
            </h3>
            <div className="grid grid-cols-1 gap-2 px-4">
              {personalityTypes.map((personality) => (
                <Card
                  key={personality.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedGuess === personality.name
                      ? "border-[#7847ea] bg-[#7847ea]/5"
                      : "border-[#dedce5] hover:border-[#7847ea]/50"
                  }`}
                  onClick={() => setSelectedGuess(personality.name)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: personality.color }}
                      >
                        {personality.name.charAt(4)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#131118] text-sm">{personality.name}</h4>
                        <p className="text-xs text-[#6e6388] line-clamp-1">
                          {personality.description.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit Guess */}
          <div className="px-4">
            <Button
              onClick={handleGuess}
              disabled={!selectedGuess}
              className="w-full rounded-full h-12 bg-[#7847ea] hover:bg-[#6a3fd1] text-white text-base font-bold disabled:opacity-50"
            >
              Submit My Guess
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Result */}
          <div className="mb-6">
            <Card className={`border-2 ${isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
              <CardContent className="p-4 text-center">
                <div className="mb-3">
                  {isCorrect ? (
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{isCorrect ? "Correct! 🎉" : "Not quite! 🤔"}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {isCorrect
                    ? "You guessed the AI's assessment correctly!"
                    : `You guessed "${selectedGuess}" but the AI thought they were "${data.personalityType}"`}
                </p>
                <Badge variant="outline" className="text-sm">
                  Your guess has been recorded on the leaderboard
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Actual AI Result */}
          <div className="mb-6">
            <h3 className="text-[#131118] text-lg font-bold tracking-[-0.015em] px-4 pb-2">The AI's Actual Guess</h3>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: correctPersonality?.color }}
                  >
                    {data.personalityType.charAt(4)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-[#131118]">{data.personalityType}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {data.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-[#6e6388] text-sm leading-relaxed">{correctPersonality?.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 px-4">
            <Button
              onClick={() => (window.location.href = "/leaderboard")}
              className="rounded-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-bold"
            >
              View Leaderboard
            </Button>
            <Button
              onClick={() => (window.location.href = "/describe")}
              className="rounded-full h-12 bg-[#7847ea] hover:bg-[#6a3fd1] text-white text-base font-bold"
            >
              Take Your Own Quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="rounded-full h-12 border-[#7847ea] text-[#7847ea] hover:bg-[#7847ea] hover:text-white text-base font-bold"
            >
              Back to Home
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
