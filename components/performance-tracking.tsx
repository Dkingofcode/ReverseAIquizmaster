"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Wifi,
  Cpu,
  MemoryStick,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Database,
  Monitor,
  Server,
  Gauge,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react"
import { usePerformanceMonitor } from "@/hooks/use-performance"
import { formatDistanceToNow } from "date-fns"

export default function PerformanceDashboard() {
  const { metrics, alerts, isMonitoring, resolveAlert, clearResolvedAlerts } = usePerformanceMonitor()

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#7847ea]" />
          <p className="text-[#6e6388]">Initializing performance monitoring...</p>
        </CardContent>
      </Card>
    )
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "fair":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getQualityBadge = (quality: string) => {
    const colors = {
      excellent: "bg-green-100 text-green-800 border-green-200",
      good: "bg-blue-100 text-blue-800 border-blue-200",
      fair: "bg-yellow-100 text-yellow-800 border-yellow-200",
      poor: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[quality as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const unreadAlerts = alerts.filter((alert) => !alert.resolved)
  const criticalAlerts = unreadAlerts.filter((alert) => alert.type === "critical")
  const warningAlerts = unreadAlerts.filter((alert) => alert.type === "warning")

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6388]">Connection</p>
                <div className="flex items-center gap-2">
                  <Wifi className={`w-4 h-4 ${getQualityColor(metrics.connection.connectionQuality)}`} />
                  <span className="font-semibold">{metrics.connection.latency}ms</span>
                </div>
              </div>
              <Badge className={getQualityBadge(metrics.connection.connectionQuality)}>
                {metrics.connection.connectionQuality}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6388]">Memory</p>
                <div className="flex items-center gap-2">
                  <MemoryStick className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold">{metrics.client.memoryUsage}MB</span>
                </div>
              </div>
              <Progress value={Math.min((metrics.client.memoryUsage / 200) * 100, 100)} className="w-16" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6388]">Frame Rate</p>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{metrics.client.fps} FPS</span>
                </div>
              </div>
              <Badge variant={metrics.client.fps >= 30 ? "default" : "destructive"}>
                {metrics.client.fps >= 30 ? "Good" : "Low"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6e6388]">Alerts</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">{unreadAlerts.length}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {criticalAlerts.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {criticalAlerts.length}
                  </Badge>
                )}
                {warningAlerts.length > 0 && (
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                    {warningAlerts.length}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      {unreadAlerts.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Active Alerts ({unreadAlerts.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearResolvedAlerts}>
                Clear Resolved
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {unreadAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === "critical"
                      ? "bg-red-50 border-l-red-500"
                      : alert.type === "error"
                        ? "bg-red-50 border-l-red-400"
                        : "bg-yellow-50 border-l-yellow-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={alert.type === "critical" ? "destructive" : "secondary"}
                          className={alert.type === "warning" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
                        >
                          {alert.type}
                        </Badge>
                        <span className="text-sm font-medium text-[#131118]">{alert.category}</span>
                      </div>
                      <p className="text-sm text-[#6e6388] mb-1">{alert.message}</p>
                      <p className="text-xs text-[#6e6388]">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => resolveAlert(alert.id)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Metrics */}
      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="server">Server</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  Connection Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Latency</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.connection.latency}ms</span>
                    <Badge className={getQualityBadge(metrics.connection.connectionQuality)}>
                      {metrics.connection.connectionQuality}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Uptime</span>
                  <span className="font-semibold">{formatUptime(metrics.connection.uptime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Reconnects</span>
                  <span className="font-semibold">{metrics.connection.reconnectCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Packet Loss</span>
                  <span className="font-semibold">{metrics.connection.packetLoss.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Network Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Bandwidth</span>
                  <span className="font-semibold">{(metrics.connection.bandwidth / 1024).toFixed(1)} KB/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Last Reconnect</span>
                  <span className="font-semibold text-xs">
                    {metrics.connection.lastReconnect
                      ? formatDistanceToNow(new Date(metrics.connection.lastReconnect), { addSuffix: true })
                      : "Never"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-500" />
                  Client Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Memory Usage</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.client.memoryUsage}MB</span>
                    <Progress value={Math.min((metrics.client.memoryUsage / 200) * 100, 100)} className="w-16" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Frame Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.client.fps} FPS</span>
                    {metrics.client.fps >= 30 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Render Time</span>
                  <span className="font-semibold">{metrics.client.renderTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Event Processing</span>
                  <span className="font-semibold">{metrics.client.eventProcessingTime.toFixed(1)}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Event Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Queue Size</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.client.queueSize}</span>
                    <Badge variant={metrics.client.queueSize > 50 ? "destructive" : "default"}>
                      {metrics.client.queueSize > 50 ? "High" : "Normal"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Dropped Events</span>
                  <span className="font-semibold text-red-500">{metrics.client.droppedEvents}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="server" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-500" />
                  Server Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Response Time</span>
                  <span className="font-semibold">{metrics.server.responseTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Error Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.server.errorRate.toFixed(1)}%</span>
                    <Badge variant={metrics.server.errorRate > 5 ? "destructive" : "default"}>
                      {metrics.server.errorRate > 5 ? "High" : "Normal"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Throughput</span>
                  <span className="font-semibold">{metrics.server.throughput} req/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Active Connections</span>
                  <span className="font-semibold">{metrics.server.activeConnections}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-orange-500" />
                  Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">CPU Usage</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.server.cpuUsage.toFixed(1)}%</span>
                    <Progress value={metrics.server.cpuUsage} className="w-16" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Memory Usage</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.server.memoryUsage.toFixed(1)}%</span>
                    <Progress value={metrics.server.memoryUsage} className="w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-500" />
                  Data Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Update Frequency</span>
                  <span className="font-semibold">{metrics.analytics.updateFrequency.toFixed(1)}/min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Data Freshness</span>
                  <span className="font-semibold">{metrics.analytics.dataFreshness.toFixed(0)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Processing Delay</span>
                  <span className="font-semibold">{metrics.analytics.processingDelay.toFixed(0)}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  Query Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Query Time</span>
                  <span className="font-semibold">{metrics.analytics.queryTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6388]">Cache Hit Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metrics.analytics.cacheHitRate.toFixed(1)}%</span>
                    <Progress value={metrics.analytics.cacheHitRate} className="w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
