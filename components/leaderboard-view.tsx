"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, TrendingUp, Clock, Target, Users, BarChart3 } from "lucide-react"
import type { LeaderboardEntry, GuessResult } from "@/lib/leaderboard"

interface LeaderboardViewProps {
  topPlayers: LeaderboardEntry[]
  recentGuesses: GuessResult[]
  personalityStats: Record<string, { total: number; correct: number; accuracy: number }>
}

export default function LeaderboardView({ topPlayers, recentGuesses, personalityStats }: LeaderboardViewProps) {
  const [selectedTab, setSelectedTab] = useState("rankings")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-[#6e6388]">{rank}</span>
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const totalGuesses = Object.values(personalityStats).reduce((sum, stat) => sum + stat.total, 0)
  const totalCorrect = Object.values(personalityStats).reduce((sum, stat) => sum + stat.correct, 0)
  const overallAccuracy = totalGuesses > 0 ? Math.round((totalCorrect / totalGuesses) * 100) : 0

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#131118] mb-2">Personality Guessing Leaderboard</h1>
        <p className="text-[#6e6388] text-lg">See who's the best at reading personalities!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-[#7847ea] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{topPlayers.length}</div>
            <div className="text-sm text-[#6e6388]">Active Players</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{totalGuesses}</div>
            <div className="text-sm text-[#6e6388]">Total Guesses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{overallAccuracy}%</div>
            <div className="text-sm text-[#6e6388]">Overall Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{Object.keys(personalityStats).length}</div>
            <div className="text-sm text-[#6e6388]">Personality Types</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="stats">Type Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Personality Guessers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#6e6388] mb-4">No players yet! Be the first to start guessing.</p>
                  <Button
                    onClick={() => (window.location.href = "/describe")}
                    className="bg-[#7847ea] hover:bg-[#6a3fd1] text-white"
                  >
                    Take a Quiz
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {topPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        index < 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10">{getRankIcon(index + 1)}</div>
                        <div>
                          <div className="font-semibold text-[#131118]">{player.name}</div>
                          <div className="text-sm text-[#6e6388]">
                            {player.correctGuesses}/{player.totalGuesses} correct
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#131118]">{player.accuracy}%</div>
                        <div className="flex items-center gap-2">
                          {player.streak > 0 && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              🔥 {player.streak}
                            </Badge>
                          )}
                          {player.maxStreak > 2 && (
                            <Badge variant="outline" className="text-xs">
                              Best: {player.maxStreak}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Guesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGuesses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#6e6388]">No recent activity yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentGuesses.map((guess, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${guess.correct ? "bg-green-500" : "bg-red-500"}`} />
                        <div>
                          <div className="font-medium text-[#131118]">{guess.userName}</div>
                          <div className="text-sm text-[#6e6388]">
                            Guessed "{guess.guessed}" • Actual: "{guess.actual}"
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#6e6388]">{formatTimeAgo(guess.timestamp)}</div>
                        <Badge variant={guess.correct ? "default" : "destructive"} className="text-xs">
                          {guess.correct ? "Correct" : "Wrong"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Personality Type Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(personalityStats).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#6e6388]">No personality type data yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(personalityStats)
                    .sort(([, a], [, b]) => a.accuracy - b.accuracy)
                    .map(([type, stats]) => (
                      <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <div className="font-medium text-[#131118]">{type}</div>
                          <div className="text-sm text-[#6e6388]">
                            {stats.correct}/{stats.total} guessed correctly
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#131118]">{stats.accuracy}%</div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              stats.accuracy >= 70
                                ? "border-red-200 text-red-700"
                                : stats.accuracy >= 40
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-green-200 text-green-700"
                            }`}
                          >
                            {stats.accuracy >= 70 ? "Hard" : stats.accuracy >= 40 ? "Medium" : "Easy"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
