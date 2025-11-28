import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, TrendingUp, Activity, Zap, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Robot {
  id: string;
  name: string;
  status: "online" | "charging" | "offline" | "error";
  battery: number;
  signal: number;
  temperature: number;
  location: string;
  country: string;
  state: string;
  region: string;
  lastUpdated: Date;
}

const mockRobots: Robot[] = [
  { id: "AURA-001", name: "Unit Alpha", status: "online", battery: 87, signal: 95, temperature: 42, location: "Lab Floor 2", country: "United States", state: "California", region: "North America", lastUpdated: new Date(Date.now() - 2 * 60000) },
  { id: "AURA-002", name: "Unit Beta", status: "charging", battery: 34, signal: 88, temperature: 38, location: "Charging Bay 1", country: "United States", state: "California", region: "North America", lastUpdated: new Date(Date.now() - 5 * 60000) },
  { id: "AURA-003", name: "Unit Gamma", status: "online", battery: 92, signal: 100, temperature: 45, location: "Warehouse A", country: "Germany", state: "Bavaria", region: "Europe", lastUpdated: new Date(Date.now() - 1 * 60000) },
  { id: "AURA-004", name: "Unit Delta", status: "error", battery: 15, signal: 42, temperature: 68, location: "Corridor 3B", country: "Germany", state: "Bavaria", region: "Europe", lastUpdated: new Date(Date.now() - 30 * 60000) },
  { id: "AURA-005", name: "Unit Echo", status: "online", battery: 76, signal: 92, temperature: 40, location: "Production Line 1", country: "Japan", state: "Tokyo", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 3 * 60000) },
  { id: "AURA-006", name: "Unit Foxtrot", status: "offline", battery: 5, signal: 0, temperature: 25, location: "Storage Room", country: "Japan", state: "Tokyo", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 120 * 60000) },
  { id: "AURA-007", name: "Unit Golf", status: "online", battery: 85, signal: 98, temperature: 43, location: "Assembly Area", country: "United Kingdom", state: "London", region: "Europe", lastUpdated: new Date(Date.now() - 4 * 60000) },
  { id: "AURA-008", name: "Unit Hotel", status: "online", battery: 71, signal: 91, temperature: 44, location: "Lab Floor 1", country: "United Kingdom", state: "London", region: "Europe", lastUpdated: new Date(Date.now() - 6 * 60000) },
  { id: "AURA-009", name: "Unit India", status: "charging", battery: 28, signal: 85, temperature: 35, location: "Charging Bay 2", country: "Canada", state: "Ontario", region: "North America", lastUpdated: new Date(Date.now() - 8 * 60000) },
  { id: "AURA-010", name: "Unit Juliet", status: "online", battery: 64, signal: 89, temperature: 46, location: "Warehouse B", country: "Canada", state: "Ontario", region: "North America", lastUpdated: new Date(Date.now() - 7 * 60000) },
  { id: "AURA-011", name: "Unit Kilo", status: "online", battery: 81, signal: 96, temperature: 41, location: "Production Line 2", country: "Singapore", state: "Singapore", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 9 * 60000) },
  { id: "AURA-012", name: "Unit Lima", status: "online", battery: 28, signal: 87, temperature: 49, location: "Assembly Area", country: "Singapore", state: "Singapore", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 10 * 60000) },
  { id: "AURA-013", name: "Unit Mike", status: "online", battery: 95, signal: 99, temperature: 43, location: "Lab Floor 3", country: "Australia", state: "New South Wales", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 11 * 60000) },
  { id: "AURA-014", name: "Unit November", status: "online", battery: 58, signal: 90, temperature: 71, location: "Warehouse A", country: "Australia", state: "New South Wales", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 12 * 60000) },
  { id: "AURA-015", name: "Unit Oscar", status: "offline", battery: 8, signal: 15, temperature: 32, location: "Storage Room", country: "Brazil", state: "São Paulo", region: "South America", lastUpdated: new Date(Date.now() - 180 * 60000) },
  { id: "AURA-016", name: "Unit Papa", status: "online", battery: 72, signal: 93, temperature: 44, location: "Production Line 1", country: "Brazil", state: "São Paulo", region: "South America", lastUpdated: new Date(Date.now() - 13 * 60000) },
  { id: "AURA-017", name: "Unit Quebec", status: "online", battery: 89, signal: 97, temperature: 42, location: "Lab Floor 2", country: "France", state: "Île-de-France", region: "Europe", lastUpdated: new Date(Date.now() - 14 * 60000) },
  { id: "AURA-018", name: "Unit Romeo", status: "charging", battery: 45, signal: 86, temperature: 36, location: "Charging Bay 3", country: "France", state: "Île-de-France", region: "Europe", lastUpdated: new Date(Date.now() - 15 * 60000) },
  { id: "AURA-019", name: "Unit Sierra", status: "offline", battery: 2, signal: 0, temperature: 28, location: "Storage Room", country: "United States", state: "Texas", region: "North America", lastUpdated: new Date(Date.now() - 60 * 60000) },
  { id: "AURA-020", name: "Unit Tango", status: "online", battery: 79, signal: 94, temperature: 45, location: "Warehouse B", country: "United States", state: "Texas", region: "North America", lastUpdated: new Date(Date.now() - 16 * 60000) },
  { id: "AURA-021", name: "Unit Uniform", status: "online", battery: 86, signal: 96, temperature: 41, location: "Assembly Area", country: "South Korea", state: "Seoul", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 17 * 60000) },
  { id: "AURA-022", name: "Unit Victor", status: "online", battery: 93, signal: 98, temperature: 43, location: "Lab Floor 1", country: "South Korea", state: "Seoul", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 18 * 60000) },
  { id: "AURA-023", name: "Unit Whiskey", status: "online", battery: 67, signal: 91, temperature: 47, location: "Production Line 2", country: "India", state: "Karnataka", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 19 * 60000) },
  { id: "AURA-024", name: "Unit X-Ray", status: "online", battery: 82, signal: 95, temperature: 69, location: "Warehouse A", country: "India", state: "Karnataka", region: "Asia Pacific", lastUpdated: new Date(Date.now() - 20 * 60000) },
];

