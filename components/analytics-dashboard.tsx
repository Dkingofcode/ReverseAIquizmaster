"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  Share2,
  Award,
  Activity,
  Calendar,
  Zap,
} from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics"
import LineChart from "@/components/charts/line-chart"
import BarChart from "@/components/charts/bar-chart"
import PieChart from "@/components/charts/pie-chart"
import RealTimeAnalytics from "@/components/real-time";

interface AnalyticsDashboardProps {
  data: AnalyticsData
  timeRange: "7d" | "30d" | "90d" | "all"
  onTimeRangeChange: (range: "7d" | "30d" | "90d" | "all") => void
}

export default function AnalyticsDashboard({ data, timeRange, onTimeRangeChange }: AnalyticsDashboardProps) {
  const timeRangeOptions = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "all", label: "All Time" },
  ]

  return (
    <div className="w-full max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#131118] mb-2">Analytics Dashboard</h1>
          <p className="text-[#6e6388] text-lg">Real-time insights into personality quiz performance</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeRange === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeRangeChange(option.value as any)}
              className={
                timeRange === option.value
                  ? "bg-[#7847ea] hover:bg-[#6a3fd1]"
                  : "border-[#7847ea] text-[#7847ea] hover:bg-[#7847ea] hover:text-white"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Real-time Analytics Section */}
      <RealTimeAnalytics timeRange={timeRange} />

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{data.overview.totalUsers}</div>
            <div className="text-sm text-[#6e6388]">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{data.overview.totalGuesses}</div>
            <div className="text-sm text-[#6e6388]">Total Guesses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{data.overview.totalQuizzes}</div>
            <div className="text-sm text-[#6e6388]">Quizzes Taken</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{data.overview.averageAccuracy}%</div>
            <div className="text-sm text-[#6e6388]">Avg Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{data.overview.activeUsers}</div>
            <div className="text-sm text-[#6e6388]">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#131118]">{data.overview.retentionRate}%</div>
            <div className="text-sm text-[#6e6388]">Retention</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Personality Trends</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personality Type Popularity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Personality Type Popularity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={data.personalityTrends.map((trend) => ({
                    name: trend.type.replace("The ", ""),
                    value: trend.count,
                  }))}
                  color="#7847ea"
                />
              </CardContent>
            </Card>

            {/* Personality Type Difficulty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Guessing Difficulty by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={data.personalityTrends.map((trend) => ({
                    name: trend.type.replace("The ", ""),
                    value: trend.accuracy,
                  }))}
                  color="#10b981"
                />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Personality Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Personality Type Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.personalityTrends
                  .sort((a, b) => b.count - a.count)
                  .map((trend) => (
                    <div key={trend.type} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <div className="font-semibold text-[#131118]">{trend.type}</div>
                        <div className="text-sm text-[#6e6388]">
                          {trend.count} assignments • {trend.percentage}% of total
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{trend.accuracy}% accuracy</div>
                          <div className="text-xs text-[#6e6388]">Guessing rate</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {trend.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${trend.trend > 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {Math.abs(trend.trend)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Daily Activity Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={data.engagementMetrics.dailyActive.map((day) => ({
                    name: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                    value: day.guesses,
                  }))}
                  color="#3b82f6"
                />
              </CardContent>
            </Card>

            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Activity by Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={data.engagementMetrics.hourlyDistribution.map((hour) => ({
                    name: `${hour.hour}:00`,
                    value: hour.activity,
                  }))}
                  color="#f59e0b"
                />
              </CardContent>
            </Card>
          </div>

          {/* Streak Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                User Streak Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={data.engagementMetrics.streakDistribution.map((streak) => ({
                  name: `${streak.streakLength}${streak.streakLength === 11 ? "+" : streak.streakLength === 1 ? "-2" : streak.streakLength === 3 ? "-5" : "-10"} streak`,
                  value: streak.users,
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Accuracy Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Accuracy Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={data.accuracyTrends.map((trend) => ({
                  name: new Date(trend.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                  value: trend.accuracy,
                }))}
                color="#10b981"
              />
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topPerformers.map((performer) => (
                  <div key={performer.user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7847ea] text-white flex items-center justify-center text-sm font-bold">
                        {performer.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-[#131118]">{performer.user.name}</div>
                        <div className="text-sm text-[#6e6388]">
                          {performer.user.correctGuesses}/{performer.user.totalGuesses} correct
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#131118]">{performer.user.accuracy}%</div>
                      <div className="flex items-center gap-1">
                        {performer.improvement > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${performer.improvement > 0 ? "text-green-500" : "text-red-500"}`}>
                          {Math.abs(performer.improvement)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Challenge Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#131118]">{data.challengeMetrics.completionRate}%</div>
                <div className="text-sm text-[#6e6388]">Completion Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#131118]">{data.challengeMetrics.averageTimeToComplete}s</div>
                <div className="text-sm text-[#6e6388]">Avg Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Share2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#131118]">{data.challengeMetrics.shareRate}%</div>
                <div className="text-sm text-[#6e6388]">Share Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#131118]">{data.challengeMetrics.returnRate}%</div>
                <div className="text-sm text-[#6e6388]">Return Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">Most Popular Personality Type</h4>
                  <p className="text-blue-800 text-sm">
                    "{data.personalityTrends.sort((a, b) => b.count - a.count)[0]?.type}" is the most commonly assigned
                    personality type, representing{" "}
                    {data.personalityTrends.sort((a, b) => b.count - a.count)[0]?.percentage}% of all results.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2">Easiest to Guess</h4>
                  <p className="text-green-800 text-sm">
                    "{data.personalityTrends.sort((a, b) => b.accuracy - a.accuracy)[0]?.type}" has the highest guessing
                    accuracy at {data.personalityTrends.sort((a, b) => b.accuracy - a.accuracy)[0]?.accuracy}%, making
                    it the most predictable personality type.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-900 mb-2">Peak Activity Time</h4>
                  <p className="text-yellow-800 text-sm">
                    Most users are active around{" "}
                    {data.engagementMetrics.hourlyDistribution.sort((a, b) => b.activity - a.activity)[0]?.hour}:00,
                    suggesting this is the optimal time for engagement campaigns.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-900 mb-2">User Retention</h4>
                  <p className="text-purple-800 text-sm">
                    {data.overview.retentionRate}% of users return to take multiple quizzes, indicating strong
                    engagement with the platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
