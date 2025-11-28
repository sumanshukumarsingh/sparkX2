import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RobotSimulation } from "@/components/RobotSimulation";
import { OTAUpdateManager } from "@/components/OTAUpdateManager";
import { JointStatusPanel } from "@/components/JointStatusPanel";
import { SystemDiagnosticsCard } from "@/components/SystemDiagnosticsCard";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { SensorDashboard } from "@/components/SensorDashboard";
import { SafetyAlertsPanel } from "@/components/SafetyAlertsPanel";
import { BatteryHealthLifecycle } from "@/components/BatteryHealthLifecycle";
import { ConnectivityHealthCard } from "@/components/ConnectivityHealthCard";
import { MaintenancePredictionPanel } from "@/components/MaintenancePredictionPanel";

import { RobotHealthSummary } from "@/components/RobotHealthSummary";
import {
  ArrowLeft,
  Activity,
  Battery,
  Signal,
  Wifi,
  Cpu,
  Thermometer,
  MapPin,
  Video,
  Gamepad2,
  BarChart3,
  Download,
  Wrench,
} from "lucide-react";

const RobotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [battery, setBattery] = useState(87);
  const [cpuLoad, setCpuLoad] = useState(42);
  const [temperature, setTemperature] = useState(42);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [batteryTrend, setBatteryTrend] = useState<"up" | "down" | "stable">("down");
  const [cpuTrend, setCpuTrend] = useState<"up" | "down" | "stable">("stable");
  const [tempTrend, setTempTrend] = useState<"up" | "down" | "stable">("stable");
  const [robotLocation, setRobotLocation] = useState({ lat: 37.7749, lng: -122.4194, speed: 0.5 });

  // Calculate estimated runtime based on battery percentage
  const calculateRuntime = (batteryPercent: number) => {
    // Assume full battery gives 8 hours of runtime
    const totalMinutes = (batteryPercent / 100) * 8 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBattery((prev) => {
        const change = -Math.random() * 0.5;
        const newVal = Math.max(10, prev + change);
        setBatteryTrend(change < -0.2 ? "down" : change > 0.2 ? "up" : "stable");
        return newVal;
      });
      setCpuLoad((prev) => {
        const change = (Math.random() - 0.5) * 5;
        const newVal = Math.min(100, Math.max(20, prev + change));
        setCpuTrend(change > 2 ? "up" : change < -2 ? "down" : "stable");
        return newVal;
      });
      setTemperature((prev) => {
        const change = (Math.random() - 0.5) * 2;
        const newVal = Math.min(80, Math.max(35, prev + change));
        setTempTrend(change > 0.8 ? "up" : change < -0.8 ? "down" : "stable");
        return newVal;
      });
      setLastUpdated(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return "text-success";
    if (battery > 30) return "text-warning";
    return "text-destructive";
  };

  const getTempColor = (temp: number) => {
    if (temp < 50) return "text-success";
    if (temp < 65) return "text-warning";
    return "text-destructive";
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
  };

  const getTrendColor = (trend: "up" | "down" | "stable", isGood: "up" | "down") => {
    if (trend === "stable") return "text-muted-foreground";
    if (trend === isGood) return "text-success";
    return "text-warning";
  };

  const formatLastUpdated = (date: Date) => {
    const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secondsAgo < 5) return "Just now";
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    return `${Math.floor(secondsAgo / 60)}m ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
          <Button variant="outline" size="icon" onClick={() => navigate("/")} className="h-9 w-9 sm:h-10 sm:w-10">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              {id ? `Robot ${id}` : "Unknown Robot"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">{id || "No ID"}</p>
          </div>
          <Badge className="bg-success text-success-foreground flex-shrink-0">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            <span className="hidden xs:inline">Online</span>
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3" />
          <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          <Card className="p-3 card-gradient border-border">
            <div className="flex items-center gap-2 mb-2">
              <Battery className={`w-4 h-4 ${getBatteryColor(battery)}`} />
              <span className="text-xs text-muted-foreground">Battery</span>
              <span className={`ml-auto text-xs font-bold ${getTrendColor(batteryTrend, "up")}`}>
                {getTrendIcon(batteryTrend)}
              </span>
            </div>
            <p className={`text-xl font-bold font-mono ${getBatteryColor(battery)}`}>
              {battery.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {calculateRuntime(battery)} left
            </p>
          </Card>

          <Card className="p-3 card-gradient border-border">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">WiFi 6E</span>
            </div>
            <p className="text-xl font-bold font-mono text-success">Strong</p>
          </Card>

          <Card className="p-3 card-gradient border-border">
            <div className="flex items-center gap-2 mb-2">
              <Signal className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">5G Signal</span>
            </div>
            <p className="text-xl font-bold font-mono text-success">Excellent</p>
          </Card>

          <Card className="p-3 card-gradient border-border">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">CPU Load</span>
              <span className={`ml-auto text-xs font-bold ${getTrendColor(cpuTrend, "down")}`}>
                {getTrendIcon(cpuTrend)}
              </span>
            </div>
            <p className="text-xl font-bold font-mono">{cpuLoad.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {cpuLoad < 50 ? 'Normal' : cpuLoad < 80 ? 'High' : 'Critical'}
            </p>
          </Card>

          <Card className="p-3 card-gradient border-border">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className={`w-4 h-4 ${getTempColor(temperature)}`} />
              <span className="text-xs text-muted-foreground">Temperature</span>
              <span className={`ml-auto text-xs font-bold ${getTrendColor(tempTrend, "down")}`}>
                {getTrendIcon(tempTrend)}
              </span>
            </div>
            <p className={`text-xl font-bold font-mono ${getTempColor(temperature)}`}>
              {temperature.toFixed(0)}°C
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {temperature < 50 ? 'Optimal' : temperature < 65 ? 'Warm' : 'Hot'}
            </p>
          </Card>


        </div>

        {/* Tabs */}
        <div className="card-gradient border border-border rounded-lg overflow-hidden">
          <Tabs defaultValue="monitor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-0 bg-secondary/20 p-0 rounded-none h-auto">
              <TabsTrigger value="monitor" className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 sm:py-4">
                <Activity className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Monitor</span>
              </TabsTrigger>
              <TabsTrigger value="control" className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 sm:py-4">
                <Gamepad2 className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Control</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 sm:py-4">
                <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="updates" className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 sm:py-4">
                <Download className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Updates</span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="monitor" className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            {/* Robot Health Summary */}
            <RobotHealthSummary />

            <Accordion type="multiple" defaultValue={["safety", "joints", "sensors", "diagnostics"]} className="space-y-3">
              {/* Safety & Alerts Section */}
              <AccordionItem value="safety" className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/50 transition-colors [&[data-state=open]]:bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-destructive" />
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Safety & Alerts</h3>
                      <p className="text-xs text-muted-foreground">Real-time safety monitoring & alert management</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SafetyAlertsPanel />
                </AccordionContent>
              </AccordionItem>

              {/* Joint Control & Status - PRIORITY 2 for operators */}
              <AccordionItem value="joints" className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/50 transition-colors [&[data-state=open]]:bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Joint Control & Status</h3>
                      <p className="text-xs text-muted-foreground">32 DOF actuator monitoring & control</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <JointStatusPanel />
                </AccordionContent>
              </AccordionItem>

              {/* Sensors & Environmental - PRIORITY 3 for operators */}
              <AccordionItem value="sensors" className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/50 transition-colors [&[data-state=open]]:bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Signal className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Sensors & Environmental</h3>
                      <p className="text-xs text-muted-foreground">IMU, cameras, LiDAR, environmental monitoring</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SensorDashboard />
                </AccordionContent>
              </AccordionItem>

              {/* System Diagnostics */}
              <AccordionItem value="diagnostics" className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/50 transition-colors [&[data-state=open]]:bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <h3 className="font-semibold text-base">System Diagnostics</h3>
                      <p className="text-xs text-muted-foreground">CPU, memory, storage, network performance</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SystemDiagnosticsCard />
                </AccordionContent>
              </AccordionItem>

              {/* Battery Health & Lifecycle */}
              <AccordionItem value="battery" className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/50 transition-colors [&[data-state=open]]:bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Battery Health & Lifecycle</h3>
                      <p className="text-xs text-muted-foreground">Battery management & replacement planning</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <BatteryHealthLifecycle />
                </AccordionContent>
              </AccordionItem>

              {/* Connectivity Health */}
              <AccordionItem value="connectivity" className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/50 transition-colors [&[data-state=open]]:bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-cyan-400" />
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Connectivity Health</h3>
                      <p className="text-xs text-muted-foreground">Network status & communication monitoring</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ConnectivityHealthCard />
                </AccordionContent>
              </AccordionItem>

              {/* Predictive Maintenance */}
              <AccordionItem value="maintenance" className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/50 transition-colors [&[data-state=open]]:bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-orange-400" />
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Predictive Maintenance</h3>
                      <p className="text-xs text-muted-foreground">AI-powered failure prediction & scheduling</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <MaintenancePredictionPanel />
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </TabsContent>

          <TabsContent value="control" className="p-3 sm:p-4 space-y-4">
            <RobotSimulation robotId={id} />
            
            {/* Visual & Location Control Panel */}
            <div className="border-0 card-gradient border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-pink-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-base">Visual & Location Control</h3>
                    <p className="text-xs text-muted-foreground">Camera feeds & geolocation tracking for robot control</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {/* Camera Feed */}
                  <Card className="p-3 sm:p-4 card-gradient border-border">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                      <Video className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                      <h3 className="font-semibold text-sm sm:text-base">Intel RealSense Camera Feed</h3>
                      <Badge variant="outline" className="ml-auto text-xs sm:text-sm">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse mr-1 sm:mr-2" />
                        LIVE
                      </Badge>
                    </div>
                    <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                      <div className="relative z-10 text-center">
                        <Video className="w-12 h-12 mx-auto mb-2 text-primary animate-pulse-glow" />
                        <p className="text-sm text-muted-foreground">Live Camera Stream</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">1920x1080 @ 30fps</p>
                      </div>
                    </div>
                  </Card>

                  {/* Location Map */}
                  <Card className="p-3 sm:p-4 card-gradient border-border">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                      <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-destructive" />
                      <h3 className="font-semibold text-sm sm:text-base">Live Location</h3>
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse mr-1 sm:mr-2" />
                        GPS Active
                      </Badge>
                    </div>
                    <div className="aspect-video bg-secondary rounded-lg relative overflow-hidden border">
                      {/* Google Maps - Non-interactive overlay */}
                      <iframe
                        src={`https://maps.google.com/maps?q=${robotLocation.lat},${robotLocation.lng}&t=h&z=18&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        className="rounded-lg"
                      />
                      {/* Interaction blocker overlay */}
                      <div className="absolute inset-0 bg-transparent cursor-not-allowed" 
                           title="Map interaction disabled - Locked to robot position" />
                      
                      {/* Fixed coordinate display */}
                      <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-mono">
                        📍 {robotLocation.lat.toFixed(6)}, {robotLocation.lng.toFixed(6)}
                      </div>
                      
                      {/* Map locked notice */}
                      <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        🔒 Position Locked
                      </div>
                      {/* Precise Robot Position Marker */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative">
                          <div className="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg animate-pulse flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold shadow-lg">
                            🤖 ROBOT
                          </div>
                          {/* Accuracy circle */}
                          <div className="absolute inset-0 w-12 h-12 border-2 border-red-300 rounded-full animate-ping opacity-30 -translate-x-3 -translate-y-3" />
                        </div>
                      </div>
                      {/* Robot status overlay */}
                      <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm p-2 rounded text-xs">
                        <p className="font-mono text-primary">{robotLocation.lat.toFixed(6)}° N, {robotLocation.lng.toFixed(6)}° W</p>
                        <p className="text-muted-foreground">Accuracy: ±2m • Speed: {robotLocation.speed.toFixed(1)} m/s</p>
                        <p className="text-xs text-green-400 mt-1">🔒 Fixed Position View</p>
                        <p className="text-xs text-yellow-400">Map locked to robot location</p>
                      </div>
                      {/* Status indicators */}
                      <div className="absolute bottom-12 right-3 flex flex-col gap-1">
                        <Badge variant="secondary" className="text-xs bg-green-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          GPS Active
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-600/80 text-white">
                          🔒 No Pan/Zoom
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="p-3 sm:p-4">
            <AnalyticsCharts robotId={id} />
          </TabsContent>

          <TabsContent value="updates" className="p-3 sm:p-4">
            <OTAUpdateManager robotId={id || ""} />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RobotDetail;
