import { LeaderboardService, type GuessResult, type LeaderboardEntry } from "./leaderboard"
import { personalityTypes } from "./personality-type"

export interface AnalyticsData {
  overview: {
    totalUsers: number
    totalGuesses: number
    totalQuizzes: number
    averageAccuracy: number
    activeUsers: number
    retentionRate: number
  }
  personalityTrends: {
    type: string
    count: number
    percentage: number
    accuracy: number
    trend: number // percentage change from previous period
  }[]
  engagementMetrics: {
    dailyActive: { date: string; users: number; guesses: number }[]
    hourlyDistribution: { hour: number; activity: number }[]
    streakDistribution: { streakLength: number; users: number }[]
  }
  accuracyTrends: {
    date: string
    accuracy: number
    totalGuesses: number
  }[]
  topPerformers: {
    user: LeaderboardEntry
    rank: number
    improvement: number
  }[]
  challengeMetrics: {
    completionRate: number
    averageTimeToComplete: number
    shareRate: number
    returnRate: number
  }

}
export type RealTimeEvent =
  | { type: "quiz_taken"; timestamp: string; data: { userName?: string; personalityType: string } }
  | { type: "guess_made"; timestamp: string; data: { userName: string; guessed: string; actual: string; correct: boolean } }
  | { type: "analytics_update"; timestamp: string; data: any }
  | { type: "user_joined"; timestamp: string; data: { userName: string } }

export interface AnalyticsOverview {
  totalUsers: number
  totalGuesses: number
  totalQuizzes: number
  averageAccuracy: number
  activeUsers: number
  retentionRate: number
}

export interface PersonalityTrends {
  type: string
  count: number
  percentage: number
  accuracy: number
  trend: number // percentage change from previous period
}

export interface EngagementMetrics {
  dailyActive: { date: string; users: number; guesses: number }[]
  hourlyDistribution: { hour: number; activity: number }[]
  streakDistribution: { streakLength: number; users: number }[]
}


export interface AccuracyTrends {
  date: string
  accuracy: number
  totalGuesses: number
}

export interface TopPerformers {
  user: LeaderboardEntry
  rank: number
  improvement: number // percentage change from previous period
}

export interface ChallengeMetrics {
  completionRate: number
  averageTimeToComplete: number // seconds
  shareRate: number // percentage
  returnRate: number // percentage of users who took multiple quizzes
  
}



export class AnalyticsService {
  private static readonly ANALYTICS_KEY = "personality_analytics"
  private static readonly QUIZ_RESULTS_KEY = "personality_quiz_results"

  static recordQuizTaken(personalityType: string, userId?: string): void {
    const quizResults = this.getQuizResults()
    const newResult = {
      id: Math.random().toString(36).substring(2, 15),
      personalityType,
      userId: userId || "anonymous",
      timestamp: new Date().toISOString(),
    }
    quizResults.push(newResult)
    localStorage.setItem(this.QUIZ_RESULTS_KEY, JSON.stringify(quizResults))
  }

