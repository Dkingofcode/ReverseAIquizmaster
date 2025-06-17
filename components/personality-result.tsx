"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Check, BarChart3 } from "lucide-react"
import Link from "next/link"

interface PersonalityResultData {
  personalityType: string
  description: string
  traits: string[]
  imageUrl: string
  color: string
  confidence: number
  matchedKeywords: string[]
  userDescription: string
}

interface PersonalityResultProps {
  data: PersonalityResultData
}

export default function PersonalityResult({ data }: PersonalityResultProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareText = `I just discovered I'm "${data.personalityType}" on PersonaMatch! ${data.description}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My PersonaMatch Result",
          text: shareText,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5">
      <div className="text-center mb-6">
        <h2 className="text-[#131118] text-[28px] font-bold px-4 pb-3 pt-5">The AI's Guess</h2>
        <p className="text-[#131118] text-base font-normal pb-3 pt-1 px-4">
          The AI has analyzed your description and believes you are...
        </p>
      </div>

      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl xl:flex-row xl:items-start">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl mb-4 xl:mb-0 xl:mr-4"
              style={{ backgroundImage: `url("${data.imageUrl}")` }}
            />
            <div className="flex w-full min-w-72 flex-col justify-center gap-1 xl:px-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[#131118] text-lg font-bold tracking-[-0.015em]">{data.personalityType}</h3>
                <div className="flex items-center gap-1 text-xs text-[#6e6388]">
                  <BarChart3 size={12} />
                  <span>{data.confidence}% match</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {data.traits.map((trait, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: `${data.color}20`, color: data.color }}
                  >
                    {trait}
                  </Badge>
                ))}
              </div>

              <p className="text-[#6e6388] text-base font-normal leading-relaxed">{data.description}</p>

              {data.matchedKeywords.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-[#6e6388] mb-1">Key traits identified:</p>
                  <div className="flex flex-wrap gap-1">
                    {data.matchedKeywords.slice(0, 5).map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h3 className="text-[#131118] text-lg font-bold tracking-[-0.015em] px-4 pb-2 pt-4">Your Description</h3>
        <Card className="border-0 bg-[#f8f7fb]">
          <CardContent className="p-4">
            <p className="text-[#131118] text-base font-normal leading-relaxed">{data.userDescription}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 px-4">
        <Link href="/share">
          <Button className="flex-1 flex items-center justify-center gap-2 rounded-full h-12 bg-green-600 hover:bg-green-700 text-white text-sm font-bold">
            <Share2 size={16} />
            Share & Challenge
          </Button>
        </Link>
        <Button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 rounded-full h-12 bg-[#7847ea] hover:bg-[#6a3fd1] text-white text-sm font-bold"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied!
            </>
          ) : (
            <>
              <Share2 size={16} />
              Quick Share
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full h-12 border-[#7847ea] text-[#7847ea] hover:bg-[#7847ea] hover:text-white text-sm font-bold"
          onClick={() => (window.location.href = "/describe")}
        >
          Take Another Quiz
        </Button>
      </div>
    </div>
  )
}
