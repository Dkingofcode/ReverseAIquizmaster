export interface PerformanceMetrics {
  connection: {
    latency: number
    uptime: number
    reconnectCount: number
    lastReconnect: string | null
    connectionQuality: "excellent" | "good" | "fair" | "poor"
    packetLoss: number
    bandwidth: number
  }
  server: {
    responseTime: number
    errorRate: number
    throughput: number
    activeConnections: number
    memoryUsage: number
    cpuUsage: number
  }
  client: {
    renderTime: number
    memoryUsage: number
    eventProcessingTime: number
    queueSize: number
    droppedEvents: number
    fps: number
  }
  analytics: {
    updateFrequency: number
    dataFreshness: number
    processingDelay: number
    cacheHitRate: number
    queryTime: number
  }
}

export interface HealthAlert {
  id: string
  type: "warning" | "error" | "critical"
  category: "connection" | "performance" | "data" | "system"
  message: string
  timestamp: string
  resolved: boolean
  details?: Record<string, any>
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null
  private metrics: PerformanceMetrics
  private alerts: HealthAlert[] = []
  private observers: ((metrics: PerformanceMetrics) => void)[] = []
  private alertObservers: ((alert: HealthAlert) => void)[] = []
  private intervalId: NodeJS.Timeout | null = null
  private startTime: number = Date.now()
  private lastPingTime = 0
  private pingHistory: number[] = []
  private reconnectCount = 0
  private eventQueue: any[] = []
  private droppedEvents = 0
  private frameCount = 0
  private lastFrameTime = 0

