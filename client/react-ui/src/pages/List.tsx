import Button from "../components/Button";
import { Permission } from "../types/enums";
import RoleHOC from "../components/RoleHOC";
import { useSession } from "../core/Session";
import { AccountType } from "../types/enums";
import DataGrid from "../components/DataGrid";
import UIText, { resultUIText } from "../core/i18n/UIText";
import type { Pm2ProcessDescription } from "@/common/types/pm2";
import permissionHelper from "../core/helpers/permissionHelper";
import { useCallback, useEffect, useRef, useState } from "react";
import Android12Switch from "../components/inputs/Android12Switch";
import ContentContainer from "../components/layout/ContentContainer";
import { msToHumanReadable, bytesToSize } from "../core/helpers/toHumanReadable";
import { Badge, Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { AutoDelete, CheckCircle, HighlightOff, ReceiptLong, Refresh, RestartAlt, Save, SmsFailed, Stop } from "@mui/icons-material";
import SelectOption from "../components/inputs/SelectOption";

const statusToColor = (status: string) => {
    let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = "error";

    switch (status as Pm2ProcessDescription['status']) {
        case "online":
            color = "success";
            break;
        case "stopping":
            color = "info";
            break;
        case "stopped":
        case "unstable":
        case "errored":
            color = "error";
            break;
    }

    return color;
};

const highlightMaxNumber = (current?: number, numbers?: (number | undefined)[]) => {

    if (!(current && numbers))
        return "outlined";

    const max = Math.max(...(numbers.filter(x => typeof x === "number") as number[]));
    if (max !== 0 && current === max)
        return "filled";
    return "outlined";
};

export default function Index() {
    const session = useSession();
    const [lastListRefreshResponseTime, setLastListRefreshResponseTime] = useState(0);
    const [autoUpdateList, setAutoUpdateList] = useState(true);
    const isLoadingList = useRef(false);
    const [autoRefreshInterval, setAutoRefreshInterval] = useState(5000);
    const [disableActions, setDisableActions] = useState(false);
    const [list, setList] = useState<Pm2ProcessDescription[]>();
    const lockedPmIds = useRef<Set<Pm2ProcessDescription['pmId']>>(new Set());
    const downloadingLogPmIds = useRef<Set<Pm2ProcessDescription['pmId']>>(new Set());
    const [, setDummy] = useState(0);
    const refreshUI = useCallback(() => setDummy(current => current + 1), []);

    const getList = useCallback(() => {
        if (isLoadingList.current) return;
        isLoadingList.current = true;
        refreshUI();
        const start = performance.now();
        window.electronAPI
            .pm2.getList()
            .then(res => {
                const end = performance.now();
                setLastListRefreshResponseTime(Math.round(end - start));

                if (Array.isArray(res.data)) {
                    setList(res.data);
                    if (session.pm2Connection)
                        session.pm2Connection.cachedList = res.data;
                } else if (typeof res === "object") {
                    session.snackbarProvider(resultUIText(res), { variant: "warning" });
                }
            })
            .finally(() => {
                isLoadingList.current = false;
                refreshUI();
            });
    }, [refreshUI, session]);

    const restart = useCallback((process: Pm2ProcessDescription) => {
        const pmId = process.pmId;
        if (lockedPmIds.current.has(pmId)) return;
        lockedPmIds.current.add(pmId);
        refreshUI();
        window.electronAPI
            .pm2.restart(pmId)
            .then(res => {
                if (!res.ok) {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => {
                getList();
                lockedPmIds.current.delete(pmId);
                // do not refresh ui till next get list
            });
    }, [refreshUI, getList, session]);

    const stop = useCallback((process: Pm2ProcessDescription) => {
        const pmId = process.pmId;
        if (lockedPmIds.current.has(pmId)) return;
        lockedPmIds.current.add(pmId);
        refreshUI();
        window.electronAPI
            .pm2.stop(pmId)
            .then(res => {
                if (!res.ok) {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => {
                getList();
                lockedPmIds.current.delete(pmId);
            });
    }, [refreshUI, getList, session]);

    const flush = useCallback((process: Pm2ProcessDescription) => {
        const pmId = process.pmId;
        if (lockedPmIds.current.has(pmId)) return;
        lockedPmIds.current.add(pmId);
        refreshUI();
        window.electronAPI
            .pm2.flush(pmId)
            .then(res => {
                if (!res.ok) {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => {
                lockedPmIds.current.delete(pmId);
                refreshUI();
            });
    }, [refreshUI, session]);

    const resetCounter = useCallback((process: Pm2ProcessDescription) => {
        const pmId = process.pmId;
        if (lockedPmIds.current.has(pmId)) return;
        lockedPmIds.current.add(pmId);
        refreshUI();
        window.electronAPI
            .pm2.resetCounter(pmId)
            .then(res => {
                if (res.ok)
                    getList();
                else {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => {
                lockedPmIds.current.delete(pmId);
                refreshUI();
            });
    }, [refreshUI, getList, session]);

    const stopAll = useCallback(() => {
        setDisableActions(true);
        window.electronAPI
            .pm2.stop('all')
            .then(res => {
                if (res.ok)
                    getList();
                else {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => setDisableActions(false));
    }, [session, getList]);

    const flushAll = useCallback(() => {
        setDisableActions(true);
        window.electronAPI
            .pm2.flush('all')
            .then(res => {
                if (!res.ok) {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => setDisableActions(false));
    }, [session]);

    const resetCounterAll = useCallback(() => {
        setDisableActions(true);
        window.electronAPI
            .pm2.resetCounter('all')
            .then(res => {
                if (res.ok)
                    getList();
                else {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => setDisableActions(false));
    }, [getList, session]);

    const downloadLogFile = useCallback((process: Pm2ProcessDescription, type: "out" | "err") => {
        const pmId = process.pmId;
        if (downloadingLogPmIds.current.has(pmId)) return;
        downloadingLogPmIds.current.add(pmId);
        refreshUI();
        window.electronAPI
            .pm2.getLogFile({ pmId, type })
            .then(res => {
                console.log(res)
            })
            .finally(() => {
                downloadingLogPmIds.current.delete(pmId);
                refreshUI();
            });
    }, [refreshUI]);

    useEffect(() => {
        autoUpdateList && getList();
        const timer = setInterval(() => autoUpdateList && getList(), autoRefreshInterval);
        return () => {
            clearInterval(timer);
        };
    }, [getList, autoUpdateList, autoRefreshInterval]);

    return (
        <ContentContainer>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={1} justifyContent="space-between">
                        <Grid item>
                            <RoleHOC roles={AccountType.Manager}>
                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                                        <Button onClick={flushAll} variant="outlined" disabled={session.readonlyMode || disableActions} color="warning">{UIText.flushAll}</Button>
                                        <Button onClick={resetCounterAll} variant="outlined" disabled={session.readonlyMode || disableActions} color="info">{UIText.resetAll}</Button>
                                        <Button onClick={stopAll} variant="outlined" disabled={session.readonlyMode || disableActions} color="error">{UIText.stopAll}</Button>
                                    </Stack>
                                </Stack>
                            </RoleHOC>
                        </Grid>
                        <Grid item>
                            <Stack>
                                <Box marginBottom={2} paddingInlineStart={1}>
                                    {UIText.autoRefresh}
                                    <Android12Switch
                                        color="info"
                                        checked={autoUpdateList}
                                        onClick={() => setAutoUpdateList(current => !current)}
                                    />
                                    <SelectOption
                                        disableFullWidth
                                        disabled={!autoUpdateList}
                                        size="small"
                                        options={[
                                            [1e3, "1s"],
                                            [2e3, "2s"],
                                            [5e3, "5s"],
                                            [10e3, "10s"],
                                            [30e3, "30s"],
                                        ]}
                                        value={autoRefreshInterval}
                                        onChange={value => setAutoRefreshInterval(value)}
                                    />
                                </Box>
                                <Badge variant="standard" color="info" showZero={false} badgeContent={lastListRefreshResponseTime && `${lastListRefreshResponseTime}ms`}>
                                    <Button fullWidth disabled={disableActions || autoUpdateList} isLoading={isLoadingList.current} color="info" variant="outlined" startIcon={<Refresh />} onClick={getList}>{UIText.refresh}</Button>
                                </Badge>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DataGrid<Pm2ProcessDescription>
                        disableColumnResize
                        disableRowSelectionOnClick
                        autoHeight
                        paginationMode="client"
                        localeText={{
                            noRowsLabel: UIText.noProcessInList
                        }}
                        columns={[
                            {
                                field: 'pmId',
                                headerName: UIText.name,
                                flex: 20,
                                minWidth: 250,
                                sortable: true,
                                renderCell: ctx => <><Chip size="small" label={`#${ctx.row.pmId}`} /> {ctx.row.name}</>,
                            },
                            {
                                field: 'status',
                                sortable: false,
                                flex: 10,
                                minWidth: 150,
                                renderCell: ctx => {
                                    let icon = <SmsFailed />;

                                    switch (ctx.row.status) {
                                        case "online":
                                            icon = <CheckCircle />;
                                            break;
                                        case "errored":
                                        case "stopping":
                                        case "stopped":
                                            icon = <HighlightOff />;
                                            break;
                                    }

                                    return <Chip color={statusToColor(ctx.value)} icon={icon} label={ctx.value} />;
                                },
                            },
                            {
                                field: 'restartCount',
                                flex: 8,
                                sortable: true,
                                headerName: UIText.restarts,
                                renderCell: ctx => <Typography component="span" fontFamily="monospace">{ctx.value}</Typography>,
                                minWidth: 90,
                            },
                            {
                                field: 'cpuUsage' as keyof Pm2ProcessDescription,
                                sortable: true,
                                flex: 5,
                                headerName: UIText.cpuPercentage,
                                minWidth: 100,
                                valueGetter: (_, ctx) => ctx.usage?.cpu,
                                renderCell: ctx => {
                                    if (!ctx.row.usage) return '-';
                                    const percentUsage = ctx.row.usage.cpu;
                                    return <Chip variant={highlightMaxNumber(ctx.row.usage.cpu, list?.map(x => x.usage?.cpu))} color={percentUsage > 50 ? "error" : (percentUsage > 10 ? "warning" : "info")} label={ctx.row.usage?.cpu} />;
                                },
                            },
                            {
                                field: 'memoryUsage' as keyof Pm2ProcessDescription,
                                sortable: true,
                                flex: 10,
                                headerName: UIText.memoryMegabyteUsage,
                                minWidth: 150,
                                valueGetter: (_, ctx) => ctx.usage?.memory,
                                renderCell: ctx => {
                                    if (!ctx.row.usage) return '-';
                                    const ramUsage = ctx.row.usage.memory;
                                    return <Chip variant={highlightMaxNumber(ctx.row.usage.memory, list?.map(x => x.usage?.memory))} color={ramUsage > 1024e6 ? "error" : (ramUsage > 300e6 ? "warning" : "info")} label={bytesToSize(ramUsage)} />;
                                },
                            },
                            {
                                field: 'startTime',
                                headerName: UIText.uptime,
                                sortable: true,
                                minWidth: 80,
                                flex: 7,
                                renderCell: ctx => <Typography component="span" fontFamily="monospace">{ctx.row.status === 'online' ? msToHumanReadable(Date.now() - ctx.row.startTime) : '-'}</Typography>,
                            },
                            {
                                field: 'operation' as keyof Pm2ProcessDescription,
                                headerName: UIText.operation,
                                sortable: false,
                                minWidth: 650,
                                flex: 40,
                                renderCell: ctx => (
                                    <Stack gap={1} direction="row" padding={1} justifyContent="center">

                                        {permissionHelper({
                                            session, processName: ctx.row.name,
                                            operation: Permission.RestartProcess
                                        }) ? (
                                            <Button
                                                size="small"
                                                disabled={session.readonlyMode || disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                                color="success"
                                                startIcon={<RestartAlt />}
                                                onClick={() => restart(ctx.row)}
                                            >{UIText.restart}</Button>
                                        ) : null}

                                        {permissionHelper({
                                            session, processName: ctx.row.name,
                                            operation: Permission.StopProcess
                                        }) ? (
                                            <Button
                                                size="small"
                                                disabled={session.readonlyMode || disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                                color="error"
                                                startIcon={<Stop />}
                                                onClick={() => stop(ctx.row)}
                                            >{UIText.stop}</Button>
                                        ) : null}

                                        {permissionHelper({
                                            session, processName: ctx.row.name,
                                            operation: Permission.GetOutputLog
                                        }) ? (
                                            <Button
                                                size="small"
                                                isLoading={downloadingLogPmIds.current.has(ctx.row.pmId)}
                                                disabled={disableActions}
                                                color="info"
                                                variant="outlined"
                                                startIcon={<Save />}
                                                onClick={() => downloadLogFile(ctx.row, "out")}
                                            >Out</Button>
                                        ) : null}

                                        {permissionHelper({
                                            session, processName: ctx.row.name,
                                            operation: Permission.GetErrorLog
                                        }) ? (
                                            <Button
                                                size="small"
                                                isLoading={downloadingLogPmIds.current.has(ctx.row.pmId)}
                                                disabled={disableActions}
                                                color="warning"
                                                variant="outlined"
                                                startIcon={<Save />}
                                                onClick={() => downloadLogFile(ctx.row, "err")}
                                            >Err</Button>
                                        ) : null}

                                        {permissionHelper({
                                            session, processName: ctx.row.name,
                                            operation: Permission.FlushProcess
                                        }) ? (
                                            <Button
                                                size="small"
                                                disabled={session.readonlyMode || disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                                color="warning"
                                                startIcon={<ReceiptLong />}
                                                onClick={() => flush(ctx.row)}
                                            >{UIText.flush}</Button>
                                        ) : null}

                                        {permissionHelper({
                                            session, processName: ctx.row.name,
                                            operation: Permission.ResetProcess
                                        }) ? (
                                            <Button
                                                size="small"
                                                disabled={session.readonlyMode || disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                                color="info"
                                                startIcon={<AutoDelete />}
                                                onClick={() => resetCounter(ctx.row)}
                                            >{UIText.reset}</Button>
                                        ) : null}

                                        {/* {permissionHelper({
                                            session, processName: ctx.row.name,
                                            operation: Permission.DeleteProcess
                                        }) ? (
                                            <Button
                                                size="small"
                                                disabled={session.readonlyMode || ctx.row.status !== 'stopped' || (disableActions || lockedPmIds.current.has(ctx.row.pmId))}
                                                color="error"
                                                startIcon={<DeleteForever />}
                                            >Delete</Button>
                                        ) : null} */}

                                    </Stack>
                                ),
                            }
                        ]}
                        rows={list?.map(item => ({ id: item.pmId, ...item })) ?? []}
                    />
                </Grid>
            </Grid>
        </ContentContainer>
    );
}