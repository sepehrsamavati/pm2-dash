import pm2 from "pm2";
import { OperationResult } from "../models/OperationResult";

const logger = console;

class PM2Service {

    init() {
        this.#connect();
    }

    async dispose() {
        pm2.disconnect();
    }

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

    list(): Promise<pm2.ProcessDescription[] | null> {
        return new Promise(resolve => {
            pm2.list((err, list) => {
                if (err) {
                    logger.error("PM2 list error, " + err.message);
                    return resolve(null);
                }
                resolve(list);
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

    #connect() {
        pm2.connect(err => {
            if (err) {
                logger.error(`PM2 connect error: ${err.message}`);
                return;
            }

            logger.info("PM2 connected successfully");
        });
    }
}

const pm2Service = new PM2Service();

export default pm2Service;
