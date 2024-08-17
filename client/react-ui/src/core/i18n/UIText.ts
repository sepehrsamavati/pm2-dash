import type { UITextType } from "@/common/types/UIText";

const UIText = Object.freeze({
    _appTitle: "PM2 GUI",
    connectToPm2: "Connect to PM2",
    noContentToShow: "No content to show",
    noProcessInList: "No process in list",
    type: "Type",
    port: "Port",
    protocol: "Protocol",
    hostname: "Hostname",
    connect: "Connect",
    disconnect: "Disconnect",
    start: "Start",
    restart: "Restart",
    stop: "Stop",
    flush: "Flush",
    reset: "Reset",
    flushAll: "Flush all",
    resetAll: "Reset restart count",
    refresh: "Refresh",
    autoRefresh: "Auto refresh",
    cpuPercentage: "CPU (%)",
    memoryMegabyteUsage: "RAM (MB)",
    succeeded: "Succeeded",
    failed: "Failed",
    connectFailed: "Failed to connect!",
    unknown: "Unknown"
} as UITextType);

export default UIText;
