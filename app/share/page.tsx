"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import ShareResult from "@/components/share-result"

interface ResultData {
  personalityType: string
  description: string
  traits: string[]
  imageUrl: string
  color: string
  confidence: number
  matchedKeywords: string[]
  userDescription: string
}

export default function SharePage() {
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem("personalityResult")

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult)
        setResultData(parsedResult)
      } catch (error) {
        console.error("Error parsing stored result:", error)
        router.push("/describe")
        return
      }
    } else {
      // No result found, redirect to describe page
      router.push("/describe")
      return
    }

    setLoading(false)
  }, [router])

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
              <p className="text-[#6e6388]">Loading sharing options...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!resultData) {
    return null
  }

  return (
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
        <Header />
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <ShareResult data={resultData} />
        </div>
      </div>
    </div>
  )
}
