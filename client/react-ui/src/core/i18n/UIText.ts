import type { OperationResultType } from "@/common/types/OperationResult";
import type { UITextKey, UITextKeyOptional, UITextType } from "@/common/types/UIText";

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
    unknown: "Unknown",
    unknownError: "Unknown error",
    token: "Token",
    invalidToken: "Invalid token!",
    history: "History",
    clear: "Clear",
    log: "Log",
    readonlyMode: "Readonly mode",
    fieldIsRequired: "This field is required",
    minValidValue: "Minimum valid value is %s1",
    maxValidValue: "Maximum valid value is %s1",
    minValidLength: "Minimum valid value is %s1",
    maxValidLength: "Maximum valid value is %s1",
    validLength: "Length should be %s1 characters",
    login: "Login",
    username: "Username",
    password: "Password",
    return: "Return"
} as UITextType);

export const resultUIText = (result: OperationResultType) => UIText[result.message as UITextKey] ?? result.message;

export const optionalKeyToUIT = (key: UITextKeyOptional) => UIText[key as UITextKey] ?? key;

export default UIText;
