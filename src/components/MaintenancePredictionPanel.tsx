import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Activity,
  Timer,
  Settings,
} from "lucide-react";

interface MaintenanceMetrics {
  mtbf: number; // Mean Time Between Failures (hours)
  currentUptime: number; // Current continuous operation hours
  totalOperatingHours: number;
  nextServiceDate: Date;
  daysUntilService: number;
  lastMaintenanceDate: Date;
  maintenanceScore: number; // 0-100
}

interface ComponentHealth {
  component: string;
  health: number; // 0-100
  status: "excellent" | "good" | "fair" | "replace_soon" | "critical";
  hoursRemaining: number;
  lastReplaced?: Date;
}

interface PredictiveAlert {
  id: string;
  component: string;
  severity: "info" | "warning" | "critical";
  prediction: string;
  confidence: number; // 0-100
  recommendedAction: string;
  estimatedDays: number;
}

export function MaintenancePredictionPanel() {
  const [metrics, setMetrics] = useState<MaintenanceMetrics>({
    mtbf: 2840, // hours (~118 days)
    currentUptime: 72.5,
    totalOperatingHours: 8456,
    nextServiceDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
    daysUntilService: 12,
    lastMaintenanceDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    maintenanceScore: 87,
  });

  const [componentHealth, setComponentHealth] = useState<ComponentHealth[]>([
    {
      component: "Motor Controllers",
      health: 92,
      status: "excellent",
      hoursRemaining: 3200,
      lastReplaced: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    },
    {
      component: "Joint Bearings",
      health: 78,
      status: "good",
      hoursRemaining: 1850,
      lastReplaced: new Date(Date.now() - 340 * 24 * 60 * 60 * 1000),
    },
    {
      component: "Power Supply",
      health: 95,
      status: "excellent",
      hoursRemaining: 4100,
      lastReplaced: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      component: "Cooling Fans",
      health: 68,
      status: "fair",
      hoursRemaining: 980,
      lastReplaced: new Date(Date.now() - 520 * 24 * 60 * 60 * 1000),
    },
    {
      component: "Drive Belts",
      health: 54,
      status: "replace_soon",
      hoursRemaining: 420,
      lastReplaced: new Date(Date.now() - 680 * 24 * 60 * 60 * 1000),
    },
    {
      component: "Sensors Array",
      health: 88,
      status: "good",
      hoursRemaining: 2600,
      lastReplaced: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([
    {
      id: "1",
      component: "Drive Belts",
      severity: "warning",
      prediction: "Drive belt wear detected - replacement recommended within 30 days",
      confidence: 87,
      recommendedAction: "Schedule belt replacement during next maintenance window",
      estimatedDays: 18,
    },
    {
      id: "2",
      component: "Cooling Fans",
      severity: "info",
      prediction: "Cooling fan efficiency degrading - monitor vibration levels",
      confidence: 72,
      recommendedAction: "Plan replacement in next 60 days",
      estimatedDays: 45,
    },
    {
      id: "3",
      component: "Joint Bearings",
      severity: "info",
      prediction: "Normal wear pattern detected - on schedule for maintenance",
      confidence: 91,
      recommendedAction: "Continue monitoring, no immediate action required",
      estimatedDays: 90,
    },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        currentUptime: prev.currentUptime + 0.0005556, // Add ~2 seconds in hours
        totalOperatingHours: prev.totalOperatingHours + 0.0005556,
        daysUntilService: Math.max(
          0,
          (prev.nextServiceDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        ),
      }));

      // Update component health (slow degradation)
      setComponentHealth((prev) =>
        prev.map((comp) => ({
          ...comp,
          health: Math.max(0, comp.health - (Math.random() < 0.05 ? 0.1 : 0)),
          hoursRemaining: Math.max(0, comp.hoursRemaining - 0.0005556),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 85) return "text-success";
    if (health >= 70) return "text-green-400";
    if (health >= 50) return "text-warning";
    return "text-destructive";
  };

  const getHealthBgColor = (status: ComponentHealth["status"]) => {
    switch (status) {
      case "excellent":
        return "bg-success/10 border-success/30";
      case "good":
        return "bg-green-500/10 border-green-500/30";
      case "fair":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "replace_soon":
        return "bg-warning/10 border-warning/30";
      case "critical":
        return "bg-destructive/10 border-destructive/30";
      default:
        return "bg-slate-100/80 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800";
    }
  };

  const getSeverityColor = (severity: PredictiveAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-destructive";
      case "warning":
        return "text-warning";
      case "info":
        return "text-blue-500 dark:text-blue-400";
      default:
        return "text-slate-600 dark:text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: PredictiveAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "info":
        return <Activity className="w-4 h-4 text-blue-400" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatHoursToReadable = (hours: number) => {
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    const months = Math.floor(days / 30);
    return `${months}mo`;
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-card/80 to-card/60 dark:from-card/80 dark:to-card/60 border-border/30 dark:border-border backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
          <div>
            <h3 className="font-semibold text-lg text-foreground">Predictive Maintenance</h3>
            <p className="text-xs text-muted-foreground">AI-powered failure prediction & scheduling</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={metrics.maintenanceScore >= 80 ? "default" : "secondary"}
            className={
              metrics.maintenanceScore >= 80
                ? "bg-success text-success-foreground"
                : "bg-warning text-warning-foreground"
            }
          >
            Health: {metrics.maintenanceScore}%
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <p className="text-xs text-muted-foreground">MTBF</p>
          </div>
          <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{metrics.mtbf.toLocaleString()}h</p>
          <p className="text-xs text-muted-foreground mt-1">
            ~{Math.round(metrics.mtbf / 24)} days avg
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-400" />
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          <p className="text-xl font-bold text-success">{metrics.currentUptime.toFixed(1)}h</p>
          <p className="text-xs text-muted-foreground mt-1">Current run</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-muted-foreground">Total Hours</p>
          </div>
          <p className="text-xl font-bold text-purple-400">
            {metrics.totalOperatingHours.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-muted-foreground">Next Service</p>
          </div>
          <p
            className={`text-xl font-bold ${
              metrics.daysUntilService < 7 ? "text-warning" : "text-orange-400"
            }`}
          >
            {Math.round(metrics.daysUntilService)}d
          </p>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(metrics.nextServiceDate)}</p>
        </div>
      </div>

      {/* Service Progress */}
      <div className="mb-4 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Service Interval Progress</span>
          <span className="text-sm font-mono">
            {Math.round(((30 - metrics.daysUntilService) / 30) * 100)}%
          </span>
        </div>
        <Progress value={((30 - metrics.daysUntilService) / 30) * 100} className="h-2 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Last: {formatDate(metrics.lastMaintenanceDate)}</span>
          <span>Next: {formatDate(metrics.nextServiceDate)}</span>
        </div>
      </div>

      {/* Predictive Alerts */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Predictive Alerts ({predictiveAlerts.length})
        </h4>
        <div className="space-y-2">
          {predictiveAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-semibold">{alert.component}</h5>
                    <Badge variant="outline" className="text-xs h-5">
                      {alert.confidence}% confidence
                    </Badge>
                  </div>
                  <p className={`text-xs mb-2 ${getSeverityColor(alert.severity)}`}>
                    {alert.prediction}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <Settings className="w-3 h-3 inline mr-1" />
                    {alert.recommendedAction}
                  </p>
                  <p className="text-xs text-cyan-400">
                    Estimated: {alert.estimatedDays} days remaining
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component Health */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Component Health Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {componentHealth.map((comp) => (
            <div
              key={comp.component}
              className={`p-3 rounded-lg border ${getHealthBgColor(comp.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">{comp.component}</span>
                {comp.health >= 85 ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : comp.health < 60 ? (
                  <AlertTriangle className="w-4 h-4 text-warning" />
                ) : (
                  <Activity className="w-4 h-4 text-green-400" />
                )}
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Health</span>
                  <span className={`text-sm font-bold ${getHealthColor(comp.health)}`}>
                    {comp.health.toFixed(0)}%
                  </span>
                </div>
                <Progress value={comp.health} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Est. Remaining</span>
                  <span className="font-mono font-bold">
                    {formatHoursToReadable(comp.hoursRemaining)}
                  </span>
                </div>
                {comp.lastReplaced && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Replaced</span>
                    <span className="font-mono">{formatDate(comp.lastReplaced)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
