import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { CompositeTextInputView, TransparentCenterToolbar, VPage } from "react-native-boxes";


export default function Instagram() {
    const [username, setUserName] = useState("")
    const router = useRouter()

    const start = useCallback(() => {
        let _username = username
        if (_username?.indexOf("linkedin") > -1) {
            _username = _username.split("/")[4]
        }
        router.navigate(`linkedin/${_username?.toLocaleLowerCase()}`)
    }, [])


    return (
        <VPage style={{
            padding: 10
        }}>
            <TransparentCenterToolbar title={"Find Instagram user"} />
            <CompositeTextInputView
                returnKeyType="search"
                onDone={start}
                style={{
                    margin: 10
                }}
                onIconPress={start}
                icon="search"
                placeholder="Enter username" onChangeText={setUserName} />

        </VPage>
    )
}