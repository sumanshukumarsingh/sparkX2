import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ShieldAlert,
  MapPin,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ChevronRight,
} from "lucide-react";

interface SafetyAlert {
  id: string;
  type: "collision" | "fall" | "geofence" | "emergency_stop" | "overheat" | "low_battery";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
  location?: string;
}

export function SafetyAlertsPanel() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([
    {
      id: "1",
      type: "collision",
      severity: "warning",
      title: "Proximity Warning",
      description: "Object detected 0.45m ahead - reducing speed",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      acknowledged: false,
      location: "Sector B-3",
    },
    {
      id: "2",
      type: "geofence",
      severity: "warning",
      title: "Geofence Boundary",
      description: "Approaching restricted zone boundary (2.5m)",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
      location: "Lab Floor 2 - East Wing",
    },
    {
      id: "3",
      type: "emergency_stop",
      severity: "critical",
      title: "Emergency Stop Activated",
      description: "Manual emergency stop triggered by operator",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      acknowledged: true,
      location: "Lab Floor 2",
    },
  ]);

  const [stats, setStats] = useState({
    collisionWarnings: 12,
    fallDetections: 0,
    geofenceViolations: 3,
    emergencyStops: 1,
    uptimeHours: 72.5,
  });

  // Simulate new alerts occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const newAlert: SafetyAlert = {
          id: Date.now().toString(),
          type: Math.random() < 0.5 ? "collision" : "geofence",
          severity: Math.random() < 0.3 ? "critical" : "warning",
          title: Math.random() < 0.5 ? "Proximity Warning" : "Geofence Alert",
          description: Math.random() < 0.5 
            ? `Object detected ${(Math.random() * 2).toFixed(2)}m ahead`
            : "Approaching boundary zone",
          timestamp: new Date(),
          acknowledged: false,
          location: "Lab Floor 2",
        };
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
        
        if (newAlert.type === "collision") {
          setStats((prev) => ({ ...prev, collisionWarnings: prev.collisionWarnings + 1 }));
        } else if (newAlert.type === "geofence") {
          setStats((prev) => ({ ...prev, geofenceViolations: prev.geofenceViolations + 1 }));
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleClearAll = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "collision":
        return <AlertTriangle className="w-4 h-4" />;
      case "fall":
        return <AlertOctagon className="w-4 h-4" />;
      case "geofence":
        return <MapPin className="w-4 h-4" />;
      case "emergency_stop":
        return <ShieldAlert className="w-4 h-4" />;
      case "overheat":
        return <Zap className="w-4 h-4" />;
      case "low_battery":
        return <Zap className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/10 border-destructive text-destructive";
      case "warning":
        return "bg-warning/10 border-warning text-warning";
      case "info":
        return "bg-blue-500/10 border-blue-500 text-blue-400";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  const getBadgeVariant = (severity: string): "destructive" | "secondary" | "default" => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleString();
  };

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;

  return (
    <Card className="p-4 card-gradient border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Safety Alerts & Monitoring</h3>
          <p className="text-xs text-muted-foreground">
            {unacknowledgedCount > 0 
              ? `${unacknowledgedCount} unacknowledged alert${unacknowledgedCount > 1 ? "s" : ""}`
              : "All alerts acknowledged"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unacknowledgedCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Acknowledge All
            </Button>
          )}
          {criticalCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {criticalCount} Critical
            </Badge>
          )}
        </div>
      </div>

      {/* Safety Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <p className="text-xs text-muted-foreground">Collisions</p>
          </div>
          <p className="text-xl font-bold">{stats.collisionWarnings}</p>
          <p className="text-xs text-muted-foreground">Last 24h</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-4 h-4 text-success" />
            <p className="text-xs text-muted-foreground">Falls</p>
          </div>
          <p className="text-xl font-bold text-success">{stats.fallDetections}</p>
          <p className="text-xs text-muted-foreground">Last 24h</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-muted-foreground">Geofence</p>
          </div>
          <p className="text-xl font-bold">{stats.geofenceViolations}</p>
          <p className="text-xs text-muted-foreground">Violations</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            <p className="text-xs text-muted-foreground">E-Stops</p>
          </div>
          <p className="text-xl font-bold">{stats.emergencyStops}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          <p className="text-xl font-bold text-cyan-400">{stats.uptimeHours.toFixed(1)}h</p>
          <p className="text-xs text-muted-foreground">Safe operation</p>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">Recent Alerts</h4>
          <span className="text-xs text-muted-foreground">{alerts.length} total</span>
        </div>
        
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success" />
            <p className="text-sm font-semibold text-success">All Clear</p>
            <p className="text-xs text-muted-foreground">No safety alerts detected</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all ${
                  alert.acknowledged
                    ? "bg-slate-900/30 border-slate-800 opacity-60"
                    : getSeverityColor(alert.severity)
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-semibold">{alert.title}</h5>
                        {!alert.acknowledged && (
                          <Badge variant={getBadgeVariant(alert.severity)} className="text-xs h-5">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(alert.timestamp)}
                        </div>
                        {alert.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.acknowledged ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <span className="text-xs">Acknowledge</span>
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
