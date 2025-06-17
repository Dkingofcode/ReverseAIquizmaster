"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import { AnalyticsService, type AnalyticsData } from "@/lib/analytics"

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = () => {
      try {
        const data = AnalyticsService.generateAnalytics(timeRange)
        setAnalyticsData(data)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [timeRange])

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
              <p className="text-[#6e6388]">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div
        className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
        style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
      >
        <div className="flex h-full grow flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[#6e6388] mb-4">No analytics data available yet.</p>
              <button
                onClick={() => (window.location.href = "/describe")}
                className="bg-[#7847ea] hover:bg-[#6a3fd1] text-white px-6 py-3 rounded-full font-bold"
              >
                Take a Quiz to Generate Data
              </button>
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
          <AnalyticsDashboard data={analyticsData} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
        </div>
      </div>
    </div>
  )
}
