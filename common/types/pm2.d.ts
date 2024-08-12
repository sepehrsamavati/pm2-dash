export type Pm2ProcessDescription = {
    name: string;
    pId: number;
    pmId: number;
    usage?: {
        memory: number;
        cpu: number;
    };
    status: string;
}