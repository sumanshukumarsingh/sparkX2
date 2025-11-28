import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Battery,
  TrendingDown,
  Zap,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  BarChart3,
} from "lucide-react";

interface BatteryHealthMetrics {
  currentCharge: number; // 0-100 percentage
  healthPercentage: number; // 0-100 (capacity vs design capacity)
  cycleCount: number;
  maxCycles: number; // Design specification
  manufactureDate: Date;
  ageMonths: number;
  designCapacity: number; // mAh
  currentCapacity: number; // mAh
  voltage: number; // V
  chargingStatus: "charging" | "discharging" | "idle" | "full";
  chargingRate: number; // W (positive when charging, negative when discharging)
  batteryTemp: number; // Celsius
  estimatedReplacementDate: Date;
  daysUntilReplacement: number;
}

interface ChargeHistory {
  timestamp: Date;
  cycleNumber: number;
  chargeLevel: number;
  duration: number; // minutes
  temperature: number;
}

interface HealthTrend {
  month: string;
  health: number;
  capacity: number;
}

export function BatteryHealthLifecycle() {
  const [metrics, setMetrics] = useState<BatteryHealthMetrics>({
    currentCharge: 87,
    healthPercentage: 94,
    cycleCount: 342,
    maxCycles: 1500,
    manufactureDate: new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000), // 18 months ago
    ageMonths: 18,
    designCapacity: 15000,
    currentCapacity: 14100,
    voltage: 48.2,
    chargingStatus: "discharging",
    chargingRate: -145,
    batteryTemp: 38,
    estimatedReplacementDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000), // 24 months
    daysUntilReplacement: 720,
  });

  const [recentCharges, setRecentCharges] = useState<ChargeHistory[]>([
    {
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      cycleNumber: 342,
      chargeLevel: 100,
      duration: 125,
      temperature: 42,
    },
    {
      timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000),
      cycleNumber: 341,
      chargeLevel: 98,
      duration: 132,
      temperature: 40,
    },
    {
      timestamp: new Date(Date.now() - 52 * 60 * 60 * 1000),
      cycleNumber: 340,
      chargeLevel: 100,
      duration: 128,
      temperature: 41,
    },
  ]);

  const [healthTrend] = useState<HealthTrend[]>([
    { month: "6mo ago", health: 98, capacity: 14700 },
    { month: "5mo ago", health: 97, capacity: 14550 },
    { month: "4mo ago", health: 96, capacity: 14400 },
    { month: "3mo ago", health: 95, capacity: 14250 },
    { month: "2mo ago", health: 95, capacity: 14250 },
    { month: "1mo ago", health: 94, capacity: 14100 },
    { month: "Now", health: 94, capacity: 14100 },
  ]);

  // Simulate live battery updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const isCharging = prev.chargingStatus === "charging";
        const chargeChange = isCharging ? 0.05 : -0.02; // Faster charge, slower discharge
        const newCharge = Math.max(0, Math.min(100, prev.currentCharge + chargeChange));

        return {
          ...prev,
          currentCharge: newCharge,
          voltage: 44 + (newCharge / 100) * 8, // 44V-52V range
          chargingRate: isCharging ? 180 : -145,
          batteryTemp: Math.max(
            30,
            Math.min(50, prev.batteryTemp + (Math.random() - 0.5) * 1)
          ),
          chargingStatus:
            newCharge >= 100
              ? "full"
              : newCharge < 20
              ? "charging"
              : prev.chargingStatus,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-success";
    if (health >= 80) return "text-green-400";
    if (health >= 70) return "text-yellow-400";
    if (health >= 60) return "text-warning";
    return "text-destructive";
  };

  const getHealthStatus = (health: number) => {
    if (health >= 90) return "Excellent";
    if (health >= 80) return "Good";
    if (health >= 70) return "Fair";
    if (health >= 60) return "Replace Soon";
    return "Critical";
  };

  const getTempColor = (temp: number) => {
    if (temp < 35) return "text-cyan-400";
    if (temp < 45) return "text-success";
    if (temp < 50) return "text-warning";
    return "text-destructive";
  };

  const getChargingIcon = (status: BatteryHealthMetrics["chargingStatus"]) => {
    switch (status) {
      case "charging":
        return <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case "discharging":
        return <TrendingDown className="w-4 h-4 text-blue-400" />;
      case "full":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "idle":
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getChargingStatusText = (status: BatteryHealthMetrics["chargingStatus"]) => {
    switch (status) {
      case "charging":
        return "Charging";
      case "discharging":
        return "Discharging";
      case "full":
        return "Fully Charged";
      case "idle":
        return "Idle";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTimeSince = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (60 * 60 * 1000));
    if (hours < 1) return "< 1h ago";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const cycleLifePercentage = (metrics.cycleCount / metrics.maxCycles) * 100;

  return (
    <Card className="p-4 card-gradient border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Battery className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="font-semibold text-lg">Battery Health & Lifecycle</h3>
            <p className="text-xs text-muted-foreground">
              Comprehensive battery management & replacement planning
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={metrics.healthPercentage >= 80 ? "default" : "secondary"}
            className={
              metrics.healthPercentage >= 80
                ? "bg-success text-success-foreground"
                : metrics.healthPercentage >= 60
                ? "bg-warning text-warning-foreground"
                : "bg-destructive text-destructive-foreground"
            }
          >
            Health: {metrics.healthPercentage}%
          </Badge>
        </div>
      </div>

      {/* Current Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-muted border border-border">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground">Charge Level</p>
            {getChargingIcon(metrics.chargingStatus)}
          </div>
          <p className="text-2xl font-bold text-success">{metrics.currentCharge.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {getChargingStatusText(metrics.chargingStatus)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted border border-border">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Health</p>
          </div>
          <p className={`text-2xl font-bold ${getHealthColor(metrics.healthPercentage)}`}>
            {metrics.healthPercentage}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">{getHealthStatus(metrics.healthPercentage)}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-muted-foreground">Temperature</p>
          </div>
          <p className={`text-2xl font-bold ${getTempColor(metrics.batteryTemp)}`}>
            {metrics.batteryTemp.toFixed(0)}°C
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.batteryTemp < 45 ? "Normal" : "Elevated"}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-muted-foreground">Power Rate</p>
          </div>
          <p
            className={`text-2xl font-bold ${
              metrics.chargingRate > 0 ? "text-yellow-400" : "text-blue-400"
            }`}
          >
            {Math.abs(metrics.chargingRate).toFixed(0)}W
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.chargingRate > 0 ? "Charging" : "Consuming"}
          </p>
        </div>
      </div>

      {/* Battery Health Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-muted border border-border">
          <h4 className="text-sm font-semibold mb-3">Capacity Status</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Current Capacity</span>
                <span className="text-sm font-bold">{metrics.currentCapacity.toLocaleString()} mAh</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Design Capacity</span>
                <span className="text-sm font-mono">{metrics.designCapacity.toLocaleString()} mAh</span>
              </div>
              <Progress value={metrics.healthPercentage} className="h-2 mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Voltage</span>
                <span className="font-mono font-bold">{metrics.voltage.toFixed(1)}V</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Capacity Loss</span>
                <span className="font-mono font-bold text-warning">
                  {(100 - metrics.healthPercentage).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted border border-border">
          <h4 className="text-sm font-semibold mb-3">Cycle Life</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Charge Cycles</span>
                <span className="text-sm font-bold">
                  {metrics.cycleCount} / {metrics.maxCycles}
                </span>
              </div>
              <Progress value={cycleLifePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {(100 - cycleLifePercentage).toFixed(1)}% lifecycle remaining
              </p>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Battery Age</span>
                <span className="font-mono font-bold">{metrics.ageMonths} months</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Manufactured</span>
                <span className="font-mono">{formatDate(metrics.manufactureDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replacement Prediction */}
      <div className="p-3 rounded-lg bg-muted border border-border mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <h4 className="text-sm font-semibold">Replacement Prediction</h4>
          </div>
          {metrics.daysUntilReplacement < 180 && (
            <AlertTriangle className="w-4 h-4 text-warning" />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Estimated Replacement</p>
            <p className="text-lg font-bold text-orange-400">
              {Math.round(metrics.daysUntilReplacement)} days
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ~{formatDate(metrics.estimatedReplacementDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Replacement Confidence</p>
            <p className="text-lg font-bold text-primary">87%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on wear pattern analysis
            </p>
          </div>
        </div>
        {metrics.daysUntilReplacement < 180 && (
          <div className="mt-3 p-2 rounded bg-warning/10 border border-warning/30">
            <p className="text-xs text-warning flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              Recommended: Schedule battery replacement in next maintenance window
            </p>
          </div>
        )}
      </div>

      {/* Health Trend */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-primary" />
          Health Trend (Last 6 Months)
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {healthTrend.map((trend, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div
                  className="h-16 bg-gradient-to-t from-green-500/20 to-green-500/5 rounded-t border border-green-500/30 flex items-end justify-center"
                  style={{ height: `${trend.health}px` }}
                >
                  <span className="text-xs font-bold text-success pb-1">{trend.health}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{trend.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Charge History */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          Recent Charge History
        </h4>
        <div className="space-y-2">
          {recentCharges.map((charge, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs font-semibold">Cycle #{charge.cycleNumber}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatTimeSince(charge.timestamp)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Charged to:</span>
                  <span className="ml-1 font-bold text-success">{charge.chargeLevel}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-1 font-mono font-bold">{charge.duration}min</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Temp:</span>
                  <span className={`ml-1 font-mono font-bold ${getTempColor(charge.temperature)}`}>
                    {charge.temperature}°C
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
