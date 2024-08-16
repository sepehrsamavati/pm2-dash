type Pm2ProcessStatus = 'online' | 'stopping' | 'stopped' | 'launching' | 'errored' | 'one_launch_status' | 'restarting' | 'unstable' | 'memory_exceeded' | 'cpu_exceeded' | (string & {});

export type Pm2ProcessDescription = {
    name: string;
    pId: number;
    pmId: number;
    startTime: number;
    restartCount: number;
    usage?: {
        memory: number;
        cpu: number;
    };
    status: Pm2ProcessStatus;
}