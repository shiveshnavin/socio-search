import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ButtonView, CompositeTextInputView, Spinner, TransparentCenterToolbar, VPage } from "react-native-boxes";
import { AppContext } from "../../components/Context";
import { gql } from "@apollo/client";
import { User } from "../../../gen/model";
import { UserNetwork } from "../../component/UserNetwork";
import { getGraphErrorMessage } from "../../common/api";


export default function Instagram() {

    const { api } = useContext(AppContext).context
    const { platform } = useLocalSearchParams()

    const [username, setUserName] = useState("")
    const [error, setError] = useState<undefined | string>(undefined)
    const [user, setUser] = useState<User | undefined | null>()



    useEffect(() => {

    }, [])

    return (
        <VPage style={{
            padding: 10
        }}>
            <TransparentCenterToolbar title={"Find Instagram user"} />
            <CompositeTextInputView
                style={{
                    margin: 10
                }}
                onIconPress={() => {
                    setUser(null)
                    username &&
                        api.igFindByUsername(username)
                            .then(setUser)
                            .then(() => { setError(undefined); })
                            .catch(e => {
                                setError(getGraphErrorMessage(e))
                            })
                }}
                icon="search"
                alertText={error}
                placeholder="Enter username" onChangeText={setUserName} />

            {
                user === null && <Spinner size="large" style={{
                    margin: 30
                }} />
            }
            {
                user && (
                    <UserNetwork user={user} />
                )
            }
        </VPage>
    )
}