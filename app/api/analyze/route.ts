import { type NextRequest, NextResponse } from "next/server"
import { PersonalityAnalyzer } from "@/lib/personality-analyzer"

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required and must be a string" }, { status: 400 })
    }

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const analysis = PersonalityAnalyzer.analyzePersonality(description)

    return NextResponse.json({
      success: true,
      result: {
        personalityType: analysis.personalityType.name,
        description: analysis.personalityType.description,
        traits: analysis.personalityType.traits,
        imageUrl: analysis.personalityType.imageUrl,
        color: analysis.personalityType.color,
        confidence: analysis.confidence,
        matchedKeywords: analysis.matchedKeywords,
        userDescription: description,
      },
    })
  } catch (error) {
    console.error("Error analyzing personality:", error)
    return NextResponse.json({ error: "Failed to analyze personality" }, { status: 500 })
  }
}