  private constructor() {
    this.metrics = this.initializeMetrics()
    this.startMonitoring()
    this.setupPerformanceObserver()
  }

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor()
    }
    return this.instance
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      connection: {
        latency: 0,
        uptime: 0,
        reconnectCount: 0,
        lastReconnect: null,
        connectionQuality: "excellent",
        packetLoss: 0,
        bandwidth: 0,
      },
      server: {
        responseTime: 0,
        errorRate: 0,
        throughput: 0,
        activeConnections: 0,
        memoryUsage: 0,
        cpuUsage: 0,
      },
      client: {
        renderTime: 0,
        memoryUsage: 0,
        eventProcessingTime: 0,
        queueSize: 0,
        droppedEvents: 0,
        fps: 0,
      },
      analytics: {
        updateFrequency: 0,
        dataFreshness: 0,
        processingDelay: 0,
        cacheHitRate: 0,
        queryTime: 0,
      },
    }
  }

  private startMonitoring() {
    this.intervalId = setInterval(() => {
      this.updateMetrics()
      this.checkHealthThresholds()
      this.notifyObservers()
    }, 1000) // Update every second

    // FPS monitoring
    this.monitorFPS()
  }

  private setupPerformanceObserver() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.entryType === "navigation") {
              this.updateNavigationMetrics(entry as PerformanceNavigationTiming)
            } else if (entry.entryType === "measure") {
              this.updateCustomMetrics(entry)
            }
          })
        })

        observer.observe({ entryTypes: ["navigation", "measure"] })
      } catch (error) {
        console.warn("Performance Observer not supported:", error)
      }
    }
  }

  private monitorFPS() {
    if (typeof window !== "undefined") {
      const measureFPS = () => {
        this.frameCount++
        const now = performance.now()
        if (now - this.lastFrameTime >= 1000) {
          this.metrics.client.fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime))
          this.frameCount = 0
          this.lastFrameTime = now
        }
        requestAnimationFrame(measureFPS)
      }
      requestAnimationFrame(measureFPS)
    }
  }

  private updateMetrics() {
    const now = Date.now()

    // Update uptime
    this.metrics.connection.uptime = Math.floor((now - this.startTime) / 1000)

    // Update client memory usage
    if (typeof window !== "undefined" && "performance" in window && "memory" in performance) {
      const memory = (performance as any).memory
      this.metrics.client.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
    }

    // Update event queue size
    this.metrics.client.queueSize = this.eventQueue.length
    this.metrics.client.droppedEvents = this.droppedEvents

    // Calculate connection quality
    this.updateConnectionQuality()

    // Update analytics metrics
    this.updateAnalyticsMetrics()
  }

  private updateConnectionQuality() {
    const avgLatency =
      this.pingHistory.length > 0 ? this.pingHistory.reduce((a, b) => a + b, 0) / this.pingHistory.length : 0

    if (avgLatency < 50) {
      this.metrics.connection.connectionQuality = "excellent"
    } else if (avgLatency < 150) {
      this.metrics.connection.connectionQuality = "good"
    } else if (avgLatency < 300) {
      this.metrics.connection.connectionQuality = "fair"
    } else {
      this.metrics.connection.connectionQuality = "poor"
    }

    this.metrics.connection.latency = Math.round(avgLatency)
  }

  private updateNavigationMetrics(entry: PerformanceNavigationTiming) {
    this.metrics.server.responseTime = Math.round(entry.responseEnd - entry.requestStart)
    this.metrics.client.renderTime = Math.round(entry.loadEventEnd - entry.responseEnd)
  }

  private updateCustomMetrics(entry: PerformanceEntry) {
    if (entry.name.startsWith("analytics-")) {
      this.metrics.analytics.queryTime = Math.round(entry.duration)
    } else if (entry.name.startsWith("event-processing-")) {
      this.metrics.client.eventProcessingTime = Math.round(entry.duration)
    }
  }

  private updateAnalyticsMetrics() {
    // Simulate analytics metrics (in real app, these would come from actual measurements)
    this.metrics.analytics.updateFrequency = Math.random() * 10 + 5 // 5-15 updates/min
    this.metrics.analytics.dataFreshness = Math.random() * 30 + 10 // 10-40 seconds
    this.metrics.analytics.processingDelay = Math.random() * 100 + 50 // 50-150ms
    this.metrics.analytics.cacheHitRate = Math.random() * 20 + 80 // 80-100%
  }

  private checkHealthThresholds() {
    const thresholds = {
      latency: { warning: 200, critical: 500 },
      memoryUsage: { warning: 100, critical: 200 }, // MB
      errorRate: { warning: 5, critical: 15 }, // %
      fps: { warning: 30, critical: 15 },
      packetLoss: { warning: 1, critical: 5 }, // %
    }

    // Check latency
    if (this.metrics.connection.latency > thresholds.latency.critical) {
      this.createAlert("critical", "connection", "Critical latency detected", {
        latency: this.metrics.connection.latency,
        threshold: thresholds.latency.critical,
      })
    } else if (this.metrics.connection.latency > thresholds.latency.warning) {
      this.createAlert("warning", "connection", "High latency detected", {
        latency: this.metrics.connection.latency,
        threshold: thresholds.latency.warning,
      })
    }

    // Check memory usage
    if (this.metrics.client.memoryUsage > thresholds.memoryUsage.critical) {
      this.createAlert("critical", "performance", "Critical memory usage", {
        usage: this.metrics.client.memoryUsage,
        threshold: thresholds.memoryUsage.critical,
      })
    } else if (this.metrics.client.memoryUsage > thresholds.memoryUsage.warning) {
      this.createAlert("warning", "performance", "High memory usage", {
        usage: this.metrics.client.memoryUsage,
        threshold: thresholds.memoryUsage.warning,
      })
    }

    // Check FPS
    if (this.metrics.client.fps < thresholds.fps.critical && this.metrics.client.fps > 0) {
      this.createAlert("critical", "performance", "Critical frame rate drop", {
        fps: this.metrics.client.fps,
        threshold: thresholds.fps.critical,
      })
    } else if (this.metrics.client.fps < thresholds.fps.warning && this.metrics.client.fps > 0) {
      this.createAlert("warning", "performance", "Low frame rate", {
        fps: this.metrics.client.fps,
        threshold: thresholds.fps.warning,
      })
    }
  }

  private createAlert(
    type: HealthAlert["type"],
    category: HealthAlert["category"],
    message: string,
    details?: Record<string, any>,
  ) {
    // Check if similar alert already exists and is not resolved
    const existingAlert = this.alerts.find(
      (alert) => !alert.resolved && alert.category === category && alert.message === message,
    )

    if (existingAlert) return // Don't create duplicate alerts

    const alert: HealthAlert = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      category,
      message,
      timestamp: new Date().toISOString(),
      resolved: false,
      details,
    }

    this.alerts.unshift(alert)
    this.alertObservers.forEach((observer) => observer(alert))

    // Auto-resolve warning alerts after 30 seconds
    if (type === "warning") {
      setTimeout(() => {
        this.resolveAlert(alert.id)
      }, 30000)
    }
  }

  // Public methods
  recordPing(latency: number) {
    this.lastPingTime = Date.now()
    this.pingHistory.push(latency)
    if (this.pingHistory.length > 10) {
      this.pingHistory.shift() // Keep only last 10 pings
    }
  }

  recordReconnect() {
    this.reconnectCount++
    this.metrics.connection.reconnectCount = this.reconnectCount
    this.metrics.connection.lastReconnect = new Date().toISOString()
  }

  recordEvent(event: any) {
    const startTime = performance.now()

    if (this.eventQueue.length > 100) {
      this.droppedEvents++
      return false // Queue full, drop event
    }

    this.eventQueue.push(event)

    // Simulate event processing
    setTimeout(() => {
      this.eventQueue.shift()
      const processingTime = performance.now() - startTime
      performance.mark(`event-processing-${event.type}-start`)
      performance.mark(`event-processing-${event.type}-end`)
      performance.measure(
        `event-processing-${event.type}`,
        `event-processing-${event.type}-start`,
        `event-processing-${event.type}-end`,
      )
    }, Math.random() * 10)

    return true
  }

  updateServerMetrics(metrics: Partial<PerformanceMetrics["server"]>) {
    this.metrics.server = { ...this.metrics.server, ...metrics }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  getAlerts(): HealthAlert[] {
    return [...this.alerts]
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.resolved = true
    }
  }

  clearResolvedAlerts() {
    this.alerts = this.alerts.filter((alert) => !alert.resolved)
  }

  subscribe(observer: (metrics: PerformanceMetrics) => void) {
    this.observers.push(observer)
    return () => {
      this.observers = this.observers.filter((obs) => obs !== observer)
    }
  }

  subscribeToAlerts(observer: (alert: HealthAlert) => void) {
    this.alertObservers.push(observer)
    return () => {
      this.alertObservers = this.alertObservers.filter((obs) => obs !== observer)
    }
  }

  private notifyObservers() {
    this.observers.forEach((observer) => observer(this.metrics))
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.observers = []
    this.alertObservers = []
    PerformanceMonitor.instance = null
  }
}
