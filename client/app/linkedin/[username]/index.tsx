import React, { useContext, useEffect, useState } from "react";
import { AlertMessage, Spinner, TransparentCenterToolbar, VPage } from "react-native-boxes";
import { AppContext } from "../../../components/Context";
import { User } from "../../../../gen/model";
import { useLocalSearchParams } from "expo-router";
import { getGraphErrorMessage } from "../../../common/api";
import { UserNetwork } from "../../../component/UserNetwork";

export default function LinkedInUser() {
    const appContext = useContext(AppContext)
    const api = appContext.context.api
    const { username } = useLocalSearchParams()
    const [error, setError] = useState<undefined | string>(undefined)
    const [user, setUser] = useState<User | undefined | null>(null)


    useEffect(() => {
        setUser(null)
        username &&
            api.linkedinFindByUsername(username as string)
                .then(setUser)
                .then(() => { setError(undefined); })
                .catch(e => {
                    setUser(undefined)
                    setError(getGraphErrorMessage(e))
                })
    }, [])


    return (
        <VPage style={{
            padding: 10,
            paddingTop: 0,
        }}>
            <TransparentCenterToolbar title={username as string} />
            {
                error != undefined && (
                    <AlertMessage text={error} type="critical" />
                )
            }
            {
                user === null && <Spinner size="large" style={{
                    margin: 50,
                }} />
            }
            {
                user && (
                    <UserNetwork user={user} targetPlatform="instagram" />
                )
            }
        </VPage>
    )
}