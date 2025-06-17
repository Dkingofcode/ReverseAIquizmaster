"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

const MAX_CHARACTERS = 500

export default function DescriptionForm() {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const remainingCharacters = MAX_CHARACTERS - description.length
  const isOverLimit = remainingCharacters < 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!description.trim() || isOverLimit) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: description.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze personality")
      }

      // Store the result in sessionStorage for the results page
      sessionStorage.setItem("personalityResult", JSON.stringify(data.result))

      // Navigate to results page
      router.push("/results")
    } catch (error) {
      console.error("Error submitting description:", error)
      setError("Failed to analyze your description. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-[512px] py-5">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <h1 className="text-[#131118] text-[32px] font-bold min-w-72">Describe yourself or tell a story</h1>
      </div>

      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <div className="flex flex-col min-w-40 flex-1 space-y-2">
          <Label htmlFor="description" className="text-[#131118] text-base font-medium">
            Your description
          </Label>
          <Textarea
            id="description"
            placeholder="Write a description or story about yourself. The more detailed, the better! Include your interests, hobbies, values, and what makes you unique."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-xl border border-[#dedce5] bg-white min-h-36 text-base p-[15px] placeholder:text-[#6e6388] focus:outline-none focus:ring-2 focus:ring-[#7847ea] focus:border-transparent"
            maxLength={MAX_CHARACTERS + 50}
          />
        </div>
      </div>

      <div className="px-4 flex justify-between items-center">
        <p className={`text-sm ${isOverLimit ? "text-red-500" : "text-[#6e6388]"}`}>
          {isOverLimit ? (
            <>Character limit exceeded by {Math.abs(remainingCharacters)}</>
          ) : (
            <>Characters remaining: {remainingCharacters}</>
          )}
        </p>
      </div>

      {error && (
        <div className="px-4 py-2">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <div className="flex px-4 py-3 justify-end">
        <Button
          type="submit"
          disabled={!description.trim() || isOverLimit || isSubmitting}
          className="flex min-w-[84px] items-center justify-center rounded-full h-10 px-4 bg-[#7847ea] hover:bg-[#6a3fd1] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <span className="truncate">Analyze Me</span>
          )}
        </Button>
      </div>
    </form>
  )
}
