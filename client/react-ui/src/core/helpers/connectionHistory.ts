import type { Pm2HttpServer } from "../../types/localStorage";

export const upsertTargetServer = (history: Pm2HttpServer[], item: Pm2HttpServer) => {
    const currentIndex = history.findIndex(h => h.baseUrl === item.baseUrl);
    if (currentIndex === -1) {
        history.push(item);
    }
    return history;
};
