import { useEffect, useState } from "react"
import { DataType } from "./BaseTable"
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Skeleton } from "@mui/material";

export const DrawerContent = ({ item }: { item: DataType | null }) => {

    const { appId } = item || {}
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<null | string[]>(null)

    useEffect(() => {
        if (appId) {

            setLoading(true)
            fetch(`/api/v1/app-service/get-app-overview-users/${appId}`,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'ngrok-skip-browser-warning': '69420'
                    }
                },
            ).then((res) => {
                return res.json();
            }).then((res) => {
                console.log('🚀 ~ res:', res);
                if (res.appUsers) setData(res.appUsers)
                else {
                    console.error(new Error('get users trouble'))
                    setLoading(false)
                }

            }).catch(console.error)
                .finally(() => setLoading(false))


            return () => {
                setData(null)
            }
        }

    }, [appId])
    if (!item) return null

    const dataToArray = item ? Object.entries(item).map(([key, value]) => ({ key, value })) : null

    return <>
        <div className='area'>
            {dataToArray ? dataToArray.map(item => (<span><b>{item.key}</b>: {item.value}</span>)) : null}
        </div>

        {loading ? <>
            <Skeleton variant="rectangular" width={'100%'} height={50} />
            <Skeleton variant="rectangular" width={'100%'} height={50} />
            <Skeleton variant="rectangular" width={'100%'} height={50} />
        </> :
            data ? data.map(item => (
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                {item[0]}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item} />
                    </ListItem>
                </List>)
            ) : null}
    </>
}