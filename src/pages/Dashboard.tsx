import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Activity, Battery, Signal, Thermometer, MapPin, Eye, Search, X, Filter, ArrowUpDown, Wifi, WifiOff, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, TrendingUp, Zap } from "lucide-react";
import { useRealtimeRobotData, useConnectionStatus } from "@/hooks/useRealtimeData";

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
  {
    id: "AURA-001",
    name: "Unit Alpha",
    status: "online",
    battery: 87,
    signal: 95,
    temperature: 42,
    location: "Lab Floor 2",
    country: "United States",
    state: "California",
    region: "North America",
    lastUpdated: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "AURA-002",
    name: "Unit Beta",
    status: "charging",
    battery: 34,
    signal: 88,
    temperature: 38,
    location: "Charging Bay 1",
    country: "United States",
    state: "California",
    region: "North America",
    lastUpdated: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "AURA-003",
    name: "Unit Gamma",
    status: "online",
    battery: 92,
    signal: 100,
    temperature: 45,
    location: "Warehouse A",
    country: "Germany",
    state: "Bavaria",
    region: "Europe",
    lastUpdated: new Date(Date.now() - 1 * 60000),
  },
  {
    id: "AURA-004",
    name: "Unit Delta",
    status: "error",
    battery: 15,
    signal: 42,
    temperature: 68,
    location: "Corridor 3B",
    country: "Germany",
    state: "Bavaria",
    region: "Europe",
    lastUpdated: new Date(Date.now() - 30 * 60000),
  },
  {
    id: "AURA-005",
    name: "Unit Echo",
    status: "online",
    battery: 76,
    signal: 92,
    temperature: 40,
    location: "Production Line 1",
    country: "Japan",
    state: "Tokyo",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 3 * 60000),
  },
  {
    id: "AURA-006",
    name: "Unit Foxtrot",
    status: "offline",
    battery: 5,
    signal: 0,
    temperature: 25,
    location: "Storage Room",
    country: "Japan",
    state: "Tokyo",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 120 * 60000),
  },
  {
    id: "AURA-007",
    name: "Unit Golf",
    status: "online",
    battery: 85,
    signal: 98,
    temperature: 43,
    location: "Assembly Area",
    country: "United States",
    state: "Texas",
    region: "North America",
    lastUpdated: new Date(Date.now() - 4 * 60000),
  },
  {
    id: "AURA-008",
    name: "Unit Hotel",
    status: "charging",
    battery: 45,
    signal: 91,
    temperature: 36,
    location: "Charging Bay 2",
    country: "Canada",
    state: "Ontario",
    region: "North America",
    lastUpdated: new Date(Date.now() - 8 * 60000),
  },
  {
    id: "AURA-009",
    name: "Unit India",
    status: "online",
    battery: 94,
    signal: 100,
    temperature: 41,
    location: "Warehouse B",
    country: "United Kingdom",
    state: "London",
    region: "Europe",
    lastUpdated: new Date(Date.now() - 1 * 60000),
  },
  {
    id: "AURA-010",
    name: "Unit Juliet",
    status: "online",
    battery: 72,
    signal: 87,
    temperature: 46,
    location: "Lab Floor 1",
    country: "France",
    state: "Île-de-France",
    region: "Europe",
    lastUpdated: new Date(Date.now() - 6 * 60000),
  },
  {
    id: "AURA-011",
    name: "Unit Kilo",
    status: "online",
    battery: 88,
    signal: 96,
    temperature: 42,
    location: "Distribution Center",
    country: "Singapore",
    state: "Singapore",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "AURA-012",
    name: "Unit Lima",
    status: "charging",
    battery: 28,
    signal: 85,
    temperature: 37,
    location: "Charging Bay 3",
    country: "Australia",
    state: "New South Wales",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 10 * 60000),
  },
  {
    id: "AURA-013",
    name: "Unit Mike",
    status: "online",
    battery: 91,
    signal: 99,
    temperature: 44,
    location: "Production Line 2",
    country: "South Korea",
    state: "Seoul",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "AURA-014",
    name: "Unit November",
    status: "error",
    battery: 22,
    signal: 65,
    temperature: 71,
    location: "Corridor 1A",
    country: "India",
    state: "Karnataka",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 45 * 60000),
  },
  {
    id: "AURA-015",
    name: "Unit Oscar",
    status: "online",
    battery: 79,
    signal: 93,
    temperature: 39,
    location: "Quality Control",
    country: "Brazil",
    state: "São Paulo",
    region: "South America",
    lastUpdated: new Date(Date.now() - 7 * 60000),
  },
  {
    id: "AURA-016",
    name: "Unit Papa",
    status: "online",
    battery: 86,
    signal: 94,
    temperature: 43,
    location: "Packaging Area",
    country: "United States",
    state: "California",
    region: "North America",
    lastUpdated: new Date(Date.now() - 3 * 60000),
  },
  {
    id: "AURA-017",
    name: "Unit Quebec",
    status: "charging",
    battery: 52,
    signal: 89,
    temperature: 35,
    location: "Charging Bay 1",
    country: "United States",
    state: "Texas",
    region: "North America",
    lastUpdated: new Date(Date.now() - 12 * 60000),
  },
  {
    id: "AURA-018",
    name: "Unit Romeo",
    status: "online",
    battery: 81,
    signal: 97,
    temperature: 41,
    location: "Testing Lab",
    country: "Canada",
    state: "Ontario",
    region: "North America",
    lastUpdated: new Date(Date.now() - 4 * 60000),
  },
  {
    id: "AURA-019",
    name: "Unit Sierra",
    status: "offline",
    battery: 12,
    signal: 8,
    temperature: 24,
    location: "Maintenance Dock",
    country: "Germany",
    state: "Bavaria",
    region: "Europe",
    lastUpdated: new Date(Date.now() - 180 * 60000),
  },
  {
    id: "AURA-020",
    name: "Unit Tango",
    status: "online",
    battery: 89,
    signal: 100,
    temperature: 40,
    location: "Warehouse C",
    country: "United Kingdom",
    state: "London",
    region: "Europe",
    lastUpdated: new Date(Date.now() - 1 * 60000),
  },
  {
    id: "AURA-021",
    name: "Unit Uniform",
    status: "charging",
    battery: 38,
    signal: 90,
    temperature: 36,
    location: "Charging Bay 2",
    country: "France",
    state: "Île-de-France",
    region: "Europe",
    lastUpdated: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "AURA-022",
    name: "Unit Victor",
    status: "online",
    battery: 74,
    signal: 88,
    temperature: 47,
    location: "Assembly Area",
    country: "Japan",
    state: "Tokyo",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "AURA-023",
    name: "Unit Whiskey",
    status: "online",
    battery: 93,
    signal: 100,
    temperature: 42,
    location: "Production Line 3",
    country: "Singapore",
    state: "Singapore",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "AURA-024",
    name: "Unit X-Ray",
    status: "error",
    battery: 18,
    signal: 48,
    temperature: 69,
    location: "Lab Floor 3",
    country: "Australia",
    state: "New South Wales",
    region: "Asia Pacific",
    lastUpdated: new Date(Date.now() - 50 * 60000),
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  // Real-time data hook
  const { robots, isLive } = useRealtimeRobotData(mockRobots, autoRefreshEnabled, 30000);
  const { isConnected, latency } = useConnectionStatus();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [batteryFilter, setBatteryFilter] = useState<string>("all");
  const [temperatureFilter, setTemperatureFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique values for filters
  const uniqueLocations = Array.from(new Set(robots.map((r) => r.location))).sort();
  const uniqueCountries = Array.from(new Set(robots.map((r) => r.country))).sort();
  const uniqueStates = Array.from(new Set(robots.map((r) => r.state))).sort();
  const uniqueRegions = Array.from(new Set(robots.map((r) => r.region))).sort();

  // Apply all filters
  const filteredRobots = robots
    .filter((robot) => {
      // Search filter
      const matchesSearch =
        robot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        robot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        robot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        robot.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        robot.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        robot.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        robot.status.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== "all" && robot.status !== statusFilter) return false;

      // Battery filter
      if (batteryFilter !== "all") {
        const battery = robot.battery;
        if (batteryFilter === "critical" && battery >= 30) return false;
        if (batteryFilter === "low" && (battery < 30 || battery >= 60)) return false;
        if (batteryFilter === "medium" && (battery < 60 || battery >= 85)) return false;
        if (batteryFilter === "high" && battery < 85) return false;
      }

      // Temperature filter
      if (temperatureFilter !== "all") {
        const temp = robot.temperature;
        if (temperatureFilter === "normal" && (temp < 35 || temp > 50)) return false;
        if (temperatureFilter === "warning" && (temp < 50 || temp > 65)) return false;
        if (temperatureFilter === "critical" && temp <= 65) return false;
      }

      // Location filter
      if (locationFilter !== "all" && robot.location !== locationFilter) return false;
      
      // Country filter
      if (countryFilter !== "all" && robot.country !== countryFilter) return false;
      
      // State filter  
      if (stateFilter !== "all" && robot.state !== stateFilter) return false;
      
      // Region filter
      if (regionFilter !== "all" && robot.region !== regionFilter) return false;

      return true;
    });

  // Calculate KPI metrics
  const totalRobots = robots.length;
  const onlineCount = robots.filter((r) => r.status === "online").length;
  const offlineCount = robots.filter((r) => r.status === "offline").length;
  const chargingCount = robots.filter((r) => r.status === "charging").length;
  const errorCount = robots.filter((r) => r.status === "error").length;
  const avgBattery = Math.round(robots.reduce((acc, r) => acc + r.battery, 0) / totalRobots);
  const criticalAlerts = robots.filter((r) => r.status === "error" || r.battery < 20 || r.temperature > 65).length;
  const fleetHealth = Math.round(((onlineCount + chargingCount) / totalRobots) * 100);
  const avgUptime = 99.2; // Mock value - would be calculated from real data

  // Sort filtered robots
  const sortedRobots = [...filteredRobots].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "battery-asc":
        return a.battery - b.battery;
      case "battery-desc":
        return b.battery - a.battery;
      case "status":
        return a.status.localeCompare(b.status);
      case "updated":
        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedRobots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRobots = sortedRobots.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Analytics calculations
  const avgTemp = Math.round(robots.reduce((sum, r) => sum + r.temperature, 0) / totalRobots);
  const avgSignal = Math.round(robots.reduce((sum, r) => sum + r.signal, 0) / totalRobots);

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    return [
      { name: "Online", value: onlineCount, fill: "#10b981" },
      { name: "Charging", value: chargingCount, fill: "#f59e0b" },
      { name: "Offline", value: offlineCount, fill: "#6b7280" },
      { name: "Error", value: errorCount, fill: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [onlineCount, chargingCount, offlineCount, errorCount]);

  // Battery distribution
  const batteryDistribution = useMemo(() => {
    const critical = robots.filter((r) => r.battery < 20).length;
    const low = robots.filter((r) => r.battery >= 20 && r.battery < 50).length;
    const medium = robots.filter((r) => r.battery >= 50 && r.battery < 80).length;
    const high = robots.filter((r) => r.battery >= 80).length;

    return [
      { name: "Critical (<20%)", value: critical, fill: "#ef4444" },
      { name: "Low (20-50%)", value: low, fill: "#f59e0b" },
      { name: "Medium (50-80%)", value: medium, fill: "#3b82f6" },
      { name: "High (80%+)", value: high, fill: "#10b981" },
    ].filter((item) => item.value > 0);
  }, [robots]);

  // Temperature distribution
  const temperatureDistribution = useMemo(() => {
    const optimal = robots.filter((r) => r.temperature < 45).length;
    const normal = robots.filter((r) => r.temperature >= 45 && r.temperature < 60).length;
    const warning = robots.filter((r) => r.temperature >= 60 && r.temperature < 70).length;
    const critical = robots.filter((r) => r.temperature >= 70).length;

    return [
      { name: "Optimal (<45°C)", value: optimal, fill: "#06b6d4" },
      { name: "Normal (45-60°C)", value: normal, fill: "#10b981" },
      { name: "Warning (60-70°C)", value: warning, fill: "#f59e0b" },
      { name: "Critical (70°C+)", value: critical, fill: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [robots]);

  // Battery trend data (24h simulation)
  const batteryTrendData = useMemo(() => {
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
  }, []);

  // Temperature trend data (24h simulation)
  const temperatureTrendData = useMemo(() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({
        time: `${i}:00`,
        avgTemp: 40 + i * 0.5 + Math.random() * 8,
        maxTemp: 48 + i * 0.3 + Math.random() * 10,
      });
    }
    return hours;
  }, []);

  // Location stats for bar chart
  const locationStats = useMemo(() => {
    const locationMap: { [key: string]: number } = {};
    robots.forEach((robot) => {
      locationMap[robot.location] = (locationMap[robot.location] || 0) + 1;
    });
    return Object.entries(locationMap)
      .map(([location, count]) => ({
        location: location.substring(0, 15),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [robots]);

  // Regional distribution stats
  const regionStats = useMemo(() => {
    const regionMap: { [key: string]: number } = {};
    robots.forEach((robot) => {
      regionMap[robot.region] = (regionMap[robot.region] || 0) + 1;
    });
    return Object.entries(regionMap)
      .map(([region, count]) => ({
        region,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [robots]);

  // Country distribution stats  
  const countryStats = useMemo(() => {
    const countryMap: { [key: string]: number } = {};
    robots.forEach((robot) => {
      countryMap[robot.country] = (countryMap[robot.country] || 0) + 1;
    });
    return Object.entries(countryMap)
      .map(([country, count]) => ({
        country: country.length > 12 ? country.substring(0, 12) + "..." : country,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [robots]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success text-success-foreground";
      case "charging":
        return "bg-warning text-warning-foreground";
      case "offline":
        return "bg-muted text-muted-foreground";
      case "error":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return "text-success";
    if (battery > 30) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      {/* KPI Cards */}
      <div className="mb-6 sm:mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {/* Fleet Health */}
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Fleet Health</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-xl sm:text-2xl font-bold text-primary">{fleetHealth}%</p>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-1.5">
              <div
                className="bg-success h-1.5 rounded-full transition-all"
                style={{ width: `${fleetHealth}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Online Units */}
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Online</span>
              <Activity className="w-4 h-4 text-success" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-success">{onlineCount}/{totalRobots}</p>
          </div>
        </Card>

        {/* Average Battery */}
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Avg Battery</span>
              <Battery className="w-4 h-4 text-primary" />
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${avgBattery > 60 ? 'text-success' : avgBattery > 30 ? 'text-warning' : 'text-destructive'}`}>
              {avgBattery}%
            </p>
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card 
          className="p-3 sm:p-4 card-gradient border-border cursor-pointer hover:border-primary transition-colors"
          onClick={() => navigate("/alerts")}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Alerts</span>
              <Activity className={`w-4 h-4 ${criticalAlerts > 0 ? 'text-destructive animate-pulse' : 'text-success'}`} />
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${criticalAlerts > 0 ? 'text-destructive' : 'text-success'}`}>
              {criticalAlerts}
            </p>
            <p className="text-xs text-muted-foreground">Requires Attention</p>
          </div>
        </Card>

        {/* Offline Units */}
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Offline</span>
              <Signal className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-muted-foreground">{offlineCount}</p>
            <p className="text-xs text-muted-foreground">Disconnected</p>
          </div>
        </Card>

        {/* Uptime */}
        <Card className="p-3 sm:p-4 card-gradient border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Uptime</span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-success">{avgUptime}%</p>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search robots by name, ID, location, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2 text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters & Sorting - Compact Layout */}
      <div className="mb-4">
        <Card className="p-4 card-gradient border-border">
          <div className="flex flex-col gap-4">
            {/* Primary Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Status Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="charging">Charging</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Battery Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Battery</label>
                <Select value={batteryFilter} onValueChange={(value) => { setBatteryFilter(value); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical (&lt;30%)</SelectItem>
                    <SelectItem value="low">Low (30-60%)</SelectItem>
                    <SelectItem value="medium">Medium (60-85%)</SelectItem>
                    <SelectItem value="high">High (85%+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>



              {/* Temperature Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Temperature</label>
                <Select value={temperatureFilter} onValueChange={(value) => { setTemperatureFilter(value); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Temps</SelectItem>
                    <SelectItem value="normal">Normal (&lt;50°C)</SelectItem>
                    <SelectItem value="warning">Warning (50-65°C)</SelectItem>
                    <SelectItem value="critical">Critical (&gt;65°C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="battery-desc">Battery (High-Low)</SelectItem>
                    <SelectItem value="battery-asc">Battery (Low-High)</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="updated">Recently Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Secondary Filters Row - Geographical */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Region Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Region</label>
                <Select value={regionFilter} onValueChange={(value) => { setRegionFilter(value); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {uniqueRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Country</label>
                <Select value={countryFilter} onValueChange={(value) => { setCountryFilter(value); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">State/Province</label>
                <Select value={stateFilter} onValueChange={(value) => { setStateFilter(value); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {uniqueStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter (Specific) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Specific Location</label>
                <Select value={locationFilter} onValueChange={(value) => { setLocationFilter(value); handleFilterChange(); }}>
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear All Filters Button */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setBatteryFilter("all");
                  setTemperatureFilter("all");
                  setLocationFilter("all");
                  setCountryFilter("all");
                  setStateFilter("all");
                  setRegionFilter("all");
                  setSortBy("name");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="h-8 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All Filters
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Filters Display & Results Count */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Results Summary */}
          <div className="text-sm text-muted-foreground">
            {sortedRobots.length === robots.length ? (
              <>Showing <span className="font-semibold text-foreground">{sortedRobots.length}</span> robots</>
            ) : (
              <>Showing <span className="font-semibold text-foreground">{sortedRobots.length}</span> of <span className="font-semibold">{robots.length}</span> robots</>
            )}
            {(statusFilter !== "all" || batteryFilter !== "all" || temperatureFilter !== "all" || locationFilter !== "all" || countryFilter !== "all" || stateFilter !== "all" || regionFilter !== "all" || searchQuery) && (
              <span className="ml-1">• {[
                statusFilter !== "all" ? 1 : 0,
                batteryFilter !== "all" ? 1 : 0,
                temperatureFilter !== "all" ? 1 : 0,
                locationFilter !== "all" ? 1 : 0,
                countryFilter !== "all" ? 1 : 0,
                stateFilter !== "all" ? 1 : 0,
                regionFilter !== "all" ? 1 : 0,
                searchQuery ? 1 : 0
              ].reduce((a, b) => a + b, 0)} filter{[
                statusFilter !== "all" ? 1 : 0,
                batteryFilter !== "all" ? 1 : 0,
                temperatureFilter !== "all" ? 1 : 0,
                locationFilter !== "all" ? 1 : 0,
                countryFilter !== "all" ? 1 : 0,
                stateFilter !== "all" ? 1 : 0,
                regionFilter !== "all" ? 1 : 0,
                searchQuery ? 1 : 0
              ].reduce((a, b) => a + b, 0) !== 1 ? 's' : ''} active</span>
            )}
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {batteryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                Battery: {batteryFilter}
                <button
                  onClick={() => setBatteryFilter("all")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {temperatureFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                Temp: {temperatureFilter}
                <button
                  onClick={() => setTemperatureFilter("all")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {locationFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                Location: {locationFilter}
                <button
                  onClick={() => setLocationFilter("all")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {regionFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                Region: {regionFilter}
                <button
                  onClick={() => setRegionFilter("all")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {countryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                Country: {countryFilter}
                <button
                  onClick={() => setCountryFilter("all")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {stateFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                State: {stateFilter}
                <button
                  onClick={() => setStateFilter("all")}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Robot Table */}
      <Card className="card-gradient border-border overflow-hidden">
        {sortedRobots.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Robot</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRobots.map((robot) => (
                    <TableRow
                      key={robot.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/robot/${robot.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isLive && (
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" title="Live data" />
                          )}
                          <Badge className={getStatusColor(robot.status)}>
                            {robot.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{robot.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Battery className={`w-4 h-4 ${getBatteryColor(robot.battery)}`} />
                          <span className={`font-mono font-semibold ${getBatteryColor(robot.battery)}`}>
                            {robot.battery}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{robot.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/robot/${robot.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {paginatedRobots.map((robot) => (
                <div
                  key={robot.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/robot/${robot.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-base mb-1">{robot.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{robot.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLive && (
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      )}
                      <Badge className={getStatusColor(robot.status)}>{robot.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Battery className={`w-4 h-4 ${getBatteryColor(robot.battery)}`} />
                      <span className={`font-mono font-semibold ${getBatteryColor(robot.battery)}`}>
                        {robot.battery}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm truncate">{robot.location}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/robot/${robot.id}`);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 p-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedRobots.length)} of {sortedRobots.length} robots
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1 px-2">
                    <span className="text-sm font-medium">{currentPage}</span>
                    <span className="text-sm text-muted-foreground">of</span>
                    <span className="text-sm font-medium">{totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No robots found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setBatteryFilter("all");
                setTemperatureFilter("all");
                setLocationFilter("all");
                setCountryFilter("all");
                setStateFilter("all");
                setRegionFilter("all");
                setCurrentPage(1);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Analytics Section */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Fleet Analytics
          </h2>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
        <Card className="p-4 card-gradient border-border">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Battery Level Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={batteryTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="time" className="fill-muted-foreground" />
              <YAxis className="fill-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem"
                }} 
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Line type="monotone" dataKey="avgBattery" stroke="#3b82f6" strokeWidth={2} dot={false} name="Average Battery" />
              <Line type="monotone" dataKey="maxBattery" stroke="#10b981" strokeWidth={2} dot={false} name="Max Battery" />
              <Line type="monotone" dataKey="minBattery" stroke="#ef4444" strokeWidth={2} dot={false} name="Min Battery" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Temperature Distribution & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                <XAxis dataKey="time" className="fill-muted-foreground" />
                <YAxis className="fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }} 
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
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
              <XAxis dataKey="location" className="fill-muted-foreground" />
              <YAxis className="fill-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem"
                }} 
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Regional Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  className="fill-muted-foreground" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }} 
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