// Generate time series data for battery trends
const generateBatteryTrendData = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      time: `${i}:00`,
      avgBattery: Math.max(20, 85 - i * 1.5 + Math.random() * 10),
      minBattery: Math.max(5, 50 - i * 1.2 + Math.random() * 8),
      maxBattery: Math.min(100, 95 - i * 0.8 + Math.random() * 5),
    });
  }
  return hours;
};

// Generate temperature trend data
const generateTemperatureTrendData = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      time: `${i}:00`,
      avgTemp: 40 + i * 0.5 + Math.random() * 8,
      maxTemp: 48 + i * 0.3 + Math.random() * 10,
    });
  }
  return hours;
};

const AnalyticsPage = () => {
  const navigate = useNavigate();

  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    const counts = { online: 0, charging: 0, offline: 0, error: 0 };
    mockRobots.forEach((robot) => {
      counts[robot.status]++;
    });
    return [
      { name: "Online", value: counts.online, fill: "#10b981" },
      { name: "Charging", value: counts.charging, fill: "#f59e0b" },
      { name: "Offline", value: counts.offline, fill: "#6b7280" },
      { name: "Error", value: counts.error, fill: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, []);

  // Calculate battery distribution
  const batteryDistribution = useMemo(() => {
    const critical = mockRobots.filter((r) => r.battery < 20).length;
    const low = mockRobots.filter((r) => r.battery >= 20 && r.battery < 50).length;
    const medium = mockRobots.filter((r) => r.battery >= 50 && r.battery < 80).length;
    const high = mockRobots.filter((r) => r.battery >= 80).length;

    return [
      { name: "Critical (<20%)", value: critical, fill: "#ef4444" },
      { name: "Low (20-50%)", value: low, fill: "#f59e0b" },
      { name: "Medium (50-80%)", value: medium, fill: "#3b82f6" },
      { name: "High (80%+)", value: high, fill: "#10b981" },
    ].filter((item) => item.value > 0);
  }, []);

  // Calculate temperature distribution
  const temperatureDistribution = useMemo(() => {
    const optimal = mockRobots.filter((r) => r.temperature < 45).length;
    const normal = mockRobots.filter((r) => r.temperature >= 45 && r.temperature < 60).length;
    const warning = mockRobots.filter((r) => r.temperature >= 60 && r.temperature < 70).length;
    const critical = mockRobots.filter((r) => r.temperature >= 70).length;

    return [
      { name: "Optimal (<45°C)", value: optimal, fill: "#06b6d4" },
      { name: "Normal (45-60°C)", value: normal, fill: "#10b981" },
      { name: "Warning (60-70°C)", value: warning, fill: "#f59e0b" },
      { name: "Critical (70°C+)", value: critical, fill: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, []);

  const batteryTrendData = generateBatteryTrendData();
  const temperatureTrendData = generateTemperatureTrendData();

  // Calculate location-based robot count
  const locationStats = useMemo(() => {
    const locationMap: { [key: string]: number } = {};
    mockRobots.forEach((robot) => {
      locationMap[robot.location] = (locationMap[robot.location] || 0) + 1;
    });
    return Object.entries(locationMap)
      .map(([location, count]) => ({
        location: location.substring(0, 15),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  // Regional distribution stats
  const regionStats = useMemo(() => {
    const regionMap: { [key: string]: number } = {};
    mockRobots.forEach((robot) => {
      regionMap[robot.region] = (regionMap[robot.region] || 0) + 1;
    });
    return Object.entries(regionMap)
      .map(([region, count]) => ({
        region,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Country distribution stats  
  const countryStats = useMemo(() => {
    const countryMap: { [key: string]: number } = {};
    mockRobots.forEach((robot) => {
      countryMap[robot.country] = (countryMap[robot.country] || 0) + 1;
    });
    return Object.entries(countryMap)
      .map(([country, count]) => ({
        country: country.length > 12 ? country.substring(0, 12) + "..." : country,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  // Regional distribution for pie chart
  const regionalDistribution = useMemo(() => {
    const regionColors: { [key: string]: string } = {
      "North America": "#3b82f6",
      "Europe": "#10b981", 
      "Asia Pacific": "#f59e0b",
      "South America": "#ef4444"
    };
    
    return regionStats.map((region) => ({
      name: region.region,
      value: region.count,
      fill: regionColors[region.region] || "#6b7280"
    }));
  }, [regionStats]);

  // Calculate key metrics
  const avgBattery = Math.round(mockRobots.reduce((sum, r) => sum + r.battery, 0) / mockRobots.length);
  const avgTemp = Math.round(mockRobots.reduce((sum, r) => sum + r.temperature, 0) / mockRobots.length);
  const onlineCount = mockRobots.filter((r) => r.status === "online").length;
  const avgSignal = Math.round(mockRobots.reduce((sum, r) => sum + r.signal, 0) / mockRobots.length);

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
            Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time fleet performance metrics and trends
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Avg Battery</span>
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${avgBattery > 60 ? 'text-success' : avgBattery > 30 ? 'text-warning' : 'text-destructive'}`}>
              {avgBattery}%
            </p>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Avg Temp</span>
              <Thermometer className="w-4 h-4 text-primary" />
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${avgTemp < 50 ? 'text-success' : avgTemp < 65 ? 'text-warning' : 'text-destructive'}`}>
              {avgTemp}°C
            </p>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Online</span>
              <Activity className="w-4 h-4 text-success" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-success">{onlineCount}/{mockRobots.length}</p>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Avg Signal</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-primary">{avgSignal}%</p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Status Distribution */}
        <Card className="p-4 card-gradient border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Robot Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Battery Level Distribution */}
        <Card className="p-4 card-gradient border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Battery Level Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={batteryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {batteryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Battery Trend Chart */}
      <Card className="p-4 card-gradient border-border mb-6">
        <h3 className="font-semibold text-sm sm:text-base mb-4">Battery Level Trends (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={batteryTrendData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Legend />
            <Line type="monotone" dataKey="avgBattery" stroke="#3b82f6" strokeWidth={2} dot={false} name="Average Battery" />
            <Line type="monotone" dataKey="maxBattery" stroke="#10b981" strokeWidth={2} dot={false} name="Max Battery" />
            <Line type="monotone" dataKey="minBattery" stroke="#ef4444" strokeWidth={2} dot={false} name="Min Battery" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Temperature Distribution & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Temperature Distribution */}
        <Card className="p-4 card-gradient border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Temperature Ranges</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={temperatureDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {temperatureDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Temperature Trend */}
        <Card className="p-4 card-gradient border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Temperature Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={temperatureTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Line type="monotone" dataKey="avgTemp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Average Temp" />
              <Line type="monotone" dataKey="maxTemp" stroke="#ef4444" strokeWidth={2} dot={false} name="Max Temp" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Robot Deployment by Location */}
      <Card className="p-4 card-gradient border-border">
        <h3 className="font-semibold text-sm sm:text-base mb-4">Robot Deployment by Location</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationStats}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Regional Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        {/* Regional Distribution Pie Chart */}
        <Card className="p-4 card-gradient border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Fleet Distribution by Region</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={regionalDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {regionalDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Country Distribution Bar Chart */}
        <Card className="p-4 card-gradient border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Robot Deployment by Country</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryStats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="country" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
