import { CircularProgress, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Drawer, TableContainer, TablePagination, Typography, Button } from "@mui/material"
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { DrawerContent } from "./DrawerContent";


export interface DataType {
    "appId": string,
    "appName": string,
    "appSources": string[],
    "category": string
}

interface TableDataResp {
    tableData: DataType[];
    total: number;
    loading: boolean;
    error: boolean;
    refetch?: (page?: number, perPage?: number) => Promise<void>
}

const tableDeafultData: TableDataResp = {
    tableData: [],
    loading: false,
    error: false,
    total: 0,
}

const useBaseTableLogic = (pageDefault: number, perPageDefault: number) => {
    const [data, setData] = useState<TableDataResp>(tableDeafultData)

    const getData = useCallback((page = pageDefault, perPage = perPageDefault) => {

        const onError = (error: any) => {
            console.error(error);
            setData({ ...tableDeafultData, error: true })
        }
        try {
            setData(prev => ({ ...prev, loading: true }))
            fetch(`/api/v1/app-service/get-apps`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        "pageNumber": page,
                        "pageSize": perPage
                    }),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'ngrok-skip-browser-warning': '69420'
                    }
                },
            ).then((res) => {
                return res.json();
            }).then((res) => {
                if (res && res.appRows && res.totalCount) {
                    setData({ tableData: res.appRows, total: res.totalCount, loading: false, error: false })
                } else {
                    onError(new Error('no data'))
                }
            })
                .catch(onError)
        } catch (error) {
            onError(error)
        }
    }, [pageDefault, perPageDefault])

    useEffect(() => getData(), [getData])

    return { ...data, refetch: getData }
}

const PAGINATION_LIMITS = [25, 50]

export const BaseTable = () => {
    const [selectedItem, setSelectedItem] = useState<null | DataType>(null);
    const [perPage, setPerPage] = useState(PAGINATION_LIMITS[0]);
    const [page, setPage] = useState(1);
    const { tableData, loading, total, error, refetch } = useBaseTableLogic(page, perPage);

    if (error) return <>
        <Typography>Something wrong</Typography>
        <Button onClick={() => refetch !== undefined ? refetch() : () => { }}>Try again</Button>
    </>

    return (
        <>
            <Paper>

                <TableContainer>

                    <Table component={Paper}>
                        <TableHead>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Category
                            </TableCell>
                            <TableCell>
                                Connector
                            </TableCell>
                        </TableHead>

                        <TableBody>
                            {loading ? Array(10).fill(null).map((_, i) => (
                                <TableRow key={`table_loader_cell_${i}`}>
                                    <TableCell >
                                        <Skeleton variant="rectangular" width={'100%'} height={50} />
                                    </TableCell>
                                    <TableCell >
                                        <Skeleton variant="rectangular" width={'100%'} height={50} />
                                    </TableCell>
                                    <TableCell >
                                        <Skeleton variant="rectangular" width={'100%'} height={50} />
                                    </TableCell>
                                </TableRow>
                            )) : tableData.map(item => (

                                <TableRow key={item.appId} onClick={() => setSelectedItem(item)}>
                                    <TableCell>{item.appName}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.appSources[0]}</TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>

                    </Table>
                    <TablePagination
                        rowsPerPageOptions={PAGINATION_LIMITS}
                        component="div"
                        count={total}
                        rowsPerPage={perPage}
                        page={page}
                        onPageChange={(e, page) => setPage(page)}
                        onRowsPerPageChange={e => setPerPage(parseInt(e.target.value, 10))}
                    />
                </TableContainer>
            </Paper>
            <Drawer
                anchor={'right'}
                open={Boolean(selectedItem)}
                onClose={() => setSelectedItem(null)}
            >
                <DrawerContent item={selectedItem} />
            </Drawer>
        </>
    )
}




