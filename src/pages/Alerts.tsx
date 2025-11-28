import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: string;
  robotId: string;
  robotName: string;
  severity: "critical" | "warning" | "info";
  type: "battery" | "temperature" | "offline" | "error" | "maintenance";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

// Mock alerts data
const generateMockAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: "ALERT-001",
      robotId: "AURA-004",
      robotName: "Unit Delta",
      severity: "critical",
      type: "error",
      message: "Robot entering error state - system malfunction detected",
      timestamp: new Date(now.getTime() - 5 * 60000),
      acknowledged: false,
    },
    {
      id: "ALERT-002",
      robotId: "AURA-024",
      robotName: "Unit X-Ray",
      severity: "critical",
      type: "temperature",
      message: "Temperature critically high (69°C) - thermal shutdown imminent",
      timestamp: new Date(now.getTime() - 8 * 60000),
      acknowledged: false,
    },
    {
      id: "ALERT-003",
      robotId: "AURA-014",
      robotName: "Unit November",
      severity: "warning",
      type: "temperature",
      message: "Temperature warning (71°C) - cooling system may be faulty",
      timestamp: new Date(now.getTime() - 15 * 60000),
      acknowledged: false,
    },
    {
      id: "ALERT-004",
      robotId: "AURA-006",
      robotName: "Unit Foxtrot",
      severity: "warning",
      type: "offline",
      message: "Unit offline for 2+ hours - requires manual intervention",
      timestamp: new Date(now.getTime() - 30 * 60000),
      acknowledged: true,
      acknowledgedAt: new Date(now.getTime() - 20 * 60000),
      acknowledgedBy: "John Doe",
    },
    {
      id: "ALERT-005",
      robotId: "AURA-012",
      robotName: "Unit Lima",
      severity: "warning",
      type: "battery",
      message: "Battery low (28%) - schedule charging immediately",
      timestamp: new Date(now.getTime() - 45 * 60000),
      acknowledged: false,
    },
    {
      id: "ALERT-006",
      robotId: "AURA-019",
      robotName: "Unit Sierra",
      severity: "critical",
      type: "offline",
      message: "Device offline for 3+ hours - possible hardware failure",
      timestamp: new Date(now.getTime() - 60 * 60000),
      acknowledged: true,
      acknowledgedAt: new Date(now.getTime() - 50 * 60000),
      acknowledgedBy: "John Doe",
    },
    {
      id: "ALERT-007",
      robotId: "AURA-002",
      robotName: "Unit Beta",
      severity: "info",
      type: "maintenance",
      message: "Scheduled maintenance due - last serviced 90 days ago",
      timestamp: new Date(now.getTime() - 120 * 60000),
      acknowledged: true,
      acknowledgedAt: new Date(now.getTime() - 110 * 60000),
      acknowledgedBy: "John Doe",
    },
  ];
};

const AlertsPage = () => {
  const navigate = useNavigate();
  const [allAlerts, setAllAlerts] = useState<Alert[]>(generateMockAlerts());
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("unacknowledged");

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
      if (typeFilter !== "all" && alert.type !== typeFilter) return false;
      if (statusFilter === "unacknowledged" && alert.acknowledged) return false;
      if (statusFilter === "acknowledged" && !alert.acknowledged) return false;
      return true;
    });
  }, [allAlerts, severityFilter, typeFilter, statusFilter]);

  // Sort by timestamp (newest first)
  const sortedAlerts = [...filteredAlerts].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "info":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <Clock className="w-5 h-5" />;
      case "info":
        return <Eye className="w-5 h-5" />;
      default:
        return <EyeOff className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "battery":
        return "Battery Alert";
      case "temperature":
        return "Temperature Alert";
      case "offline":
        return "Offline Alert";
      case "error":
        return "System Error";
      case "maintenance":
        return "Maintenance Due";
      default:
        return type;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAllAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              acknowledged: true,
              acknowledgedAt: new Date(),
              acknowledgedBy: "John Doe", // Mock user
            }
          : alert
      )
    );
  };

  const handleDismiss = (alertId: string) => {
    setAllAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const handleClearAll = () => {
    setAllAlerts((prev) => prev.filter((alert) => !alert.acknowledged));
  };

  const unacknowledgedCount = allAlerts.filter((a) => !a.acknowledged).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Alert Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time system alerts and notifications
          </p>
        </div>
        <Badge className="bg-destructive text-destructive-foreground hidden sm:flex">
          {unacknowledgedCount} Active
        </Badge>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Alerts</span>
            <p className="text-xl sm:text-2xl font-bold">{allAlerts.length}</p>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-destructive">Unacknowledged</span>
            <p className="text-xl sm:text-2xl font-bold text-destructive">{unacknowledgedCount}</p>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Critical</span>
            <p className="text-xl sm:text-2xl font-bold text-destructive">
              {allAlerts.filter((a) => a.severity === "critical").length}
            </p>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Acknowledged</span>
            <p className="text-xl sm:text-2xl font-bold text-success">
              {allAlerts.filter((a) => a.acknowledged).length}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 card-gradient border border-border rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Severity</label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleClearAll}
            variant="outline"
            className="h-9 text-xs sm:text-sm self-end"
          >
            Clear Acknowledged
          </Button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {sortedAlerts.length > 0 ? (
          sortedAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-4 card-gradient border transition-all ${
                alert.acknowledged ? "border-border opacity-75" : "border-border hover:border-primary"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Severity Icon */}
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                  {getSeverityIcon(alert.severity)}
                </div>

                {/* Alert Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-base">{alert.robotName}</h3>
                        <Badge className="text-xs">{alert.robotId}</Badge>
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {getTypeLabel(alert.type)}
                      </p>
                    </div>
                    {alert.acknowledged && (
                      <Badge className="bg-success text-success-foreground text-xs flex-shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Acknowledged
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-foreground mb-3">{alert.message}</p>

                  {/* Timestamp & Acknowledgment Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(alert.timestamp)}</span>
                      {alert.acknowledged && alert.acknowledgedAt && (
                        <span className="ml-2">
                          • Acknowledged {formatTime(alert.acknowledgedAt)}
                          {alert.acknowledgedBy && ` by ${alert.acknowledgedBy}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAcknowledge(alert.id)}
                      className="text-xs h-8"
                    >
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDismiss(alert.id)}
                    className="text-xs h-8 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center card-gradient border-border">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {statusFilter === "unacknowledged"
                ? "All alerts have been acknowledged!"
                : "No alerts match your filters."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