  private static getQuizResults(): Array<{
    id: string
    personalityType: string
    userId: string
    timestamp: string
  }> {
    try {
      const data = localStorage.getItem(this.QUIZ_RESULTS_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading quiz results:", error)
      return []
    }
  }

  static generateAnalytics(timeRange: "7d" | "30d" | "90d" | "all" = "30d"): AnalyticsData {
    const guesses = LeaderboardService.getGuessHistory()
    const leaderboard = LeaderboardService.getLeaderboard()
    const quizResults = this.getQuizResults()

    // Filter data by time range
    const cutoffDate = this.getCutoffDate(timeRange)
    const filteredGuesses = guesses.filter((g) => new Date(g.timestamp) >= cutoffDate)
    const filteredQuizzes = quizResults.filter((q) => new Date(q.timestamp) >= cutoffDate)

    return {
      overview: this.calculateOverview(filteredGuesses, leaderboard, filteredQuizzes),
      personalityTrends: this.calculatePersonalityTrends(filteredGuesses, filteredQuizzes),
      engagementMetrics: this.calculateEngagementMetrics(filteredGuesses, leaderboard),
      accuracyTrends: this.calculateAccuracyTrends(filteredGuesses),
      topPerformers: this.calculateTopPerformers(leaderboard),
      challengeMetrics: this.calculateChallengeMetrics(filteredGuesses, filteredQuizzes),
    }
  }

  private static getCutoffDate(timeRange: string): Date {
    const now = new Date()
    switch (timeRange) {
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      default:
        return new Date(0)
    }
  }

  private static calculateOverview(
    guesses: GuessResult[],
    leaderboard: LeaderboardEntry[],
    quizzes: Array<any>,
  ): AnalyticsData["overview"] {
    const totalUsers = leaderboard.length
    const totalGuesses = guesses.length
    const totalQuizzes = quizzes.length
    const correctGuesses = guesses.filter((g) => g.correct).length
    const averageAccuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0

    // Active users (users who made a guess in the last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const activeUsers = new Set(guesses.filter((g) => new Date(g.timestamp) >= sevenDaysAgo).map((g) => g.userId)).size

    // Retention rate (users who made multiple guesses)
    const userGuessCounts = guesses.reduce(
      (acc, guess) => {
        acc[guess.userId] = (acc[guess.userId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const returningUsers = Object.values(userGuessCounts).filter((count) => count > 1).length
    const retentionRate = totalUsers > 0 ? Math.round((returningUsers / totalUsers) * 100) : 0

    return {
      totalUsers,
      totalGuesses,
      totalQuizzes,
      averageAccuracy,
      activeUsers,
      retentionRate,
    }
  }

  private static calculatePersonalityTrends(
    guesses: GuessResult[],
    quizzes: { personalityType: string }[],
  ): AnalyticsData["personalityTrends"] {
    // Count quiz results (actual personality types assigned)
    const quizCounts = quizzes.reduce(
      (acc, quiz) => {
        acc[quiz.personalityType] = (acc[quiz.personalityType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Count guess accuracy for each type
    const guessStats = guesses.reduce(
      (acc, guess) => {
        if (!acc[guess.actual]) {
          acc[guess.actual] = { total: 0, correct: 0 }
        }
        acc[guess.actual].total += 1
        if (guess.correct) {
          acc[guess.actual].correct += 1
        }
        return acc
      },
      {} as Record<string, { total: number; correct: number }>,
    )

    const totalQuizzes = Object.values(quizCounts).reduce((sum, count) => sum + count, 0)

    return personalityTypes.map((type) => {
      const count = quizCounts[type.name] || 0
      const percentage = totalQuizzes > 0 ? Math.round((count / totalQuizzes) * 100) : 0
      const stats = guessStats[type.name] || { total: 0, correct: 0 }
      const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

      // Simple trend calculation (would be more sophisticated with historical data)
      const trend = Math.floor(Math.random() * 21) - 10 // -10 to +10 for demo

      return {
        type: type.name,
        count,
        percentage,
        accuracy,
        trend,
      }
    })
  }

  private static calculateEngagementMetrics(
    guesses: GuessResult[],
    leaderboard: LeaderboardEntry[],
  ): AnalyticsData["engagementMetrics"] {
    // Daily active users and guesses
    const dailyData = guesses.reduce(
      (acc, guess) => {
        const date = new Date(guess.timestamp).toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = { users: new Set(), guesses: 0 }
        }
        acc[date].users.add(guess.userId)
        acc[date].guesses += 1
        return acc
      },
      {} as Record<string, { users: Set<string>; guesses: number }>,
    )

    const dailyActive = Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        users: data.users.size,
        guesses: data.guesses,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30) // Last 30 days

    // Hourly distribution
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: guesses.filter((g) => new Date(g.timestamp).getHours() === hour).length,
    }))

    // Streak distribution
    const streakCounts = leaderboard.reduce(
      (acc, user) => {
        const streakRange = this.getStreakRange(user.maxStreak)
        acc[streakRange] = (acc[streakRange] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const streakDistribution = [
      { streakLength: 1, users: streakCounts["1-2"] || 0 },
      { streakLength: 3, users: streakCounts["3-5"] || 0 },
      { streakLength: 6, users: streakCounts["6-10"] || 0 },
      { streakLength: 11, users: streakCounts["11+"] || 0 },
    ]

    return {
      dailyActive,
      hourlyDistribution: hourlyData,
      streakDistribution,
    }
  }

  private static getStreakRange(streak: number): string {
    if (streak <= 2) return "1-2"
    if (streak <= 5) return "3-5"
    if (streak <= 10) return "6-10"
    return "11+"
  }

  private static calculateAccuracyTrends(guesses: GuessResult[]): AnalyticsData["accuracyTrends"] {
    const dailyAccuracy = guesses.reduce(
      (acc, guess) => {
        const date = new Date(guess.timestamp).toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = { total: 0, correct: 0 }
        }
        acc[date].total += 1
        if (guess.correct) {
          acc[date].correct += 1
        }
        return acc
      },
      {} as Record<string, { total: number; correct: number }>,
    )

    return Object.entries(dailyAccuracy)
      .map(([date, data]) => ({
        date,
        accuracy: Math.round((data.correct / data.total) * 100),
        totalGuesses: data.total,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30) // Last 30 days
  }

  private static calculateTopPerformers(leaderboard: LeaderboardEntry[]): AnalyticsData["topPerformers"] {
    return leaderboard
      .filter((user) => user.totalGuesses >= 5)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 10)
      .map((user, index) => ({
        user,
        rank: index + 1,
        improvement: Math.floor(Math.random() * 21) - 10, // Demo data
      }))
  }

  private static calculateChallengeMetrics(
    guesses: GuessResult[],
    quizzes: Array<any>,
  ): AnalyticsData["challengeMetrics"] {
    const totalChallenges = quizzes.length
    const completedChallenges = guesses.length
    const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0

    // Average time to complete (simulated for demo)
    const averageTimeToComplete = 45 // seconds

    // Share rate (simulated)
    const shareRate = 65 // percentage

    // Return rate (users who took multiple quizzes)
    const userQuizCounts = quizzes.reduce(
      (acc: Record<string, number>, quiz) => {
        acc[quiz.userId] = (acc[quiz.userId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const returningUsers = Object.values(userQuizCounts).filter((count: number) => count > 1).length
    const totalUsers = Object.keys(userQuizCounts).length
    const returnRate = totalUsers > 0 ? Math.round((returningUsers / totalUsers) * 100) : 0

    return {
      completionRate,
      averageTimeToComplete,
      shareRate,
      returnRate,
    }
  }
}
