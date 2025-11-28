import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Info,
  Shield,
  Clock,
  FileText,
} from "lucide-react";

interface OTAUpdateManagerProps {
  robotId: string;
}

type UpdateStatus = "idle" | "uploading" | "installing" | "success" | "failed";

interface FirmwareVersion {
  version: string;
  releaseDate: string;
  size: string;
  description: string;
}

interface UpdateHistory {
  version: string;
  date: string;
  status: "success" | "failed";
  duration: string;
}

export function OTAUpdateManager({ robotId }: OTAUpdateManagerProps) {
  const [currentVersion] = useState("2.4.1");
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableVersions: FirmwareVersion[] = [
    {
      version: "2.5.0",
      releaseDate: "2025-11-25",
      size: "45.2 MB",
      description: "Performance improvements, new motion algorithms, bug fixes",
    },
    {
      version: "2.4.2",
      releaseDate: "2025-11-18",
      size: "43.8 MB",
      description: "Security patch, stability improvements",
    },
  ];

  const updateHistory: UpdateHistory[] = [
    { version: "2.4.1", date: "2025-11-10 14:32", status: "success", duration: "4m 23s" },
    { version: "2.4.0", date: "2025-10-28 09:15", status: "success", duration: "4m 18s" },
    { version: "2.3.5", date: "2025-10-15 16:45", status: "failed", duration: "2m 10s" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (simulated - would check .bin, .hex, etc. in production)
      if (!file.name.endsWith(".bin") && !file.name.endsWith(".hex")) {
        setErrorMessage("Invalid firmware file. Please select a .bin or .hex file.");
        setSelectedFile(null);
        return;
      }
      
      // Validate file size (e.g., max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage("File too large. Maximum size is 100MB.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setErrorMessage("");
    }
  };

  const simulateUpload = () => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(resolve, 300);
        }
        setUploadProgress(Math.min(progress, 100));
      }, 200);
    });
  };

  const simulateInstall = () => {
    return new Promise<void>((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // 10% chance of simulated failure
          if (Math.random() > 0.9) {
            setTimeout(() => reject(new Error("Installation verification failed")), 300);
          } else {
            setTimeout(resolve, 300);
          }
        }
        setInstallProgress(Math.min(progress, 100));
      }, 250);
    });
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a firmware file first.");
      return;
    }

    setErrorMessage("");
    setUploadProgress(0);
    setInstallProgress(0);

    try {
      // Phase 1: Uploading
      setUpdateStatus("uploading");
      await simulateUpload();

      // Phase 2: Installing
      setUpdateStatus("installing");
      await simulateInstall();

      // Success
      setUpdateStatus("success");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setUpdateStatus("failed");
      setErrorMessage(error instanceof Error ? error.message : "Update failed");
    }
  };

  const resetUpdate = () => {
    setUpdateStatus("idle");
    setUploadProgress(0);
    setInstallProgress(0);
    setErrorMessage("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusIcon = () => {
    switch (updateStatus) {
      case "uploading":
        return <Upload className="w-5 h-5 animate-pulse text-cyan-400" />;
      case "installing":
        return <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Download className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (updateStatus) {
      case "uploading":
        return "Uploading firmware...";
      case "installing":
        return "Installing update...";
      case "success":
        return "Update completed successfully!";
      case "failed":
        return "Update failed";
      default:
        return "Ready to update";
    }
  };

  const getStatusColor = () => {
    switch (updateStatus) {
      case "uploading":
      case "installing":
        return "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
      case "success":
        return "bg-success/20 text-success border-success/30";
      case "failed":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Current Version Card */}
      <Card className="p-3 sm:p-4 bg-gradient-to-br from-card/80 to-card/60 dark:from-card/80 dark:to-card/60 border-border/30 dark:border-border backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Current Version</h3>
              <p className="text-xs text-muted-foreground">Robot: {robotId}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-bold text-cyan-500 dark:text-cyan-400">v{currentVersion}</span>
            <Badge variant="outline" className="ml-2 bg-success/20 text-success border-success/30 text-xs">
              Active
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p className="font-medium text-foreground">Nov 10, 2025</p>
          </div>
          <div>
            <p className="text-muted-foreground">Uptime</p>
            <p className="font-medium text-foreground">18d 7h</p>
          </div>
        </div>
      </Card>

      {/* Update Status Card */}
      <Card className={`p-3 sm:p-4 border ${getStatusColor()} transition-all`}>
        <div className="flex items-center gap-2 mb-3">
          {getStatusIcon()}
          <h3 className="text-sm sm:text-base font-semibold">{getStatusText()}</h3>
        </div>

        {updateStatus === "uploading" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading firmware file...</span>
              <span className="font-mono">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Transferring firmware to robot memory
            </p>
          </div>
        )}

        {updateStatus === "installing" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Installing and verifying...</span>
              <span className="font-mono">{Math.round(installProgress)}%</span>
            </div>
            <Progress value={installProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Please do not power off the robot during installation
            </p>
          </div>
        )}

        {updateStatus === "success" && (
          <Alert className="bg-success/10 border-success/30">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Firmware update completed successfully. Robot will reboot in 10 seconds.
            </AlertDescription>
          </Alert>
        )}

        {updateStatus === "failed" && errorMessage && (
          <Alert className="bg-destructive/10 border-destructive/30">
            <XCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Upload New Firmware */}
      <Card className="p-3 sm:p-4 bg-gradient-to-br from-card/80 to-card/60 dark:from-card/80 dark:to-card/60 border-border/30 dark:border-border backdrop-blur-sm">
        <h3 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Upload className="w-4 h-4" />
          Upload Firmware
        </h3>

        <div className="space-y-3">
          <div>
            <Label htmlFor="firmware-file" className="text-xs font-medium text-muted-foreground">
              Select File (.bin, .hex)
            </Label>
            <Input
              id="firmware-file"
              type="file"
              accept=".bin,.hex"
              ref={fileInputRef}
              onChange={handleFileSelect}
              disabled={updateStatus === "uploading" || updateStatus === "installing"}
              className="mt-1 cursor-pointer text-sm"
            />
            {selectedFile && (
              <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-2">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
              </p>
            )}
            {errorMessage && updateStatus === "idle" && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              disabled={!selectedFile || updateStatus === "uploading" || updateStatus === "installing"}
              className="flex-1 bg-primary hover:bg-primary/90 text-sm"
              size="sm"
            >
              {updateStatus === "uploading" || updateStatus === "installing" ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                  <span className="hidden xs:inline">Updating...</span>
                  <span className="xs:hidden">...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 mr-2" />
                  <span className="hidden xs:inline">Start Update</span>
                  <span className="xs:hidden">Update</span>
                </>
              )}
            </Button>
            
            {(updateStatus === "success" || updateStatus === "failed") && (
              <Button onClick={resetUpdate} variant="outline">
                Reset
              </Button>
            )}
          </div>

          <Alert className="bg-warning/10 border-warning/30">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning text-xs">
              Warning: Ensure robot is connected to power during update. Do not interrupt the update process.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Available Firmware Versions */}
      <Card className="p-3 sm:p-4 bg-gradient-to-br from-card/80 to-card/60 dark:from-card/80 dark:to-card/60 border-border/30 dark:border-border backdrop-blur-sm">
        <h3 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Download className="w-4 h-4" />
          Available Versions
        </h3>

        <div className="space-y-2">
          {availableVersions.map((fw) => (
            <div
              key={fw.version}
              className="p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 text-sm">v{fw.version}</span>
                    {fw.version === "2.5.0" && (
                      <Badge variant="outline" className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs">
                        Latest
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{fw.releaseDate}</span>
                    <span>•</span>
                    <span>{fw.size}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs ml-2">
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline ml-1">Get</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{fw.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Update History */}
      <Card className="p-3 sm:p-4 bg-gradient-to-br from-card/80 to-card/60 dark:from-card/80 dark:to-card/60 border-border/30 dark:border-border backdrop-blur-sm">
        <h3 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Info className="w-4 h-4" />
          History
        </h3>

        <div className="space-y-2">
          {updateHistory.slice(0, 3).map((update, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {update.status === "success" ? (
                  <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="w-3 h-3 text-destructive flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">v{update.version}</p>
                  <p className="text-xs text-muted-foreground">{update.date.split(' ')[0]}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge
                  variant="outline"
                  className={
                    update.status === "success"
                      ? "bg-success/20 text-success border-success/30 text-xs"
                      : "bg-destructive/20 text-destructive border-destructive/30 text-xs"
                  }
                >
                  {update.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{update.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
