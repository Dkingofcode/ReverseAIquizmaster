import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import { AnalyticsService } from "./analytics"
import { LeaderboardService } from "./leaderboard"

export interface RealTimeEvent {
  type: "quiz_taken" | "guess_made" | "user_joined" | "analytics_update"
  data: any
  timestamp: string
  userId?: string
}

export class WebSocketServer {
  private static io: SocketIOServer | null = null
  private static connectedUsers = new Set<string>()

  static initialize(server: HTTPServer) {
    if (this.io) return this.io

    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      path: "/api/socket",
    })

    this.setupEventHandlers()
    return this.io
  }

  private static setupEventHandlers() {
    if (!this.io) return

    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`)
      this.connectedUsers.add(socket.id)

      // Send current analytics data to new connection
      this.sendAnalyticsUpdate(socket.id)

      // Send current user count
      this.broadcastUserCount()

      socket.on("subscribe_analytics", () => {
        socket.join("analytics")
        console.log(`Client ${socket.id} subscribed to analytics`)
      })

      socket.on("unsubscribe_analytics", () => {
        socket.leave("analytics")
        console.log(`Client ${socket.id} unsubscribed from analytics`)
      })

      socket.on("quiz_taken", (data) => {
        this.handleQuizTaken(data)
      })

      socket.on("guess_made", (data) => {
        this.handleGuessMade(data)
      })

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`)
        this.connectedUsers.delete(socket.id)
        this.broadcastUserCount()
      })

      socket.on("ping", () => {
        socket.emit("pong")
      })
    })
  }

  static broadcastEvent(event: RealTimeEvent) {
    if (!this.io) return

    this.io.to("analytics").emit("real_time_event", event)
    console.log(`Broadcasting event: ${event.type}`)
  }

  static broadcastAnalyticsUpdate(timeRange: "7d" | "30d" | "90d" | "all" = "30d") {
    if (!this.io) return

    try {
      const analyticsData = AnalyticsService.generateAnalytics(timeRange)
      const event: RealTimeEvent = {
        type: "analytics_update",
        data: analyticsData,
        timestamp: new Date().toISOString(),
      }

      this.io.to("analytics").emit("analytics_update", event)
      console.log("Broadcasting analytics update")
    } catch (error) {
      console.error("Error broadcasting analytics update:", error)
    }
  }

  private static sendAnalyticsUpdate(socketId: string) {
    if (!this.io) return

    try {
      const analyticsData = AnalyticsService.generateAnalytics("30d")
      const event: RealTimeEvent = {
        type: "analytics_update",
        data: analyticsData,
        timestamp: new Date().toISOString(),
      }

      this.io.to(socketId).emit("analytics_update", event)
    } catch (error) {
      console.error("Error sending analytics update:", error)
    }
  }

  private static broadcastUserCount() {
    if (!this.io) return

    this.io.emit("user_count", {
      count: this.connectedUsers.size,
      timestamp: new Date().toISOString(),
    })
  }

  private static handleQuizTaken(data: any) {
    try {
      // Record the quiz in analytics
      AnalyticsService.recordQuizTaken(data.personalityType, data.userId)

      const event: RealTimeEvent = {
        type: "quiz_taken",
        data: {
          personalityType: data.personalityType,
          userId: data.userId,
          userName: data.userName,
        },
        timestamp: new Date().toISOString(),
        userId: data.userId,
      }

      this.broadcastEvent(event)

      // Broadcast updated analytics
      setTimeout(() => {
        this.broadcastAnalyticsUpdate()
      }, 1000)
    } catch (error) {
      console.error("Error handling quiz taken:", error)
    }
  }

  private static handleGuessMade(data: any) {
    try {
      // Record the guess in leaderboard
      LeaderboardService.recordGuess(data.challengeId, data.userId, data.userName, data.guessed, data.actual)

      const event: RealTimeEvent = {
        type: "guess_made",
        data: {
          challengeId: data.challengeId,
          userId: data.userId,
          userName: data.userName,
          guessed: data.guessed,
          actual: data.actual,
          correct: data.guessed === data.actual,
        },
        timestamp: new Date().toISOString(),
        userId: data.userId,
      }

      this.broadcastEvent(event)

      // Broadcast updated analytics
      setTimeout(() => {
        this.broadcastAnalyticsUpdate()
      }, 1000)
    } catch (error) {
      console.error("Error handling guess made:", error)
    }
  }

  static getConnectedUserCount(): number {
    return this.connectedUsers.size
  }
}
