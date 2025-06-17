import { personalityTypes, type PersonalityType } from "./personality-type"

interface AnalysisResult {
  personalityType: PersonalityType
  confidence: number
  matchedKeywords: string[]
}

export class PersonalityAnalyzer {
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  private static calculateKeywordMatches(
    description: string,
    keywords: string[],
  ): {
    matches: string[]
    score: number
  } {
    const normalizedDescription = this.normalizeText(description)
    const words = normalizedDescription.split(" ")

    const matches: string[] = []
    let score = 0

    keywords.forEach((keyword) => {
      const keywordWords = keyword.split(" ")

      if (keywordWords.length === 1) {
        // Single word keyword
        if (words.includes(keyword)) {
          matches.push(keyword)
          score += 1
        }
        // Check for partial matches (e.g., "create" matches "creative")
        else if (words.some((word) => word.includes(keyword) || keyword.includes(word))) {
          matches.push(keyword)
          score += 0.7
        }
      } else {
        // Multi-word keyword
        if (normalizedDescription.includes(keyword)) {
          matches.push(keyword)
          score += 1.5 // Multi-word matches are weighted higher
        }
      }
    })

    return { matches, score }
  }

  private static calculateSentimentScore(description: string): number {
    const positiveWords = [
      "love",
      "enjoy",
      "passionate",
      "excited",
      "amazing",
      "wonderful",
      "great",
      "fantastic",
      "awesome",
      "brilliant",
    ]
    const negativeWords = ["hate", "dislike", "boring", "terrible", "awful", "bad", "worst", "horrible"]

    const normalizedDescription = this.normalizeText(description)
    const words = normalizedDescription.split(" ")

    let positiveCount = 0
    let negativeCount = 0

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveCount++
      if (negativeWords.includes(word)) negativeCount++
    })

    return (positiveCount - negativeCount) / words.length
  }

  public static analyzePersonality(description: string): AnalysisResult {
    if (!description.trim()) {
      // Return default personality for empty descriptions
      return {
        personalityType: personalityTypes[0],
        confidence: 0,
        matchedKeywords: [],
      }
    }

    const results: Array<{
      personality: PersonalityType
      score: number
      matches: string[]
    }> = []

    // Analyze each personality type
    personalityTypes.forEach((personality) => {
      const { matches, score } = this.calculateKeywordMatches(description, personality.keywords)

      // Apply sentiment bonus
      const sentimentScore = this.calculateSentimentScore(description)
      const sentimentBonus = sentimentScore > 0 ? sentimentScore * 2 : 0

      // Apply length bonus (longer descriptions get slight bonus)
      const lengthBonus = Math.min(description.length / 1000, 0.5)

      const finalScore = score + sentimentBonus + lengthBonus

      results.push({
        personality,
        score: finalScore,
        matches,
      })
    })

    // Sort by score and get the best match
    results.sort((a, b) => b.score - a.score)
    const bestMatch = results[0]

    // Calculate confidence based on score difference
    const secondBest = results[1]
    const scoreDifference = bestMatch.score - (secondBest?.score || 0)
    const confidence = Math.min(Math.max((scoreDifference / bestMatch.score) * 100, 20), 95)

    return {
      personalityType: bestMatch.personality,
      confidence: Math.round(confidence),
      matchedKeywords: bestMatch.matches,
    }
  }

  public static getRandomPersonality(): PersonalityType {
    const randomIndex = Math.floor(Math.random() * personalityTypes.length)
    return personalityTypes[randomIndex]
  }

  public static getAllPersonalityTypes(): PersonalityType[] {
    return personalityTypes
  }
}
