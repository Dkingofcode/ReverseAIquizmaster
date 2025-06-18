"use client"

import { useRealTimeAnalytics } from "@/hooks/use-real-time-analytics"
import { useWebSocket } from "@/hooks/use-websocket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, WifiOff, Play, Pause, RefreshCw, Users, Activity, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PerformanceDashboard from "./performance-tracking";
import { RealTimeEvent } from "@/lib/analytics"

interface RealTimeAnalyticsProps {
  timeRange: "7d" | "30d" | "90d" | "all"
}

export default function RealTimeAnalytics({ timeRange }: RealTimeAnalyticsProps) {
  const { connected, connecting, error, userCount } = useWebSocket()
  
  const { data, events, loading, lastUpdate, isLive, refreshData, toggleLive, clearEvents } =
    useRealTimeAnalytics(timeRange)

  const getConnectionStatus = () => {
    if (connecting) return { icon: RefreshCw, color: "text-yellow-500", text: "Connecting..." }
    if (connected) return { icon: Wifi, color: "text-green-500", text: "Connected" }
    return { icon: WifiOff, color: "text-red-500", text: "Disconnected" }
  }

  const status = getConnectionStatus()
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Connection Status Bar */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-5 h-5 ${status.color} ${connecting ? "animate-spin" : ""}`} />
              <div>
                <div className="font-semibold text-[#131118]">Real-time Analytics</div>
                <div className="text-sm text-[#6e6388]">{status.text}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {connected && (
                <div className="flex items-center gap-2 text-sm text-[#6e6388]">
                  <Users className="w-4 h-4" />
                  <span>{userCount} online</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLive}
                  disabled={!connected}
                  className={isLive ? "bg-green-50 border-green-200 text-green-700" : ""}
                >
                  {isLive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isLive ? "Live" : "Paused"}
                </Button>

                <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Connection error: {error}
            </div>
          )}

          {lastUpdate && (
            <div className="mt-2 text-xs text-[#6e6388] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated: {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance and Activity Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity">Live Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          {/* Live Activity Feed */}
          {connected && isLive && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Live Activity Feed
                    {events.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {events.length}
                      </Badge>
                    )}
                  </CardTitle>
                  {events.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearEvents}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="text-center py-8 text-[#6e6388]">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Waiting for live activity...</p>
                  </div>
                ) : (
                  events.map((event: RealTimeEvent, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-l-4 border-l-blue-500"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {event.type === "quiz_taken" && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {event.type === "guess_made" && (
                          <div
                            className={`w-4 h-4 rounded-full ${event.data.correct ? "bg-green-500" : "bg-red-500"}`}
                          />
                        )}
                        {event.type === "user_joined" && <Users className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#131118]">
                            {event.type === "quiz_taken" && "Quiz Completed"}
                            {event.type === "guess_made" && "Personality Guess"}
                            {event.type === "user_joined" && "User Joined"}
                          </span>
                          <Badge
                            variant={
                              event.type === "quiz_taken"
                                ? "default"
                                : event.type === "guess_made"
                                  ? event.data.correct
                                    ? "default"
                                    : "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {event.type === "quiz_taken" && "New"}
                            {event.type === "guess_made" && (event.data.correct ? "Correct" : "Wrong")}
                            {event.type === "user_joined" && "Active"}
                          </Badge>
                        </div>
                        <div className="text-sm text-[#6e6388]">
                          {event.type === "quiz_taken" &&
                            `${event.data.userName || "Anonymous"} got "${event.data.personalityType}"`}
                          {event.type === "guess_made" &&
                            `${event.data.userName} guessed "${event.data.guessed}" (actual: "${event.data.actual}")`}
                          {event.type === "user_joined" && `${event.data.userName} joined the platform`}
                        </div>
                        <div className="text-xs text-[#6e6388] mt-1">
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
