"use client"

import { useEffect, useState, useCallback } from "react"
import { PerformanceMonitor, type PerformanceMetrics, type HealthAlert } from "@/lib/performance"

interface UsePerformanceMonitorReturn {
  metrics: PerformanceMetrics | null
  alerts: HealthAlert[]
  isMonitoring: boolean
  resolveAlert: (alertId: string) => void
  clearResolvedAlerts: () => void
  recordPing: (latency: number) => void
  recordReconnect: () => void
  recordEvent: (event: any) => boolean
}

export function usePerformanceMonitor(): UsePerformanceMonitorReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()
    setIsMonitoring(true)

    // Subscribe to metrics updates
    const unsubscribeMetrics = monitor.subscribe((newMetrics) => {
      setMetrics(newMetrics)
    })

    // Subscribe to alerts
    const unsubscribeAlerts = monitor.subscribeToAlerts((alert) => {
      setAlerts((prev) => [alert, ...prev.slice(0, 49)]) // Keep last 50 alerts
    })

    // Initial data
    setMetrics(monitor.getMetrics())
    setAlerts(monitor.getAlerts())

    return () => {
      unsubscribeMetrics()
      unsubscribeAlerts()
      setIsMonitoring(false)
    }
  }, [])

  const resolveAlert = useCallback((alertId: string) => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.resolveAlert(alertId)
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
  }, [])

  const clearResolvedAlerts = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.clearResolvedAlerts()
    setAlerts((prev) => prev.filter((alert) => !alert.resolved))
  }, [])

  const recordPing = useCallback((latency: number) => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.recordPing(latency)
  }, [])

  const recordReconnect = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.recordReconnect()
  }, [])

  const recordEvent = useCallback((event: any) => {
    const monitor = PerformanceMonitor.getInstance()
    return monitor.recordEvent(event)
  }, [])

  return {
    metrics,
    alerts,
    isMonitoring,
    resolveAlert,
    clearResolvedAlerts,
    recordPing,
    recordReconnect,
    recordEvent,
  }
}
