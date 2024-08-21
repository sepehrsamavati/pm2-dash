import { Chip, Stack } from "@mui/material";
import UIText from "../../core/i18n/UIText";
import { AccountType } from "../../types/enums";
import DataGrid from "../../components/DataGrid";
import { UserInfoViewModel } from "@/common/types/user";
import DataGridWrapper from "../../components/DataGridWrapper";
import { useCallback, useEffect, useRef, useState } from "react";
import ContentContainer from "../../components/layout/ContentContainer";
import Button from "../../components/Button";
import { Edit } from "@mui/icons-material";

export default function UserList() {
    const initialized = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<UserInfoViewModel[]>();

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

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        fetchData();
    }, [fetchData]);

    return (
        <ContentContainer title={UIText.users}>
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
                                    <Button size="small" color="warning" startIcon={<Edit />}>{UIText.edit}</Button>
                                    <Button size="small" color="success">{UIText.activate}</Button>
                                    <Button size="small" color="error">{UIText.deactivate}</Button>
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