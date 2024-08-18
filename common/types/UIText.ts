const keys = [
    "_appTitle",
    "connectToPm2",
    "noContentToShow",
    "noProcessInList",
    "type",
    "port",
    "protocol",
    "hostname",
    "connect",
    "disconnect",
    "start",
    "restart",
    "stop",
    "flush",
    "reset",
    "flushAll",
    "resetAll",
    "refresh",
    "autoRefresh",
    "cpuPercentage",
    "memoryMegabyteUsage",
    "succeeded",
    "connectFailed",
    "unknown",
    "unknownError",
    "token",
    "invalidToken",
    "history",
    "clear",
    "log",
    "readonlyMode"
] as const;

export type UITextKey = typeof keys[number];

export type UITextKeyOptional = UITextKey | (string & {});

export type UITextType = {
    [Key in UITextKey]: string;
};
