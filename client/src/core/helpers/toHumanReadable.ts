export function bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Number.parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) as unknown as string);
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export function msToHumanReadable(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximation
    const years = Math.floor(months / 12); // Approximation

    if (years > 0) {
        return `${years}Y`;
    } else if (months > 0) {
        return `${months}M`;
    } else if (days > 0) {
        return `${days}d`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else {
        return `${seconds}s`;
    }
}
