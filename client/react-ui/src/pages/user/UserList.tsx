import UIText from "../../core/i18n/UIText";
import Button from "../../components/Button";
import RoleHOC from "../../components/RoleHOC";
import { useSession } from "../../core/Session";
import { AccountType } from "../../types/enums";
import DataGrid from "../../components/DataGrid";
import { Chip, Grid, Stack } from "@mui/material";
import RoundedBox from "../../components/RoundedBox";
import { UserInfoViewModel } from "@/common/types/user";
import { AddBoxOutlined, Edit } from "@mui/icons-material";
import DataGridWrapper from "../../components/DataGridWrapper";
import { useCallback, useEffect, useRef, useState } from "react";
import ContentContainer from "../../components/layout/ContentContainer";
import CreateEditUserDialog, { type CreateEditUserDialogRef } from "./CreateEditUserDialog";

export default function UserList() {
    const session = useSession();
    const initialized = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<UserInfoViewModel[]>();
    const [disableActions, setDisableActions] = useState(false);
    const createEditUserDialogRef = useRef<CreateEditUserDialogRef>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true);
        window.electronAPI.users
            .getList()
            .then(res => {
                if (Array.isArray(res.data))
                    setData(res.data);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const activate = useCallback((id: UserInfoViewModel['id']) => {
        setDisableActions(true);
        window.electronAPI.users
            .activate(id)
            .then(res => {
                if (res.ok)
                    fetchData();
            })
            .finally(() => setDisableActions(false));
    }, [fetchData]);

    const deactivate = useCallback((id: UserInfoViewModel['id']) => {
        setDisableActions(true);
        window.electronAPI.users
            .deactivate(id)
            .then(res => {
                if (res.ok)
                    fetchData();
            })
            .finally(() => setDisableActions(false));
    }, [fetchData]);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        fetchData();
    }, [fetchData]);

    return (
        <ContentContainer title={UIText.users}>

            <CreateEditUserDialog
                ref={createEditUserDialogRef}
                afterUpsert={fetchData}
            />

            <RoundedBox>
                <Grid container gap={2}>
                    <RoleHOC roles={AccountType.Admin}>
                        <Grid item>
                            <Button
                                size="small"
                                color="success"
                                disabled={session.readonlyMode}
                                onClick={() => createEditUserDialogRef.current?.openCreateForm()}
                                startIcon={<AddBoxOutlined />}
                            >{UIText.createUser}</Button>
                        </Grid>
                    </RoleHOC>
                </Grid>
            </RoundedBox>

            <DataGridWrapper>
                <DataGrid<UserInfoViewModel>
                    paginationMode="client"
                    loading={isLoading || !Boolean(data)}
                    columns={[
                        {
                            field: "username",
                            minWidth: 150,
                            flex: 20,
                            renderCell: ctx => <Chip label={ctx.value} />
                        },
                        {
                            field: "type",
                            minWidth: 150,
                            flex: 15,
                            renderCell: ctx => <Chip size="small" variant="outlined" label={AccountType[ctx.value]} />
                        },
                        {
                            field: "isActive",
                            headerName: UIText.status,
                            minWidth: 150,
                            flex: 15,
                            renderCell: ctx => <Chip size="small" variant="outlined" color={ctx.value ? "success" : "error"} label={ctx.value ? UIText.active : UIText.inactive} />
                        },
                        {
                            field: "operation" as keyof UserInfoViewModel,
                            minWidth: 350,
                            flex: 50,
                            renderCell: ctx => (
                                <Stack direction="row" padding={1} spacing={2} justifyContent="center">
                                    {ctx.row.type !== AccountType.Admin ? (
                                        <>
                                            <Button disabled={session.readonlyMode || disableActions} size="small" color="warning" startIcon={<Edit />} onClick={() => createEditUserDialogRef.current?.openEditForm(ctx.row)}>{UIText.edit}</Button>
                                            {
                                                ctx.row.isActive
                                                    ? <Button onClick={() => deactivate(ctx.row.id)} disabled={session.readonlyMode || disableActions} size="small" color="error">{UIText.deactivate}</Button>
                                                    : <Button onClick={() => activate(ctx.row.id)} disabled={session.readonlyMode || disableActions} size="small" color="success">{UIText.activate}</Button>
                                            }
                                        </>
                                    ) : null}
                                </Stack>
                            )
                        }
                    ]}
                    rows={data}
                />
            </DataGridWrapper>
        </ContentContainer>
    );
}