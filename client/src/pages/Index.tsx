import { useCallback, useEffect, useRef, useState } from "react";
import ContentContainer from "../components/layout/ContentContainer";
import type { Pm2ProcessDescription } from "../../../common/types/pm2";
import { Badge, Box, Chip, Divider, Grid, Stack, Switch } from "@mui/material";
import Button from "../components/Button";
import { DataGrid } from "@mui/x-data-grid";
import UIText from "../core/i18n/UIText";
import { ChevronLeft, Delete, PlayArrow, ReceiptLong, Recycling, Refresh, RestartAlt, Stop } from "@mui/icons-material";
import { msToHumanReadable } from "../core/helpers/msToHumanReadable";

const statusToColor = (status: string) => {
    let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = "error";

    switch (status) {
        case "online":
            color = "success";
            break;
        case "stopped":
            color = "info";
            break;
    }

    return color;
};

export default function Index() {
    const [lastListRefreshResponseTime, setLastListRefreshResponseTime] = useState<number>();
    const [autoUpdateList, setAutoUpdateList] = useState(true);
    const isLoadingList = useRef(false);
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

                if (res) {
                    setList(res);
                }
            })
            .finally(() => {
                isLoadingList.current = false;
                refreshUI();
            });
    }, [refreshUI]);

    const start = useCallback((process: Pm2ProcessDescription) => {
        const pmId = process.pmId;
        if (lockedPmIds.current.has(pmId)) return;
        lockedPmIds.current.add(pmId);
        refreshUI();
        window.electronAPI
            .pm2.restart(pmId)
            .then(res => {

            })
            .finally(() => {
                getList();
                lockedPmIds.current.delete(pmId);
                // do not refresh ui till next get list
            });
    }, [refreshUI, getList]);

    const stop = useCallback((process: Pm2ProcessDescription) => {
        const pmId = process.pmId;
        if (lockedPmIds.current.has(pmId)) return;
        lockedPmIds.current.add(pmId);
        refreshUI();
        window.electronAPI
            .pm2.stop(pmId)
            .then(res => {

            })
            .finally(() => {
                getList();
                lockedPmIds.current.delete(pmId);
            });
    }, [refreshUI, getList]);

    useEffect(() => {
        getList();
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
                                <Button variant="outlined" color="warning">Flush all</Button>
                                <Button variant="outlined" color="info">Reset restart count</Button>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack>
                                <Box marginBottom={1} paddingInlineStart={1}>
                                    Auto refresh
                                    <Switch
                                        color="info"
                                        checked={autoUpdateList}
                                        onClick={() => setAutoUpdateList(current => !current)}
                                    />
                                </Box>
                                <Badge variant="standard" color="info" badgeContent={`${lastListRefreshResponseTime}ms`}>
                                    <Button fullWidth disabled={autoUpdateList} isLoading={isLoadingList.current} color="info" variant="outlined" startIcon={<Refresh />} onClick={getList}>Refresh</Button>
                                </Badge>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DataGrid<Pm2ProcessDescription>
                        disableColumnFilter
                        disableColumnMenu
                        disableRowSelectionOnClick
                        hideFooterPagination
                        paginationMode="client"
                        localeText={{
                            noRowsLabel: UIText.noContentToShow
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
                                renderCell: ctx => <Chip size="small" color={statusToColor(ctx.value)} icon={<ChevronLeft />} label={ctx.value} />,
                                // headerName: "UIText",
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: 'restartCount',
                                sortable: false,
                                headerName: '🔄',
                                minWidth: 50,
                                // headerName: "UIText",
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: 'startTime',
                                sortable: false,
                                minWidth: 80,
                                renderCell: ctx => ctx.row.status === 'online' ? msToHumanReadable(Date.now() - ctx.value) : '-',
                                // headerName: "UIText",
                                align: "center", headerAlign: "center",
                            },
                            {
                                field: 'operation' as keyof Pm2ProcessDescription,
                                sortable: false,
                                minWidth: 500,
                                renderCell: ctx => (
                                    <Stack gap={1} direction="row" padding={1} justifyContent="center">
                                        {
                                            ctx.row.status === 'stopped' ? (
                                                <Button
                                                    size="small"
                                                    disabled={lockedPmIds.current.has(ctx.row.pmId)}
                                                    color="success"
                                                    startIcon={<PlayArrow />}
                                                    onClick={() => start(ctx.row)}
                                                >Start</Button>
                                            ) : null
                                        }
                                        {
                                            ctx.row.status !== 'stopped' ? (
                                                <Button
                                                    size="small"
                                                    disabled={lockedPmIds.current.has(ctx.row.pmId)}
                                                    color="error"
                                                    startIcon={<Stop />}
                                                    onClick={() => stop(ctx.row)}
                                                >Stop</Button>
                                            ) : null
                                        }
                                        <Button
                                            size="small"
                                            disabled={lockedPmIds.current.has(ctx.row.pmId)}
                                            color="warning"
                                            startIcon={<RestartAlt />}
                                            onClick={() => start(ctx.row)}
                                        >Restart</Button>
                                        <Button
                                            size="small"
                                            disabled={lockedPmIds.current.has(ctx.row.pmId)}
                                            color="info"
                                            startIcon={<ReceiptLong />}
                                        >Flush</Button>
                                        {
                                            ctx.row.status === 'stopped' ? (
                                                <Button size="small" disabled={lockedPmIds.current.has(ctx.row.pmId)} color="error" startIcon={<Delete />}>Delete</Button>
                                            ) : null
                                        }
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