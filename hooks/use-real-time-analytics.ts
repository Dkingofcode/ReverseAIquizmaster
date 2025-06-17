"use client"

import { useEffect, useState, useCallback } from "react"
import { useWebSocket } from "./use-websocket"
import type { AnalyticsData, RealTimeEvent } from "@/lib/analytics"

interface RealTimeAnalyticsState {
  data: AnalyticsData | null
  events: RealTimeEvent[]
  loading: boolean
  lastUpdate: string | null
  isLive: boolean
}

interface UseRealTimeAnalyticsReturn extends RealTimeAnalyticsState {
  refreshData: () => void
  toggleLive: () => void
  clearEvents: () => void
}

export function useRealTimeAnalytics(timeRange: "7d" | "30d" | "90d" | "all" = "30d"): UseRealTimeAnalyticsReturn {
  const [state, setState] = useState<RealTimeAnalyticsState>({
    data: null,
    events: [],
    loading: true,
    lastUpdate: null,
    isLive: true,
  })

  const { socket, connected, subscribe, unsubscribe } = useWebSocket()

  const refreshData = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }))
    // Trigger a manual refresh - in a real app this would call the analytics API
    if (socket?.connected) {
      socket.emit("request_analytics_update", { timeRange })
    }
  }, [socket, timeRange])

  const toggleLive = useCallback(() => {
    setState((prev) => {
      const newIsLive = !prev.isLive
      if (newIsLive && connected) {
        subscribe()
      } else {
        unsubscribe()
      }
      return { ...prev, isLive: newIsLive }
    })
  }, [connected, subscribe, unsubscribe])

  const clearEvents = useCallback(() => {
    setState((prev) => ({ ...prev, events: [] }))
  }, [])

  useEffect(() => {
    if (!socket || !connected) return

    if (state.isLive) {
      subscribe()
    }

    const handleAnalyticsUpdate = (event: RealTimeEvent) => {
      setState((prev) => ({
        ...prev,
        data: event.data,
        loading: false,
        lastUpdate: event.timestamp,
      }))
    }

    const handleRealTimeEvent = (event: RealTimeEvent) => {
      setState((prev) => ({
        ...prev,
        events: [event, ...prev.events.slice(0, 49)], // Keep last 50 events
      }))
    }

    socket.on("analytics_update", handleAnalyticsUpdate)
    socket.on("real_time_event", handleRealTimeEvent)

    return () => {
      socket.off("analytics_update", handleAnalyticsUpdate)
      socket.off("real_time_event", handleRealTimeEvent)
    }
  }, [socket, connected, state.isLive, subscribe])

  return {
    ...state,
    refreshData,
    toggleLive,
    clearEvents,
  }
}
