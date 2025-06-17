"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, Facebook, Twitter, MessageCircle, Mail, Users } from "lucide-react"

interface ShareResultData {
  personalityType: string
  description: string
  traits: string[]
  imageUrl: string
  color: string
  confidence: number
  matchedKeywords: string[]
  userDescription: string
}

interface ShareResultProps {
  data: ShareResultData
}

export default function ShareResult({ data }: ShareResultProps) {
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [shareId, setShareId] = useState("")

  useEffect(() => {
    // Generate a unique share ID and URL
    const id = Math.random().toString(36).substring(2, 15)
    setShareId(id)

    // Store the result data with the share ID
    const shareData = {
      id,
      personalityType: data.personalityType,
      description: data.description,
      traits: data.traits,
      confidence: data.confidence,
      userDescription: data.userDescription,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(`share_${id}`, JSON.stringify(shareData))

    // Create the shareable URL
    const url = `${window.location.origin}/challenge/${id}`
    setShareUrl(url)
  }, [data])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const shareText = `I just took a personality quiz and the AI thinks I'm "${data.personalityType}"! Can you guess what the AI thinks about me? Take the challenge:`

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)

    let shareLink = ""

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodedText} ${encodedUrl}`
        break
      case "telegram":
        shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        break
      case "email":
        shareLink = `mailto:?subject=Personality AI Challenge&body=${encodedText} ${encodedUrl}`
        break
      default:
        return
    }

    window.open(shareLink, "_blank", "width=600,height=400")
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Personality AI Challenge",
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to copy
      handleCopyLink()
    }
  }

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5">
      <div className="text-center mb-6">
        <h2 className="text-[#131118] text-[28px] font-bold px-4 pb-3 pt-5">Share Your AI Personality Guess</h2>
        <p className="text-[#131118] text-base font-normal pb-3 pt-1 px-4">
          The AI has made its guess about your personality! Share it with your friends and challenge them to guess what
          the AI thinks.
        </p>
      </div>

      {/* Share Link */}
      <div className="px-4 py-3">
        <div className="flex w-full items-stretch rounded-xl">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1 rounded-l-xl border-r-0 h-14 px-[15px] text-base text-[#131118] bg-[#f8f7fb] focus:outline-none focus:ring-2 focus:ring-[#7847ea]"
            placeholder="Generating link..."
          />
          <Button
            onClick={handleCopyLink}
            className="rounded-r-xl rounded-l-none h-14 px-4 bg-[#f1f0f4] hover:bg-[#e8e6ef] text-[#6e6388] border border-[#dedce5] border-l-0"
            variant="ghost"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </Button>
        </div>
      </div>

      {/* Quick Share Buttons */}
      <div className="px-4 py-2">
        <h3 className="text-[#131118] text-lg font-bold tracking-[-0.015em] pb-2 pt-2">Share via</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={() => handleSocialShare("twitter")}
            className="flex items-center justify-center gap-2 rounded-full h-10 px-4 bg-[#1DA1F2] hover:bg-[#1a91da] text-white text-sm font-bold"
          >
            <Twitter size={16} />
            <span className="truncate">Twitter</span>
          </Button>
          <Button
            onClick={() => handleSocialShare("facebook")}
            className="flex items-center justify-center gap-2 rounded-full h-10 px-4 bg-[#4267B2] hover:bg-[#365899] text-white text-sm font-bold"
          >
            <Facebook size={16} />
            <span className="truncate">Facebook</span>
          </Button>
          <Button
            onClick={() => handleSocialShare("whatsapp")}
            className="flex items-center justify-center gap-2 rounded-full h-10 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold"
          >
            <MessageCircle size={16} />
            <span className="truncate">WhatsApp</span>
          </Button>
          <Button
            onClick={() => handleSocialShare("email")}
            className="flex items-center justify-center gap-2 rounded-full h-10 px-4 bg-[#EA4335] hover:bg-[#d33b2c] text-white text-sm font-bold"
          >
            <Mail size={16} />
            <span className="truncate">Email</span>
          </Button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="px-4 py-2">
        <h3 className="text-[#131118] text-lg font-bold tracking-[-0.015em] pb-2">Preview</h3>
        <Card className="border border-[#dedce5] mb-4">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3" style={{ backgroundColor: `${data.color}20` }}>
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ color: data.color }}
                >
                  {data.personalityType.charAt(4)}
                </div>
              </div>
              <h4 className="font-bold text-[#131118] mb-1">{data.personalityType}</h4>
              <p className="text-sm text-[#6e6388] mb-2">Confidence: {data.confidence}%</p>
              <p className="text-xs text-[#6e6388]">Can you guess what the AI thinks about me?</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col gap-3 px-4">
        <Button
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 rounded-full h-12 px-5 bg-[#7847ea] hover:bg-[#6a3fd1] text-white text-base font-bold"
        >
          <Users size={20} />
          <span className="truncate">Challenge Friends</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/describe")}
          className="rounded-full h-12 border-[#7847ea] text-[#7847ea] hover:bg-[#7847ea] hover:text-white text-base font-bold"
        >
          Take Another Quiz
        </Button>
      </div>
    </div>
  )
}
