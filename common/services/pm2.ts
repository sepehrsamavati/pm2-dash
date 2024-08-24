import pm2 from "pm2";
import type { Pm2ProcessDescription } from "../types/pm2";
import { OperationResult } from "../models/OperationResult";

const logger = console;

class PM2Service {

    getLogPath(pmid: number | string, type: 'out' | 'err' = 'out'): Promise<string | null> {
        return new Promise(resolve => {
            pm2.describe(pmid, (err, info) => {
                if (err) {
                    logger.error("PM2 describe error, " + err.message);
                    return resolve(null);
                }

                if (info.length > 1) {
                    logger.error("PM2 describe returned multiple processes!");
                    return resolve(null);
                }

                const proc = info[0];

                if (!proc) {
                    logger.warn("PM2 describe process not found");
                    return resolve(null);
                }

                const path = type === 'out' ? proc.pm2_env?.pm_out_log_path : proc.pm2_env?.pm_err_log_path;

                if (!path) {
                    logger.error(`Couldn't get PM2 log path for process #${pmid} and log type ${type}`);
                    return resolve(null);
                }

                resolve(path);
            });
        });
    }

    list(): Promise<Pm2ProcessDescription[] | null> {
        return new Promise(resolve => {
            pm2.list((err, list) => {
                if (err) {
                    logger.error("PM2 list error, " + err.message);
                    return resolve(null);
                }
                resolve(list.map(p => ({
                    name: p.name ?? "-",
                    pId: p.pid ?? -1,
                    pmId: p.pm_id ?? -1,
                    startTime: p.pm2_env?.pm_uptime ?? Date.now(),
                    restartCount: p.pm2_env?.restart_time ?? p.pm2_env?.unstable_restarts ?? 0,
                    usage: p.monit && p.pm2_env?.status !== "stopped" && {
                        memory: p.monit.memory ?? -1,
                        cpu: p.monit.cpu ?? -1
                    } || undefined,
                    status: p.pm2_env?.status ?? "-"
                })));
            });
        });
    }

    restart(pmid: number | string): Promise<OperationResult> {
        const result = new OperationResult();
        return new Promise(resolve => {
            pm2.restart(pmid, (err, proc) => {
                if (err)
                    resolve(result.failed(err.message));
                else
                    resolve(result.succeeded(proc.name));
            });
        });
    }

    stop(pmid: number | string): Promise<OperationResult> {
        const result = new OperationResult();
        return new Promise(resolve => {
            pm2.stop(pmid, (err, proc) => {
                if (err)
                    resolve(result.failed(err.message));
                else
                    resolve(result.succeeded(proc.name));
            });
        });
    }

    delete(pmid: number | string): Promise<OperationResult> {
        const result = new OperationResult();
        return new Promise(resolve => {
            pm2.delete(pmid, (err, proc) => {
                if (err)
                    resolve(result.failed(err.message));
                else
                    resolve(result.succeeded(proc.name));
            });
        });
    }

    flush(pmid: number | string): Promise<OperationResult> {
        const result = new OperationResult();
        return new Promise(resolve => {
            pm2.flush(pmid, (err, proc) => {
                if (err)
                    resolve(result.failed(err.message));
                else
                    resolve(result.succeeded(proc.name));
            });
        });
    }

    async reset(pmid: number | string): Promise<OperationResult> {
        const result = new OperationResult();

        // @ts-ignore
        if (typeof pm2.reset !== "function")
            return result.failed("No reset function available!");

        return new Promise(resolve => {
            // @ts-ignore
            (pm2.reset as typeof pm2.flush)
                (pmid, (err, proc) => {
                    if (err)
                        resolve(result.failed(err.message));
                    else
                        resolve(result.succeeded(proc.name));
                });
        });
    }

    async connect(): Promise<OperationResult> {
        return new Promise(resolve => {
            pm2.connect(err => {
                const result = new OperationResult();

                if (err) {
                    logger.error(`PM2 connect error: ${err.message}`);
                    resolve(result.failed());
                }

                logger.info("PM2 connected successfully");
                resolve(result.succeeded());
            });
        });
    }

    async disconnect() {
        pm2.disconnect();
    }
}

export default PM2Service;
