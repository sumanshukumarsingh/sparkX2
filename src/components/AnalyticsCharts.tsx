import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Battery, Cpu, Thermometer, Activity, TrendingUp } from "lucide-react";

interface DataPoint {
  time: string;
  battery: number;
  cpu: number;
  temperature: number;
  memoryUsed: number;
  networkLatency: number;
}

interface AnalyticsChartsProps {
  robotId?: string;
}

export function AnalyticsCharts({ robotId }: AnalyticsChartsProps) {
  const [historicalData, setHistoricalData] = useState<DataPoint[]>(() => {
    // Generate robot-specific 24 hours of data (48 points, every 30 minutes)
    const data: DataPoint[] = [];
    const now = Date.now();
    
    // Robot-specific initial battery level based on robotId
    const robotSeed = robotId ? robotId.charCodeAt(robotId.length - 1) : 65;
    let battery = 85 + (robotSeed % 15); // Battery between 85-100% based on robot
    
    for (let i = 48; i >= 0; i--) {
      const timestamp = new Date(now - i * 30 * 60 * 1000);
      const hours = timestamp.getHours();
      const minutes = timestamp.getMinutes();
      
      // Battery decreases over time with slight variations
      battery = Math.max(10, battery - 0.5 - Math.random() * 0.5);
      
      // CPU varies with time of day (higher during work hours)
      const baseCpu = hours >= 8 && hours <= 18 ? 60 : 30;
      const cpu = baseCpu + Math.random() * 20 - 10;
      
      // Temperature correlates with CPU
      const temperature = 35 + (cpu / 100) * 25 + Math.random() * 5;
      
      // Memory usage slowly increases
      const memoryUsed = 2.5 + (48 - i) * 0.02 + Math.random() * 0.3;
      
      // Network latency varies
      const networkLatency = 10 + Math.random() * 30;
      
      data.push({
        time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
        battery: parseFloat(battery.toFixed(1)),
        cpu: parseFloat(cpu.toFixed(1)),
        temperature: parseFloat(temperature.toFixed(1)),
        memoryUsed: parseFloat(memoryUsed.toFixed(2)),
        networkLatency: parseFloat(networkLatency.toFixed(1)),
      });
    }
    
    return data;
  });

  const [jointWearData, setJointWearData] = useState(() => {
    // Generate robot-specific joint wear data
    const robotSeed = robotId ? robotId.charCodeAt(robotId.length - 1) : 65;
    const baseWear = (robotSeed % 10) + 5; // Base wear between 5-15%
    
    return [
      { joint: "L Hip", cycles: 12000 + (robotSeed * 50), wear: baseWear + 2, health: 100 - (baseWear + 2) },
      { joint: "R Hip", cycles: 12000 + (robotSeed * 52), wear: baseWear + 3, health: 100 - (baseWear + 3) },
      { joint: "L Knee", cycles: 12000 + (robotSeed * 48), wear: baseWear + 5, health: 100 - (baseWear + 5) },
      { joint: "R Knee", cycles: 12000 + (robotSeed * 54), wear: baseWear + 8, health: 100 - (baseWear + 8) },
      { joint: "L Ankle", cycles: 12000 + (robotSeed * 45), wear: baseWear, health: 100 - baseWear },
      { joint: "R Ankle", cycles: 12000 + (robotSeed * 47), wear: baseWear + 1, health: 100 - (baseWear + 1) },
      { joint: "L Shoulder", cycles: 8000 + (robotSeed * 30), wear: Math.max(1, baseWear - 3), health: 100 - Math.max(1, baseWear - 3) },
      { joint: "R Shoulder", cycles: 8000 + (robotSeed * 32), wear: Math.max(1, baseWear - 2), health: 100 - Math.max(1, baseWear - 2) },
      { joint: "L Elbow", cycles: 7800 + (robotSeed * 28), wear: Math.max(1, baseWear - 4), health: 100 - Math.max(1, baseWear - 4) },
      { joint: "R Elbow", cycles: 7800 + (robotSeed * 31), wear: Math.max(1, baseWear - 5), health: 100 - Math.max(1, baseWear - 5) },
    ];
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHistoricalData((prevData) => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Update battery (slowly decreasing)
        const battery = Math.max(10, lastPoint.battery - 0.05 - Math.random() * 0.05);
        
        // CPU varies
        const baseCpu = hours >= 8 && hours <= 18 ? 60 : 30;
        const cpu = baseCpu + Math.random() * 20 - 10;
        
        // Temperature correlates with CPU
        const temperature = 35 + (cpu / 100) * 25 + Math.random() * 5;
        
        // Memory slowly increases
        const memoryUsed = Math.min(7.5, lastPoint.memoryUsed + Math.random() * 0.01);
        
        // Network latency varies
        const networkLatency = 10 + Math.random() * 30;
        
        const newPoint: DataPoint = {
          time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
          battery: parseFloat(battery.toFixed(1)),
          cpu: parseFloat(cpu.toFixed(1)),
          temperature: parseFloat(temperature.toFixed(1)),
          memoryUsed: parseFloat(memoryUsed.toFixed(2)),
          networkLatency: parseFloat(networkLatency.toFixed(1)),
        };
        
        // Keep last 48 data points (24 hours at 30-min intervals)
        newData.push(newPoint);
        if (newData.length > 49) {
          newData.shift();
        }
        
        return newData;
      });

      // Slowly increment joint cycles
      setJointWearData((prevData) =>
        prevData.map((joint) => ({
          ...joint,
          cycles: joint.cycles + (Math.random() < 0.1 ? 1 : 0),
          wear: Math.min(100, joint.wear + (Math.random() < 0.05 ? 0.1 : 0)),
          health: Math.max(50, 100 - joint.wear),
        }))
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
              {entry.name === "Battery" ? "%" : ""}
              {entry.name === "CPU" ? "%" : ""}
              {entry.name === "Temperature" ? "°C" : ""}
              {entry.name === "Memory" ? " GB" : ""}
              {entry.name === "Latency" ? "ms" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Robot-Specific Analytics Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Robot Analytics - {robotId || "Unknown"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Historical performance data and predictive analytics for this specific robot
        </p>
      </div>
      
      <Tabs defaultValue="battery" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-secondary/20">
          <TabsTrigger value="battery">
            <Battery className="w-4 h-4 mr-2" />
            Battery
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Cpu className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="temperature">
            <Thermometer className="w-4 h-4 mr-2" />
            Temperature
          </TabsTrigger>
          <TabsTrigger value="joints">
            <Activity className="w-4 h-4 mr-2" />
            Joint Wear
          </TabsTrigger>
        </TabsList>

        <TabsContent value="battery" className="space-y-4">
          <Card className="p-4 card-gradient border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Battery Discharge Curve</h3>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-400">
                  {historicalData[historicalData.length - 1]?.battery.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Current Level</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="battery"
                  name="Battery"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#batteryGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="p-4 card-gradient border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">CPU & Memory Usage</h3>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  {historicalData[historicalData.length - 1]?.cpu.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Current CPU</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  name="CPU"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="memoryUsed"
                  name="Memory"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="networkLatency"
                  name="Latency"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <Card className="p-4 card-gradient border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Temperature Trends</h3>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-400">
                  {historicalData[historicalData.length - 1]?.temperature.toFixed(1)}°C
                </p>
                <p className="text-xs text-muted-foreground">Current Temp</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} domain={[30, 80]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature"
                  stroke="#f97316"
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="joints" className="space-y-4">
          <Card className="p-4 card-gradient border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Joint Wear Analysis</h3>
                <p className="text-xs text-muted-foreground">Cycle count & health metrics</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <p className="text-sm text-muted-foreground">Sorted by wear level</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jointWearData.sort((a, b) => b.wear - a.wear)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="joint" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="health" name="Health %" fill="#22c55e" />
                <Bar dataKey="wear" name="Wear %" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {jointWearData.map((joint) => (
                <div
                  key={joint.joint}
                  className="p-2 rounded-lg bg-muted border border-border"
                >
                  <p className="text-xs font-semibold text-primary">{joint.joint}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {joint.cycles.toLocaleString()} cycles
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
