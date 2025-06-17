"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import ChallengeGuess from "@/components/challenge-guess"

interface SharedResult {
  id: string
  personalityType: string
  description: string
  traits: string[]
  confidence: number
  userDescription: string
  createdAt: string
}

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const [sharedResult, setSharedResult] = useState<SharedResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const shareId = params.id as string

    if (!shareId) {
      setError("Invalid challenge link")
      setLoading(false)
      return
    }

    // Try to get the shared result from localStorage
    const storedResult = localStorage.getItem(`share_${shareId}`)

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult)
        setSharedResult(parsedResult)
      } catch (error) {
        console.error("Error parsing shared result:", error)
        setError("Invalid challenge data")
      }
    } else {
      setError("Challenge not found or expired")
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div
        className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
        style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
      >
        <div className="flex h-full grow flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#7847ea] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#6e6388]">Loading challenge...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !sharedResult) {
    return (
      <div
        className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
        style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
      >
        <div className="flex h-full grow flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <h2 className="text-2xl font-bold text-[#131118] mb-4">Challenge Not Found</h2>
              <p className="text-[#6e6388] mb-6">{error || "This challenge link is invalid or has expired."}</p>
              <button
                onClick={() => router.push("/describe")}
                className="bg-[#7847ea] hover:bg-[#6a3fd1] text-white px-6 py-3 rounded-full font-bold"
              >
                Take Your Own Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
        <Header />
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <ChallengeGuess data={sharedResult} />
        </div>
      </div>
    </div>
  )
}
