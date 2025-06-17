"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { usePerformanceMonitor } from "./use-performance";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


interface WebSocketState {
  connected: boolean
  connecting: boolean
  error: string | null
  userCount: number
  lastUpdate: string | null
}

interface UseWebSocketReturn extends WebSocketState {
  socket: Socket | null
  subscribe: () => void
  unsubscribe: () => void
  emitQuizTaken: (data: { personalityType: string; userId: string; userName: string }) => void
  emitGuessMade: (data: {
    challengeId: string
    userId: string
    userName: string
    guessed: string
    actual: string
  }) => void
}

export function useWebSocket(): UseWebSocketReturn {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    userCount: 0,
    lastUpdate: null,
  })

  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { recordPing, recordReconnect, recordEvent } = usePerformanceMonitor()

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    setState((prev) => ({ ...prev, connecting: true, error: null }))

    try {
      const socket = io({
        path: "/api/socket",
        transports: ["websocket", "polling"],
        timeout: 5000,
        retries: 3,
      })

      socket.on("connect", () => {
        console.log("WebSocket connected")
        setState((prev) => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
        }))

        // Start ping/pong to measure latency
        pingIntervalRef.current = setInterval(() => {
          const startTime = performance.now()
          socket.emit("ping")

          socket.once("pong", () => {
            const latency = performance.now() - startTime
            recordPing(latency)
          })
        }, 5000) // Ping every 5 seconds
      })

      socket.on("disconnect", (reason) => {
        console.log("WebSocket disconnected:", reason)
        setState((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
        }))

        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current)
        }

        // Auto-reconnect after 3 seconds
        if (reason !== "io client disconnect") {
          recordReconnect()
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, 3000)
        }
      })

      socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error)
        setState((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
          error: error.message,
        }))
      })

      socket.on("user_count", (data) => {
        setState((prev) => ({
          ...prev,
          userCount: data.count,
          lastUpdate: data.timestamp,
        }))
      })

      // Record all incoming events for performance monitoring
      socket.onAny((eventName, ...args) => {
        recordEvent({
          type: eventName,
          data: args,
          timestamp: Date.now(),
        })
      })

      socketRef.current = socket
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      setState((prev) => ({
        ...prev,
        connecting: false,
        error: "Failed to connect",
      }))
    }
  }, [recordPing, recordReconnect, recordEvent])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
    }
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    setState((prev) => ({
      ...prev,
      connected: false,
      connecting: false,
    }))
  }, [])

  const subscribe = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("subscribe_analytics")
    }
  }, [])

  const unsubscribe = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("unsubscribe_analytics")
    }
  }, [])

  const emitQuizTaken = useCallback(
    (data: { personalityType: string; userId: string; userName: string }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("quiz_taken", data)
        recordEvent({ type: "quiz_taken", data, timestamp: Date.now() })
      }
    },
    [recordEvent],
  )

  const emitGuessMade = useCallback(
    (data: { challengeId: string; userId: string; userName: string; guessed: string; actual: string }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("guess_made", data)
        recordEvent({ type: "guess_made", data, timestamp: Date.now() })
      }
    },
    [recordEvent],
  )

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    ...state,
    socket: socketRef.current,
    subscribe,
    unsubscribe,
    emitQuizTaken,
    emitGuessMade,
  }
}
