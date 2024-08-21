import UIText from "../core/i18n/UIText";
import { useSession } from "../core/Session";
import { DataGrid as MuiDataGrid, type DataGridProps, type GridColDef, type GridValidRowModel } from "@mui/x-data-grid";

type GenericColumn<T extends GridValidRowModel> = (Omit<GridColDef<T>, 'field'> & {
    field: keyof T;
})[];

/**
 * Wrapper around MUI DataGrid; Applies default props  
 * + Default values  
 * + Pagination change page number + 1 (change zero-based behavior)
 */
export default function DataGrid<T extends GridValidRowModel>(props: Omit<DataGridProps<T>, 'columns'> & { columns: GenericColumn<T>; }) {
    const { localStorage } = useSession();
    return (
        <MuiDataGrid<T>
            disableColumnFilter
            disableColumnMenu
            disableRowSelectionOnClick
            paginationMode="server"
            autoHeight={true}
            localeText={{
                noRowsLabel: UIText.noContentToShow,
                footerRowSelected: count => UIText.rowsSelected.format(count)
            }}
            {...props}
            columns={(props.columns as GridColDef<T>[]).map(c => (
                {
                    sortable: false,
                    headerName: UIText[c.field as keyof typeof UIText],
                    align: "center", headerAlign: "center",
                    ...c,
                }))}
            hideFooterPagination={(props.loading && !Array.isArray(props.rows)) || props.hideFooterPagination}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: localStorage.data.pageSize
                    }
                }
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(p, a) => {
                localStorage.data.pageSize = p.pageSize;
                localStorage.rewrite();
                if (props.onPaginationModelChange)
                    props.onPaginationModelChange({ ...p, page: p.page + 1 }, a);
            }}
            rowCount={props.rowCount ?? 0}
            rows={props.rows ?? []}
        />
    );
}