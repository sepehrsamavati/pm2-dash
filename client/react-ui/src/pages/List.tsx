import UIText, { resultUIText } from "../core/i18n/UIText";
import Button from "../components/Button";
import { DataGrid } from "@mui/x-data-grid";
import { useSession } from "../core/Session";
import type { Pm2ProcessDescription } from "@/common/types/pm2";
import { useCallback, useEffect, useRef, useState } from "react";
import ContentContainer from "../components/layout/ContentContainer";
import { Badge, Box, Chip, Divider, Grid, Stack, Switch } from "@mui/material";
import { msToHumanReadable, bytesToSize } from "../core/helpers/toHumanReadable";
import { AutoDelete, CheckCircle, DeleteForever, HighlightOff, ReceiptLong, Refresh, RestartAlt, SmsFailed, Stop } from "@mui/icons-material";

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

export default function Index() {
    const session = useSession();
    const [lastListRefreshResponseTime, setLastListRefreshResponseTime] = useState(0);
    const [autoUpdateList, setAutoUpdateList] = useState(true);
    const isLoadingList = useRef(false);
    const [disableActions, setDisableActions] = useState(false);
    const [list, setList] = useState<Pm2ProcessDescription[]>();
    const lockedPmIds = useRef<Set<Pm2ProcessDescription['pmId']>>(new Set());
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

                if (Array.isArray(res)) {
                    setList(res);
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

    const flushAll = useCallback(() => {
        setDisableActions(true);
        window.electronAPI
            .pm2.flush('')
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

    useEffect(() => {
        autoUpdateList && getList();
        const timer = setInterval(() => autoUpdateList && getList(), 5e3);
        return () => {
            clearInterval(timer);
        };
    }, [getList, autoUpdateList]);

    return (
        <ContentContainer>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={1} justifyContent="space-between">
                        <Grid item>
                            <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                                <Button onClick={flushAll} variant="outlined" disabled={disableActions} color="warning">{UIText.flushAll}</Button>
                                <Button onClick={resetCounterAll} variant="outlined" disabled={disableActions} color="info">{UIText.resetAll}</Button>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack>
                                <Box marginBottom={1} paddingInlineStart={1}>
                                    {UIText.autoRefresh}
                                    <Switch
                                        color="info"
                                        checked={autoUpdateList}
                                        onClick={() => setAutoUpdateList(current => !current)}
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
                        disableColumnFilter
                        disableColumnMenu
                        disableColumnResize
                        disableRowSelectionOnClick
                        hideFooter
                        autoHeight
                        paginationMode="client"
                        localeText={{
                            noRowsLabel: UIText.noProcessInList
                        }}
                        columns={[
                            {
                                field: 'name',
                                sortable: false,
                                minWidth: 150,
                                renderCell: ctx => <><Chip size="small" label={`#${ctx.row.pmId}`} /> {ctx.value}</>,
                                // headerName: "UIText",
                                align: "left", headerAlign: "center",
                            },
                            {
                                field: 'status',
                                sortable: false,
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
                                // headerName: "UIText",
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: 'restartCount',
                                sortable: false,
                                headerName: '🔄',
                                minWidth: 50,
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: 'cpu',
                                renderCell: ctx => {
                                    if (!ctx.row.usage) return '-';
                                    const percentUsage = ctx.row.usage.cpu;
                                    return <Chip variant="outlined" color={percentUsage > 50 ? "error" : (percentUsage > 10 ? "warning" : "info")} label={ctx.row.usage?.cpu} />;
                                },
                                sortable: false,
                                headerName: UIText.cpuPercentage,
                                minWidth: 100,
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: 'memory',
                                renderCell: ctx => {
                                    if (!ctx.row.usage) return '-';
                                    const ramUsage = ctx.row.usage.memory;
                                    return <Chip variant="outlined" color={ramUsage > 1024e6 ? "error" : (ramUsage > 300e6 ? "warning" : "info")} label={bytesToSize(ramUsage)} />;
                                },
                                sortable: false,
                                headerName: UIText.memoryMegabyteUsage,
                                minWidth: 150,
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: '⌚',
                                sortable: false,
                                minWidth: 50,
                                renderCell: ctx => ctx.row.status === 'online' ? msToHumanReadable(Date.now() - ctx.row.startTime) : '-',
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: 'operation' as keyof Pm2ProcessDescription,
                                sortable: false,
                                minWidth: 500,
                                renderCell: ctx => (
                                    <Stack gap={1} direction="row" padding={1} justifyContent="center">
                                        <Button
                                            size="small"
                                            disabled={disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                            color="success"
                                            startIcon={<RestartAlt />}
                                            onClick={() => restart(ctx.row)}
                                        >{UIText.restart}</Button>
                                        <Button
                                            size="small"
                                            disabled={disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                            color="error"
                                            startIcon={<Stop />}
                                            onClick={() => stop(ctx.row)}
                                        >{UIText.stop}</Button>
                                        <Button
                                            size="small"
                                            disabled={disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                            color="warning"
                                            startIcon={<ReceiptLong />}
                                            onClick={() => flush(ctx.row)}
                                        >{UIText.flush}</Button>
                                        <Button
                                            size="small"
                                            disabled={disableActions || lockedPmIds.current.has(ctx.row.pmId)}
                                            color="info"
                                            startIcon={<AutoDelete />}
                                            onClick={() => resetCounter(ctx.row)}
                                        >{UIText.reset}</Button>
                                        <Button size="small" disabled={ctx.row.status !== 'stopped' || (disableActions || lockedPmIds.current.has(ctx.row.pmId))} color="error" startIcon={<DeleteForever />}>Delete</Button>
                                    </Stack>
                                ),
                                // headerName: "UIText",
                                align: "center", headerAlign: "center",
                            }
                        ]}
                        rows={list?.map(item => ({ id: item.pmId, ...item })) ?? []}
                    />
                </Grid>
            </Grid>
        </ContentContainer>
    );
}