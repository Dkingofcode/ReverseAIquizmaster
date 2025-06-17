"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import LeaderboardView from "@/components/leaderboard-view"
import { LeaderboardService, type LeaderboardEntry, type GuessResult } from "@/lib/leaderboard"

export default function LeaderboardPage() {
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([])
  const [recentGuesses, setRecentGuesses] = useState<GuessResult[]>([])
  const [personalityStats, setPersonalityStats] = useState<
    Record<string, { total: number; correct: number; accuracy: number }>
  >({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboardData = () => {
      try {
        const players = LeaderboardService.getTopPlayers(50)
        const guesses = LeaderboardService.getRecentGuesses(10)
        const stats = LeaderboardService.getPersonalityTypeStats()

        setTopPlayers(players)
        setRecentGuesses(guesses)
        setPersonalityStats(stats)
      } catch (error) {
        console.error("Error loading leaderboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboardData()

    // Refresh data every 30 seconds if the page is visible
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadLeaderboardData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

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
              <p className="text-[#6e6388]">Loading leaderboard...</p>
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
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <LeaderboardView topPlayers={topPlayers} recentGuesses={recentGuesses} personalityStats={personalityStats} />
        </div>
      </div>
    </div>
  )
}
