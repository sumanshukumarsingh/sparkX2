import { useEffect, useRef, useCallback, useState } from "react";

interface Robot {
  id: string;
  name: string;
  status: "online" | "charging" | "offline" | "error";
  battery: number;
  signal: number;
  temperature: number;
  location: string;
  lastUpdated: Date;
}

interface RealtimeUpdate {
  type: "battery" | "temperature" | "status" | "signal" | "alert";
  robotId: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

/**
 * Custom hook for real-time robot data updates
 * Simulates WebSocket connections with periodic data mutations
 */
export function useRealtimeRobotData(
  robots: Robot[],
  enabled: boolean = true,
  interval: number = 30000 // 30 seconds
) {
  const [updatedRobots, setUpdatedRobots] = useState<Robot[]>(robots);
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<Date>(new Date());

  // Simulate real-time data mutations
  const simulateUpdate = useCallback(() => {
    setUpdatedRobots((prevRobots) => {
      const newRobots = prevRobots.map((robot) => {
        const rand = Math.random();

        // 30% chance of any update
        if (rand > 0.7) {
          const updateType = Math.random();
          const newRobot = { ...robot, lastUpdated: new Date() };
          const newUpdates: RealtimeUpdate[] = [];

          if (updateType < 0.4) {
            // Update battery (±1-3%)
            const oldBattery = newRobot.battery;
            newRobot.battery = Math.max(0, Math.min(100, newRobot.battery + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3)));
            newUpdates.push({
              type: "battery",
              robotId: robot.id,
              oldValue: Math.round(oldBattery),
              newValue: Math.round(newRobot.battery),
              timestamp: new Date(),
            });
          } else if (updateType < 0.7) {
            // Update temperature (±1-2°C)
            const oldTemp = newRobot.temperature;
            newRobot.temperature = Math.max(20, Math.min(80, newRobot.temperature + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2)));
            newUpdates.push({
              type: "temperature",
              robotId: robot.id,
              oldValue: Math.round(oldTemp),
              newValue: Math.round(newRobot.temperature),
              timestamp: new Date(),
            });
          } else if (updateType < 0.85) {
            // Update signal (±2-5%)
            const oldSignal = newRobot.signal;
            newRobot.signal = Math.max(0, Math.min(100, newRobot.signal + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5)));
            newUpdates.push({
              type: "signal",
              robotId: robot.id,
              oldValue: Math.round(oldSignal),
              newValue: Math.round(newRobot.signal),
              timestamp: new Date(),
            });
          } else {
            // Rare: Status change (5-10% chance)
            const statuses: ("online" | "charging" | "offline" | "error")[] = ["online", "charging", "offline", "error"];
            const possibleStatuses = statuses.filter((s) => s !== robot.status);
            const oldStatus = newRobot.status;
            newRobot.status = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
            newUpdates.push({
              type: "status",
              robotId: robot.id,
              oldValue: oldStatus,
              newValue: newRobot.status,
              timestamp: new Date(),
            });
          }

          // Add to updates list
          if (newUpdates.length > 0) {
            setUpdates((prev) => {
              const updated = [...newUpdates, ...prev].slice(0, 50); // Keep last 50 updates
              return updated;
            });
          }

          lastUpdateRef.current = new Date();
          return newRobot;
        }

        return robot;
      });

      return newRobots;
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start periodic updates
    intervalRef.current = setInterval(simulateUpdate, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, simulateUpdate]);

  // Sync robots when input changes
  useEffect(() => {
    setUpdatedRobots(robots);
  }, [robots]);

  return {
    robots: updatedRobots,
    updates,
    lastUpdate: lastUpdateRef.current,
    isLive: enabled,
  };
}

/**
 * Hook to track KPI changes in real-time
 */
export function useRealtimeKPI(robots: Robot[]) {
  const [kpiHistory, setKpiHistory] = useState<
    Array<{
      timestamp: Date;
      fleetHealth: number;
      onlineCount: number;
      avgBattery: number;
      avgTemp: number;
      criticalAlerts: number;
    }>
  >([]);

  const calculateKPI = useCallback(() => {
    const onlineCount = robots.filter((r) => r.status === "online").length;
    const chargingCount = robots.filter((r) => r.status === "charging").length;
    const avgBattery = Math.round(robots.reduce((acc, r) => acc + r.battery, 0) / robots.length);
    const avgTemp = Math.round(robots.reduce((acc, r) => acc + r.temperature, 0) / robots.length);
    const criticalAlerts = robots.filter((r) => r.status === "error" || r.battery < 20 || r.temperature > 65).length;
    const fleetHealth = Math.round(((onlineCount + chargingCount) / robots.length) * 100);

    return { fleetHealth, onlineCount, avgBattery, avgTemp, criticalAlerts };
  }, [robots]);

  useEffect(() => {
    setKpiHistory((prev) => {
      const kpi = calculateKPI();
      const newHistory = [
        ...prev,
        {
          timestamp: new Date(),
          ...kpi,
        },
      ].slice(-100); // Keep last 100 data points
      return newHistory;
    });
  }, [calculateKPI]);

  return kpiHistory;
}

/**
 * Hook for connection status simulation
 */
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [latency, setLatency] = useState(Math.random() * 50 + 10); // 10-60ms

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection hiccups (1% chance)
      if (Math.random() > 0.99) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), Math.random() * 2000 + 500);
      }

      // Update latency ±5-15ms
      setLatency((prev) => Math.max(5, Math.min(200, prev + (Math.random() - 0.5) * 10)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, latency: Math.round(latency) };
}
