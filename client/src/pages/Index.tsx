import { useCallback, useEffect, useRef, useState } from "react";
import ContentContainer from "../components/layout/ContentContainer";
import type { Pm2ProcessDescription } from "../../../common/types/pm2";
import { Chip, Divider, Grid, Stack, Switch } from "@mui/material";
import Button from "../components/Button";
import { DataGrid } from "@mui/x-data-grid";
import UIText from "../core/i18n/UIText";
import { ChevronLeft } from "@mui/icons-material";

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
    const [autoUpdateList, setAutoUpdateList] = useState(true);
    const isLoadingList = useRef(false);
    const [list, setList] = useState<Pm2ProcessDescription[]>();

    const getList = useCallback(() => {
        if (isLoadingList.current) return;
        isLoadingList.current = true;
        window.electronAPI
            .pm2.getList()
            .then(res => {
                if (res) {
                    setList(res);
                }
            })
            .finally(() => isLoadingList.current = false);
    }, []);

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
                            Auto refresh
                            <Switch
                                checked={autoUpdateList}
                                onClick={() => setAutoUpdateList(current => !current)}
                            />
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
                            }
                        ]}
                        rows={list?.map(item => ({ id: item.pmId, ...item })) ?? []}
                    />
                </Grid>
            </Grid>
        </ContentContainer>
    );
}