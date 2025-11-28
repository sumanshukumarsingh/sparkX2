import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";

interface JointData {
  name: string;
  angle: number;
  targetAngle: number;
  torque: number;
  temperature: number;
  status: "ok" | "warning" | "error";
}

interface JointGroup {
  name: string;
  joints: JointData[];
}

export function JointStatusPanel() {
  const [jointGroups, setJointGroups] = useState<JointGroup[]>([
    {
      name: "Neck Joint (3 DOF)",
      joints: [
        { name: "Neck Pitch", angle: 5, targetAngle: 5, torque: 12, temperature: 38, status: "ok" },
        { name: "Neck Yaw", angle: -2, targetAngle: 0, torque: 8, temperature: 37, status: "ok" },
        { name: "Neck Roll", angle: 1, targetAngle: 0, torque: 7, temperature: 36, status: "ok" },
      ],
    },
    {
      name: "Shoulder Joints (6 DOF)",
      joints: [
        { name: "L Shoulder Pitch", angle: 45, targetAngle: 45, torque: 35, temperature: 42, status: "ok" },
        { name: "L Shoulder Roll", angle: 15, targetAngle: 15, torque: 28, temperature: 41, status: "ok" },
        { name: "L Shoulder Yaw", angle: 0, targetAngle: 0, torque: 18, temperature: 39, status: "ok" },
        { name: "R Shoulder Pitch", angle: 42, targetAngle: 45, torque: 38, temperature: 43, status: "warning" },
        { name: "R Shoulder Roll", angle: -15, targetAngle: -15, torque: 30, temperature: 42, status: "ok" },
        { name: "R Shoulder Yaw", angle: 0, targetAngle: 0, torque: 20, temperature: 40, status: "ok" },
      ],
    },
    {
      name: "Elbow Joints (6 DOF)",
      joints: [
        { name: "L Elbow Pitch", angle: 90, targetAngle: 90, torque: 22, temperature: 40, status: "ok" },
        { name: "L Elbow Roll", angle: 5, targetAngle: 5, torque: 18, temperature: 39, status: "ok" },
        { name: "L Elbow Yaw", angle: 0, targetAngle: 0, torque: 15, temperature: 38, status: "ok" },
        { name: "R Elbow Pitch", angle: 88, targetAngle: 90, torque: 24, temperature: 41, status: "ok" },
        { name: "R Elbow Roll", angle: -5, targetAngle: -5, torque: 19, temperature: 40, status: "ok" },
        { name: "R Elbow Yaw", angle: 0, targetAngle: 0, torque: 16, temperature: 39, status: "ok" },
      ],
    },
    {
      name: "Wrist Joints (4 DOF)",
      joints: [
        { name: "L Wrist Pitch", angle: 10, targetAngle: 10, torque: 8, temperature: 36, status: "ok" },
        { name: "L Wrist Roll", angle: 0, targetAngle: 0, torque: 5, temperature: 35, status: "ok" },
        { name: "R Wrist Pitch", angle: 12, targetAngle: 10, torque: 9, temperature: 37, status: "ok" },
        { name: "R Wrist Roll", angle: 0, targetAngle: 0, torque: 6, temperature: 36, status: "ok" },
      ],
    },
    {
      name: "Grippers (2 DOF)",
      joints: [
        { name: "L Gripper", angle: 30, targetAngle: 30, torque: 45, temperature: 34, status: "ok" },
        { name: "R Gripper", angle: 28, targetAngle: 30, torque: 42, temperature: 35, status: "ok" },
      ],
    },
    {
      name: "Hip Joint (3 DOF)",
      joints: [
        { name: "Hip Pitch", angle: -5, targetAngle: -5, torque: 75, temperature: 46, status: "ok" },
        { name: "Hip Roll", angle: 0, targetAngle: 0, torque: 68, temperature: 45, status: "ok" },
        { name: "Hip Yaw", angle: 2, targetAngle: 0, torque: 62, temperature: 44, status: "ok" },
      ],
    },
    {
      name: "Knee High Joints (2 DOF)",
      joints: [
        { name: "L Knee High", angle: 35, targetAngle: 35, torque: 82, temperature: 49, status: "ok" },
        { name: "R Knee High", angle: 36, targetAngle: 35, torque: 85, temperature: 50, status: "ok" },
      ],
    },
    {
      name: "Knee Low Joints (2 DOF)",
      joints: [
        { name: "L Knee Low", angle: 45, targetAngle: 45, torque: 88, temperature: 51, status: "ok" },
        { name: "R Knee Low", angle: 47, targetAngle: 45, torque: 92, temperature: 52, status: "warning" },
      ],
    },
    {
      name: "Ankle Joints (4 DOF)",
      joints: [
        { name: "L Ankle Pitch", angle: 10, targetAngle: 10, torque: 72, temperature: 49, status: "ok" },
        { name: "L Ankle Roll", angle: -2, targetAngle: 0, torque: 58, temperature: 47, status: "ok" },
        { name: "R Ankle Pitch", angle: 10, targetAngle: 10, torque: 75, temperature: 50, status: "ok" },
        { name: "R Ankle Roll", angle: 2, targetAngle: 0, torque: 60, temperature: 48, status: "ok" },
      ],
    },
  ]);

  // Simulate live joint updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJointGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          joints: group.joints.map((joint) => {
            // Randomly update angles slightly
            const newAngle = joint.angle + (Math.random() - 0.5) * 2;
            const angleDiff = Math.abs(newAngle - joint.targetAngle);
            
            // Update temperature
            const newTemp = Math.min(65, Math.max(35, joint.temperature + (Math.random() - 0.5) * 1));
            
            // Determine status based on angle error and temperature
            let status: "ok" | "warning" | "error" = "ok";
            if (angleDiff > 5 || newTemp > 55) {
              status = "warning";
            }
            if (angleDiff > 10 || newTemp > 60) {
              status = "error";
            }

            return {
              ...joint,
              angle: newAngle,
              temperature: newTemp,
              torque: Math.min(100, Math.max(0, joint.torque + (Math.random() - 0.5) * 5)),
              status,
            };
          }),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="w-3 h-3 text-success" />;
      case "warning":
        return <AlertCircle className="w-3 h-3 text-warning" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-destructive" />;
      default:
        return <Activity className="w-3 h-3 text-slate-600 dark:text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getTempColor = (temp: number) => {
    if (temp < 45) return "text-success";
    if (temp < 55) return "text-warning";
    return "text-destructive";
  };

  const totalJoints = jointGroups.reduce((acc, group) => acc + group.joints.length, 0);
  const healthyJoints = jointGroups.reduce(
    (acc, group) => acc + group.joints.filter((j) => j.status === "ok").length,
    0
  );
  const warningJoints = jointGroups.reduce(
    (acc, group) => acc + group.joints.filter((j) => j.status === "warning").length,
    0
  );
  const errorJoints = jointGroups.reduce(
    (acc, group) => acc + group.joints.filter((j) => j.status === "error").length,
    0
  );

  const healthPercentage = (healthyJoints / totalJoints) * 100;

  return (
    <Card className="p-4 card-gradient border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Joint & Actuator Status</h3>
          <p className="text-xs text-muted-foreground">32 DOF across 16 joint groups</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm font-medium">{healthyJoints}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium">{warningJoints}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium">{errorJoints}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Overall Health</span>
          <span className="text-sm font-bold">{healthPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={healthPercentage} className="h-2" />
      </div>

      {/* Organized by body sections */}
      <div className="space-y-6">
        {/* HEAD SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cyan-800">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide">Head</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jointGroups
              .filter((group) => group.name.includes("Neck"))
              .map((group) =>
                group.joints.map((joint) => (
                  <div
                    key={joint.name}
                    className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(joint.status)}
                        <span className="text-xs font-semibold">{joint.name}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(joint.status)}`}>
                        {joint.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Angle</p>
                        <p className="text-xs font-mono font-bold">{joint.angle.toFixed(1)}°</p>
                        <p className="text-xs text-muted-foreground">(→{joint.targetAngle.toFixed(0)}°)</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Torque</p>
                        <p className="text-xs font-mono font-bold">{joint.torque.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className={`text-xs font-mono font-bold ${getTempColor(joint.temperature)}`}>
                          {joint.temperature.toFixed(0)}°C
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>

        {/* UPPER BODY SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-800">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wide">Upper Body</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jointGroups
              .filter((group) => 
                group.name.includes("Shoulder") || 
                group.name.includes("Elbow") || 
                group.name.includes("Wrist") || 
                group.name.includes("Gripper")
              )
              .map((group) => (
                <div key={group.name} className="space-y-2">
                  <h5 className="text-xs font-semibold text-blue-300 pl-1">{group.name}</h5>
                  {group.joints.map((joint) => (
                    <div
                      key={joint.name}
                      className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(joint.status)}
                          <span className="text-xs font-semibold">{joint.name}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(joint.status)}`}>
                          {joint.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Angle</p>
                          <p className="text-xs font-mono font-bold">{joint.angle.toFixed(1)}°</p>
                          <p className="text-xs text-muted-foreground">(→{joint.targetAngle.toFixed(0)}°)</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Torque</p>
                          <p className="text-xs font-mono font-bold">{joint.torque.toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Temp</p>
                          <p className={`text-xs font-mono font-bold ${getTempColor(joint.temperature)}`}>
                            {joint.temperature.toFixed(0)}°C
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>

        {/* LOWER BODY SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-800">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wide">Lower Body</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jointGroups
              .filter((group) => 
                group.name.includes("Hip") || 
                group.name.includes("Knee") || 
                group.name.includes("Ankle")
              )
              .map((group) => (
                <div key={group.name} className="space-y-2">
                  <h5 className="text-xs font-semibold text-purple-300 pl-1">{group.name}</h5>
                  {group.joints.map((joint) => (
                    <div
                      key={joint.name}
                      className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-purple-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(joint.status)}
                          <span className="text-xs font-semibold">{joint.name}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(joint.status)}`}>
                          {joint.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Angle</p>
                          <p className="text-xs font-mono font-bold">{joint.angle.toFixed(1)}°</p>
                          <p className="text-xs text-muted-foreground">(→{joint.targetAngle.toFixed(0)}°)</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Torque</p>
                          <p className="text-xs font-mono font-bold">{joint.torque.toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Temp</p>
                          <p className={`text-xs font-mono font-bold ${getTempColor(joint.temperature)}`}>
                            {joint.temperature.toFixed(0)}°C
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
