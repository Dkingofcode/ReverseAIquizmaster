export interface LeaderboardEntry {
  id: string
  name: string
  totalGuesses: number
  correctGuesses: number
  accuracy: number
  streak: number
  maxStreak: number
  lastActive: string
  avatar?: string
}

export interface GuessResult {
  challengeId: string
  userId: string
  userName: string
  guessed: string
  actual: string
  correct: boolean
  timestamp: string
}

export class LeaderboardService {
  private static readonly LEADERBOARD_KEY = "personality_leaderboard"
  private static readonly GUESSES_KEY = "personality_guesses"

  static getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(this.LEADERBOARD_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading leaderboard:", error)
      return []
    }
  }

  static saveLeaderboard(leaderboard: LeaderboardEntry[]): void {
    try {
      localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(leaderboard))
    } catch (error) {
      console.error("Error saving leaderboard:", error)
    }
  }

  static getGuessHistory(): GuessResult[] {
    try {
      const data = localStorage.getItem(this.GUESSES_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading guess history:", error)
      return []
    }
  }

  static saveGuessHistory(guesses: GuessResult[]): void {
    try {
      localStorage.setItem(this.GUESSES_KEY, JSON.stringify(guesses))
    } catch (error) {
      console.error("Error saving guess history:", error)
    }
  }

  static recordGuess(challengeId: string, userId: string, userName: string, guessed: string, actual: string): void {
    const correct = guessed === actual
    const timestamp = new Date().toISOString()

    // Record the guess
    const guesses = this.getGuessHistory()
    const newGuess: GuessResult = {
      challengeId,
      userId,
      userName,
      guessed,
      actual,
      correct,
      timestamp,
    }
    guesses.push(newGuess)
    this.saveGuessHistory(guesses)

    // Update leaderboard
    this.updateLeaderboard(userId, userName, correct)
  }

  private static updateLeaderboard(userId: string, userName: string, correct: boolean): void {
    const leaderboard = this.getLeaderboard()
    let entry = leaderboard.find((e) => e.id === userId)

    if (!entry) {
      entry = {
        id: userId,
        name: userName,
        totalGuesses: 0,
        correctGuesses: 0,
        accuracy: 0,
        streak: 0,
        maxStreak: 0,
        lastActive: new Date().toISOString(),
      }
      leaderboard.push(entry)
    }

    // Update stats
    entry.totalGuesses += 1
    entry.lastActive = new Date().toISOString()

    if (correct) {
      entry.correctGuesses += 1
      entry.streak += 1
      entry.maxStreak = Math.max(entry.maxStreak, entry.streak)
    } else {
      entry.streak = 0
    }

    entry.accuracy = Math.round((entry.correctGuesses / entry.totalGuesses) * 100)

    this.saveLeaderboard(leaderboard)
  }

  static getTopPlayers(limit = 10): LeaderboardEntry[] {
    const leaderboard = this.getLeaderboard()
    return leaderboard
      .filter((entry) => entry.totalGuesses >= 3) // Minimum 3 guesses to appear on leaderboard
      .sort((a, b) => {
        // Sort by accuracy first, then by total correct guesses
        if (a.accuracy !== b.accuracy) {
          return b.accuracy - a.accuracy
        }
        return b.correctGuesses - a.correctGuesses
      })
      .slice(0, limit)
  }

  static getUserStats(userId: string): LeaderboardEntry | null {
    const leaderboard = this.getLeaderboard()
    return leaderboard.find((entry) => entry.id === userId) || null
  }

  static getUserRank(userId: string): number {
    const topPlayers = this.getTopPlayers(1000) // Get all players
    const userIndex = topPlayers.findIndex((entry) => entry.id === userId)
    return userIndex === -1 ? -1 : userIndex + 1
  }

  static getRecentGuesses(limit = 20): GuessResult[] {
    const guesses = this.getGuessHistory()
    return guesses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit)
  }

  static getPersonalityTypeStats(): Record<string, { total: number; correct: number; accuracy: number }> {
    const guesses = this.getGuessHistory()
    const stats: Record<string, { total: number; correct: number }> = {}

    guesses.forEach((guess) => {
      if (!stats[guess.actual]) {
        stats[guess.actual] = { total: 0, correct: 0 }
      }
      stats[guess.actual].total += 1
      if (guess.correct) {
        stats[guess.actual].correct += 1
      }
    })

    // Calculate accuracy
    const result: Record<string, { total: number; correct: number; accuracy: number }> = {}
    Object.entries(stats).forEach(([type, data]) => {
      result[type] = {
        ...data,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      }
    })

    return result
  }
}
